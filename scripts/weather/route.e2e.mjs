/**
 * Teste app/api/meteo/route.ts de bout en bout contre un FAUX Open-Meteo (même format que l'API documentée) :
 * réponse correcte, cache de 10 minutes, paramètres envoyés, erreurs 400/500, réponse corrompue, service lent ou éteint.
 *
 *   npm run build && npm run test:meteo:route
 *
 * Démarre plusieurs serveurs `next start` (ports 3020 et suivants) et un faux service sur le port 4010.
 * Ne contacte jamais le vrai Open-Meteo.
 */
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
// Identifiant propre à cette exécution : le cache de données de Next.js survit aux redémarrages, une adresse neuve évite de relire une réponse d'un essai précédent.
const RUN = Date.now();
const hits = {};
const fixture = { latitude: 46.16, longitude: 5.98, generationtime_ms: 0.04, utc_offset_seconds: 0, timezone: 'GMT', timezone_abbreviation: 'GMT', elevation: 428,
  current_units: { time: 'iso8601', interval: 'seconds', temperature_2m: '°C', weather_code: 'wmo code', cloud_cover: '%', visibility: 'm' },
  current: { time: '2026-11-23T13:15', interval: 900, temperature_2m: 3.2, relative_humidity_2m: 97, is_day: 1, precipitation: 0, rain: 0, showers: 0, snowfall: 0, weather_code: 45, cloud_cover: 100, visibility: 210, wind_speed_10m: 3.6, wind_direction_10m: 48 } };
const upstream = http.createServer((req, res) => {
  const scenario = req.url.split('/')[1]; (hits[scenario] ||= []).push(req.url);
  if (scenario === 'ok') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(fixture)); }
  if (scenario === 'err500') { res.statusCode = 500; return res.end('{"error":true,"reason":"boom"}'); }
  if (scenario === 'bad400') { res.statusCode = 400; return res.end('{"error":true,"reason":"Cannot initialize ForecastVariable from invalid String value"}'); }
  if (scenario === 'garbage') { res.setHeader('content-type', 'application/json'); return res.end('<html>pas du json'); }
  if (scenario === 'noCurrent') { res.setHeader('content-type', 'application/json'); return res.end('{"latitude":46.1}'); }
  if (scenario === 'slow') return setTimeout(() => res.end(JSON.stringify(fixture)), 20000);   // dépasse le délai de 6 s
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function withServer(port, env, fn) {
  const child = spawn('npx', ['next', 'start', '-p', String(port)], { cwd: ROOT, env: { ...process.env, ...env }, stdio: 'ignore' });
  for (let i = 0; i < 40; i++) { try { await fetch(`http://localhost:${port}/robots.txt`); break; } catch { await sleep(250); } }
  try { return await fn(`http://localhost:${port}/api/meteo`); } finally { child.kill('SIGKILL'); await sleep(300); }
}
(async () => {
  await new Promise((r) => upstream.listen(4010, '127.0.0.1', r));
  let port = 3020;
  const get = async (url) => { const t = Date.now(); const r = await fetch(url); return { status: r.status, cc: r.headers.get('cache-control'), body: await r.json(), ms: Date.now() - t }; };

  await withServer(port++, { OPEN_METEO_URL: `http://127.0.0.1:4010/ok/${RUN}/v1/forecast`, OPEN_METEO_API_KEY: 'cle-de-test' }, async (url) => {
    const a = await get(url);
    assert.equal(a.status, 200); assert.equal(a.body.weather.condition, 'fog'); assert.ok(a.body.weather.fog > 0.85); assert.equal(a.body.weather.temperature, 3.2);
    assert.equal(a.body.weather.wind, 3.6); assert.equal(a.body.weather.windDir, 48);
    assert.equal(a.cc, 'public, max-age=60, s-maxage=600, stale-while-revalidate=300');
    console.log('✓ réponse correcte : brouillard dense, 3,2 °C, vent 3,6 km/h du 48° ; en-tête', a.cc);
    await get(url); await get(url);
    assert.equal(hits.ok.length, 1, 'amont appelé ' + hits.ok.length + ' fois'); console.log('✓ cache serveur : 3 requêtes du site, 1 seul appel à Open-Meteo');
    const q = new URL('http://x' + hits.ok[0]).searchParams;
    assert.equal(q.get('latitude'), '46.1567'); assert.equal(q.get('longitude'), '5.9874'); assert.equal(q.get('wind_speed_unit'), 'kmh'); assert.equal(q.get('timezone'), 'GMT'); assert.equal(q.get('apikey'), 'cle-de-test');
    assert.ok(q.get('current').split(',').includes('weather_code') && q.get('current').split(',').includes('visibility'));
    console.log('✓ paramètres envoyés : coordonnées de la station, vent en km/h, clé d’abonnement, variables :', q.get('current'));
  });
  for (const [scenario, label] of [['err500', 'erreur 500 d’Open-Meteo'], ['bad400', 'erreur 400 (variable refusée)'], ['garbage', 'réponse qui n’est pas du JSON'], ['noCurrent', 'JSON sans bloc « current »']]) {
    await withServer(port++, { OPEN_METEO_URL: `http://127.0.0.1:4010/${scenario}/${RUN}/v1/forecast` }, async (url) => {
      const r = await get(url); assert.equal(r.status, 200); assert.equal(r.body.weather, null); assert.equal(r.cc, 'public, max-age=30, s-maxage=60');
      console.log('✓', label.padEnd(34), '→ HTTP 200 { weather: null }, cache court :', r.cc);
    });
  }
  await withServer(port++, { OPEN_METEO_URL: `http://127.0.0.1:4010/slow/${RUN}/v1/forecast` }, async (url) => {
    const r = await get(url); assert.equal(r.status, 200); assert.equal(r.body.weather, null); assert.ok(r.ms < 8000 && r.ms > 5000, 'durée ' + r.ms);
    console.log('✓ service trop lent : abandon au bout de', (r.ms / 1000).toFixed(1), 's → { weather: null }');
  });
  await withServer(port++, { OPEN_METEO_URL: `http://127.0.0.1:4999/jamais/${RUN}/v1/forecast` }, async (url) => {
    const r = await get(url); assert.equal(r.status, 200); assert.equal(r.body.weather, null); console.log('✓ service éteint (connexion refusée) → { weather: null }');
  });
  upstream.close(); console.log('route : tout passe');
})().catch((e) => { console.error('✗', e.message); process.exit(1); });

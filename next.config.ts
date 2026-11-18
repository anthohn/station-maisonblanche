import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La page des offres s'appelait /promotions. Cette adresse est imprimée sur des QR codes
      // en magasin et référencée par Google : on la garde, en redirection permanente.
      { source: "/promotions", destination: "/offres", permanent: true },
    ];
  },
};

export default nextConfig;

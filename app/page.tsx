import React from "react";

export default function ComingSoon() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-300 text-white p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[100px]" />
            </div>

            <main className="z-10 max-w-2xl w-full text-center space-y-8">

                {/* Logo or Brand Name Placeholder */}
                <div className="animate-fade-in-down">
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-orange-600 whitespace-nowrap">
                        Station Maison Blanche SA
                    </h1>
                </div>

                {/* Main Message */}
                <div className="space-y-4 animate-fade-in-up delay-100">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Site en construction
                    </h2>
                    <p className="text-lg text-slate-900 max-w-lg mx-auto leading-relaxed">
                        Nous travaillons activement pour vous offrir une nouvelle expérience.
                        Revenez bientôt !
                    </p>
                </div>
            </main>

            <footer className="absolute bottom-6 text-center text-slate-500 text-sm z-10">
                &copy; {new Date().getFullYear()} Station Maison Blanche SA. Tous droits réservés.
            </footer>
        </div>
    );
}

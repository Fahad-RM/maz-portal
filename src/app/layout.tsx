import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAZ Platform — Autonomous AI Business Agents & Control Panel",
  description: "Enterprise multi-tenant AI business agent platform by Maifelz Technologies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  MAZ <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">by Maifelz</span>
                </span>
                <span className="text-[10px] text-slate-500 tracking-wide font-medium">ENTERPRISE AI AGENT PLATFORM</span>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <a
                href="/admin"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Maifelz Super-Admin
              </a>
              <a
                href="/dashboard"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              >
                Customer Bot Studio
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          © 2026 Maifelz Technologies LLP. All rights reserved. • Built for teams that demand high-conversion AI agents.
        </footer>
      </body>
    </html>
  );
}

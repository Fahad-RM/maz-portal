import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://maz-portal.vercel.app"),
  title: {
    default: "MAZ Platform — Autonomous AI Business Agents & Control Panel | Maifelz Technologies",
    template: "%s | Maifelz Technologies"
  },
  description: "Enterprise multi-tenant AI business agent platform by Maifelz Technologies. Ground autonomous AI chatbots in company knowledge, qualify leads with BANT scoring, and synchronize with Odoo ERP & Xero.",
  keywords: [
    "Maifelz Technologies",
    "MAZ AI",
    "Autonomous AI Agents",
    "Enterprise AI Chatbot",
    "Odoo Partner ERP Integration",
    "Xero Accounting Sync",
    "BANT Lead Scoring",
    "Multi-Tenant SaaS Portal",
    "Gemini 3.5 Flash-Lite AI",
    "Customer Support Automation"
  ],
  authors: [{ name: "Maifelz Technologies LLP", url: "https://www.maifelz.com" }],
  creator: "Maifelz Technologies LLP",
  publisher: "Maifelz Technologies LLP",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MAZ Platform — Autonomous AI Business Agents | Maifelz Technologies",
    description: "Enterprise AI business agent platform with multi-tenant customer seats, Odoo ERP & Xero integration, and real-time streaming RAG.",
    url: "https://maz-portal.vercel.app",
    siteName: "Maifelz Technologies MAZ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAZ Platform — Autonomous AI Business Agents | Maifelz Technologies",
    description: "Enterprise multi-tenant AI business platform with Odoo CRM integration and hybrid RAG knowledge grounding.",
  },
  alternates: {
    canonical: "https://maz-portal.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.maifelz.com/#organization",
      "name": "Maifelz Technologies LLP",
      "url": "https://www.maifelz.com",
      "logo": "https://www.maifelz.com/logo.png",
      "sameAs": [
        "https://www.linkedin.com/company/maifelz",
        "https://twitter.com/maifelz"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@maifelz.com",
        "contactType": "customer service"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "MAZ AI Business Engine",
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Enterprise autonomous AI business agent platform with hybrid multi-source RAG, BANT lead scoring, and native Odoo ERP & Xero integration."
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  MAZ <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/30">by Maifelz</span>
                </span>
                <span className="text-[9px] text-slate-400 tracking-wider font-semibold">ENTERPRISE AI PLATFORM</span>
              </div>
            </a>

            <nav className="flex items-center gap-2.5">
              <a
                href="/admin"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition"
              >
                Super-Admin
              </a>
              <a
                href="/dashboard"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm shadow-blue-600/30"
              >
                Customer Studio
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-white/10 bg-slate-950 py-6 text-center text-xs text-slate-500">
          © 2026 Maifelz Technologies LLP. All rights reserved. • Built for teams that demand high-conversion AI agents.
        </footer>
      </body>
    </html>
  );
}

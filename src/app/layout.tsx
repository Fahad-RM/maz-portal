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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white relative">
        {/* Fixed Professional Enterprise Background Image with Clearer Visibility */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply transition-opacity duration-500"
          style={{ backgroundImage: "url('/bg-enterprise.jpg')" }}
          aria-hidden
        />
        {/* Soft overlay gradient to ensure clean readability */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/60 via-white/30 to-purple-50/50" aria-hidden />

        <div className="sticky top-0 z-50 flex justify-center px-4 pt-3 pb-0 pointer-events-none">
          <header className="pointer-events-auto w-full max-w-5xl bg-white/85 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-900/[0.06] px-4 sm:px-6 h-14 flex items-center justify-between transition-all duration-300">
            <a href="/" className="flex items-center gap-2.5 group">
              <img
                src="/maz-logo.png"
                alt="MAZ by Maifelz Technologies LLP"
                className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition duration-200"
              />
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 tracking-wide">
                Enterprise AI Engine
              </span>
            </a>

            <nav className="flex items-center gap-1.5 sm:gap-2">
              <a
                href="/pricing"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50/60 transition flex items-center gap-1"
              >
                Pricing &amp; Plans
              </a>
              <a
                href="/admin"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition"
              >
                Super-Admin
              </a>
              <a
                href="/dashboard"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white transition shadow-sm shadow-purple-900/20 hover:shadow-md hover:shadow-purple-900/30 hover:-translate-y-px"
              >
                Customer Studio
              </a>
            </nav>
          </header>
        </div>

        <main className="flex-1 pt-2">{children}</main>

        <footer className="relative z-10 border-t border-slate-200/60 bg-white/80 backdrop-blur-md py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/maz-logo.png" alt="Maifelz" className="h-4.5 w-auto object-contain opacity-80" />
              <span className="text-slate-600 font-medium text-[11px]">© 2026 Maifelz Technologies LLP • Official Odoo ERP Partner</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 text-[11px]">
              <a href="/pricing" className="hover:text-purple-700 font-medium transition">Pricing</a>
              <span>•</span>
              <a href="/dashboard" className="hover:text-purple-700 font-medium transition">Customer Portal</a>
              <span>•</span>
              <a href="/admin" className="hover:text-purple-700 font-medium transition">Master Admin</a>
              <span>•</span>
              <a href="https://www.maifelz.com" target="_blank" rel="noreferrer" className="hover:text-purple-700 font-medium transition">Official Site</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white">
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src="/maz-logo.png"
                alt="MAZ by Maifelz Technologies LLP"
                className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-sm brightness-100 group-hover:scale-105 transition duration-200"
              />
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Enterprise AI Engine
              </span>
            </a>

            <nav className="flex items-center gap-2 sm:gap-3">
              <a
                href="/pricing"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                Pricing &amp; Plans
              </a>
              <a
                href="/admin"
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              >
                Super-Admin
              </a>
              <a
                href="/dashboard"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white transition shadow-sm shadow-purple-900/25"
              >
                Customer Studio
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/maz-logo.png" alt="Maifelz" className="h-5 w-auto object-contain opacity-80" />
              <span className="text-slate-600 font-medium">© 2026 Maifelz Technologies LLP • Official Odoo ERP Partner</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <a href="/pricing" className="hover:text-purple-700 transition">Pricing</a>
              <span>•</span>
              <a href="/dashboard" className="hover:text-purple-700 transition">Customer Portal</a>
              <span>•</span>
              <a href="/admin" className="hover:text-purple-700 transition">Master Admin</a>
              <span>•</span>
              <a href="https://www.maifelz.com" target="_blank" rel="noreferrer" className="hover:text-purple-700 transition">Official Site</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

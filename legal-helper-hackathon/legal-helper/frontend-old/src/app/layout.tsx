import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Scale } from "lucide-react";

// Use Inter for UI text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Use Playfair Display for Headings (Serif adds authority)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "AI Legal Helper | Your Legal Assistant",
  description: "Advanced AI-powered assistant for Indian Law, IPC, BNS, and Case Laws.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen font-sans antialiased text-slate-900`}>
        <div className="flex flex-col min-h-screen">
          {/* Glassmorphic Navbar */}
          <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/20">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
              <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <div className="p-2 bg-blue-900 rounded-lg text-white">
                  <Scale className="h-5 w-5" />
                </div>
                <span className="font-serif font-bold text-xl text-blue-950 tracking-tight">LegalHelper.ai</span>
              </Link>

              <div className="flex gap-1">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-900 hover:bg-blue-50/50 rounded-md transition-all"
                >
                  Assistant
                </Link>
                <Link
                  href="/comparison"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-900 hover:bg-blue-50/50 rounded-md transition-all"
                >
                  Statute Comparison
                </Link>
              </div>
            </div>
          </nav>

          <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
            <div className="animate-in-up">
              {children}
            </div>
          </main>

          <footer className="border-t bg-white/50 backdrop-blur-sm py-6 mt-12">
            <div className="container mx-auto px-6 text-center text-sm text-slate-500">
              <p>© 2026 AI Legal Helper. Built for Indian Law Hackathon.</p>
              <p className="mt-1 text-xs">Powered by Google Gemini & ChromaDB</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

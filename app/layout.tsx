import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "AI Game Recommender",
  description:
    "A video game recommender app built with machine learning and artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-gutter-stable">
      <body className="min-h-screen bg-linear-to-br from-dark-950 via-dark-900 to-secondary-900">
        <ConvexClientProvider>
          {/* Simple radial gradients for depth */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accent-500/3 rounded-full blur-3xl"></div>
          </div>

          {/* Main Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <main className="min-h-screen">
              <Header />
              <div className="relative">{children}</div>
            </main>
            <Footer />
          </div>

          {/* Floating Elements */}
          <div className="fixed top-20 right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-xl float-animation pointer-events-none no-print"></div>
          <div
            className="fixed bottom-20 left-10 w-24 h-24 bg-secondary-500/10 rounded-full blur-xl float-animation pointer-events-none no-print"
            style={{ animationDelay: "2s" }}
          ></div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

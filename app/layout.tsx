import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Game Recommender",
  description:
    "A video game recommender app built with Next.js and Convex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="en"
        className={cn("font-sans", geist.variable)}
        data-scroll-behavior="smooth"
        suppressHydrationWarning
      >
        <head />
        <body className="min-h-screen bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            scriptProps={{ type: "application/json" }}
          >
            <TooltipProvider>
              <ConvexClientProvider>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <main className="min-h-screen">
                    <Header />
                    <div className="relative">{children}</div>
                  </main>
                  <Footer />
                </div>
              </ConvexClientProvider>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}

import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";
import Providers from "@/components/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AESTHETE — Indian Travel Directory & Editorial Blog",
  description: "A premium travel and blog directory platform focused on India, featuring micro-location filtering, maps, and multilingual support.",
  openGraph: {
    title: "AESTHETE — Indian Travel Directory & Editorial Blog",
    description: "A premium travel and blog directory platform focused on India, featuring micro-location filtering, maps, and multilingual support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="bg-editorial-bg text-editorial-text selection:bg-editorial-accent selection:text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}

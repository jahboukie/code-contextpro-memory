import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CodeContext Pro - Stop Paying for AI Amnesia",
  description: "Transform your AI assistant from goldfish to elephant with persistent memory and code execution superpowers. Free tier available.",
  keywords: "AI assistant, code execution, persistent memory, developer tools, AI coding",
  authors: [{ name: "CodeContext Pro Team" }],
  openGraph: {
    title: "CodeContext Pro - Stop Paying for AI Amnesia",
    description: "Give your AI assistant persistent memory and code execution superpowers",
    url: "https://codecontextpro.com",
    siteName: "CodeContext Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeContext Pro - Stop Paying for AI Amnesia",
    description: "Transform your AI assistant from goldfish to elephant",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import 'fumadocs-ui/style.css';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SigmaVote | Secure Voting Auth",
  description: "Cryptographic electronic voting prototype using Homomorphic Encryption & ZKPs.",
};


import { RootProvider } from 'fumadocs-ui/provider/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}


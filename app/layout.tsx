import type { Metadata } from "next";
import { Archivo } from "next/font/google";

import 'fumadocs-ui/style.css';
import "./globals.css";
const archivo = Archivo({
  variable: "--font-sans",
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
      <body className={`${archivo.variable} font-sans antialiased`}>
        <RootProvider theme={{ forcedTheme: 'dark' }}>
            {children}
        </RootProvider>
      </body>
    </html>
  );
}

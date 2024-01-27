import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrain = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fermi Pro",
  description: "Next gen DEX on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrain.className}>{children}</body>
    </html>
  );
}

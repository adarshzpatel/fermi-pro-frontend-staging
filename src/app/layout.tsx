import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

const jetbrain = JetBrains_Mono({ subsets: ["latin"],weight:"variable" });

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
      <body className={"bg-gray-950 " + jetbrain.className}>
      <Navigation/>
        <main>{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

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
    <html suppressHydrationWarning={true} lang="en">
      <body  className={"bg-gray-900 " + jetbrain.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

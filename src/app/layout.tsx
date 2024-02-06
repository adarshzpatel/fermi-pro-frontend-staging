import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import AppLayout from "@/components/layout/AppLayout";

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
      <body  className={"bg-gray-950 " + jetbrain.className}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}

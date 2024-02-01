"use client";
import { NextUIProvider } from "@nextui-org/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo, useState, useEffect } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";

type ProviderProps = {
  children: React.ReactNode;
};

const SolanaWalletProviders = ({ children }: ProviderProps) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <>
      <ConnectionProvider
        endpoint={endpoint}
        config={{ commitment: "finalized" }}
      >
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

const Providers = ({ children }: ProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        {/* <Spinner label="Loading..." /> */}
        <h1 className="font-bold text-xl animate-pulse">FERMI</h1>
      </div>
    );
  }
  return (
    <SolanaWalletProviders>
      <NextUIProvider>{children}</NextUIProvider>
    </SolanaWalletProviders>
  );
};

export default Providers;

"use client";

import CustomWalletConnectButton from "@/components/layout/CustomConnectWalletButton";
import TradePageLayout from "@/components/layout/TradePageLayout";
import StyledCard from "@/components/shared/StyledCard";
import AccountData from "@/components/trade/AccountData";
import MarketDetails from "@/components/trade/MarketDetails";
import Orderbook from "@/components/trade/Orderbook";
import TradeForm from "@/components/trade/TradeForm";
import { MARKETS } from "@/solana/constants";
import { useFermiStore } from "@/stores/fermiStore";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const marketParam = searchParams?.get("market");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const connectedWallet = useAnchorWallet();
  const { connection } = useConnection();
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const { fetchMarket, fetchOpenOrders, connectClientToWallet } = useFermiStore(
    (s) => s.actions,
  );
  // if no market param, redirect to first market
  useLayoutEffect(() => {
    if (!marketParam) {
      router.replace(`/?market=${MARKETS[0].marketPda}`);
    }
  }, [marketParam, router]);

  useEffect(() => {
    if (connectedWallet && marketParam) {
      const init = async () => {
        await connectClientToWallet(connectedWallet, connection);
        await fetchMarket(new PublicKey(marketParam));
        await fetchOpenOrders();
      };
      init();
    }
  }, [connectedWallet, connection, marketParam]);

  return (
    <>
      {!connectedWallet && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-gray-900/50 backdrop-blur-xl">
          Please Connect Wallet to continue
          <CustomWalletConnectButton />
        </div>
      )}
      <div className="min-h-screen">
        <TradePageLayout
          tradeForm={<TradeForm />}
          chart={<StyledCard>Chart</StyledCard>}
          orderbook={<Orderbook />}
          accountData={<AccountData />}
          marketDetails={<MarketDetails />}
        />
      </div>
    </>
  );
}

"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shared/ResizablePanels";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useLayoutEffect, useState } from "react";

import AccountData from "@/components/account/AccountData";
import { MARKETS } from "@/solana/constants";
import MarketList from "@/components/trade-form/MarketList";
import MarketSelector from "@/components/trade-form/MarketSelector";
import Navigation from "@/components/layout/Navigation";
import Orderbook from "@/components/orderbook/Orderbook";
import { PublicKey } from "@solana/web3.js";
import { Spinner } from "@nextui-org/react";
import TradeChart from "@/components/chart/TradeChart";
import TradeForm from "@/components/trade-form/TradeForm";
import TutorialPopover from "@/components/TutorialPopover";
import { toast } from "sonner";
import { useFermiStore } from "@/stores/fermiStore";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const marketParam = searchParams?.get("market");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMarketListOpen, setIsMarketListOpen] = useState(false);
  const connectedWallet = useAnchorWallet();
  const { connection } = useConnection();
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const client = useFermiStore((s) => s.client);
  const set = useFermiStore((s) => s.set);
  const [showTutorial,setShowTutorial] = useState(false);
  const {
    fetchEventHeap,
    fetchOpenOrders,
    fetchOrderbook,
    connectClientToWallet,
  } = useFermiStore((s) => s.actions);

  useLayoutEffect(() => {
    if (!marketParam) {
      const storedMarket = localStorage.getItem("selectedMarket");
      const defaultMarket = storedMarket
        ? JSON.parse(storedMarket)
        : MARKETS[0];
      router.replace(`/?market=${defaultMarket.marketPda}`);
    }
  }, [marketParam, router]);

  const findAndSetMarket = async (marketPk: string) => {
    setIsMarketListOpen(false);
    try {
      const { marketPda, baseTokenName, quoteTokenName } =
        MARKETS.find((it) => it.marketPda === marketPk) ?? MARKETS[0];
      const marketAccount = await client.deserializeMarketAccount(
        new PublicKey(marketPda)
      );
      if (marketAccount === null) throw new Error("Market is Null");
      set((s) => {
        s.selectedMarket = {
          publicKey: new PublicKey(marketPda),
          current: marketAccount,
          baseTokenName,
          quoteTokenName,
        };
        s.orderbook = undefined;
        s.openOrders = undefined;
      });

      localStorage.setItem("selectedMarket", JSON.stringify({ marketPda }));

      // toast.success(
      //   "Market Changed to " + `${baseTokenName}-${quoteTokenName}`
      // );
    } catch (err: any) {
      console.log("[MARKET]", err);
      toast.error("Market Not Found");
    }
  };

  useEffect(() => {
    if (connection && connectedWallet?.publicKey && marketParam) {
      const init = async () => {
        setLoading(true);
        await connectClientToWallet(connectedWallet, connection);
        await findAndSetMarket(marketParam);
        await fetchOrderbook();
        await fetchEventHeap();
        await fetchOpenOrders();
        setLoading(false);
        setShowTutorial(true);
      };
      init();
    }
  }, [connection, connectedWallet, marketParam]);

  return (
    <>
      <main className="h-screen bg-gradient-to-t from-primary-700 to-primary-500 flex flex-col space-y-4  text-white p-4 bg-gradient">
        <Navigation />
        {connectedWallet?.publicKey ? (
          loading ? (
            <div className="bg-gray-900 rounded-xl p-4 flex-1 text-3xl grid place-items-center text-white/60 border border-gray-600 shadow-2xl shadow-gray-950/50">
              <Spinner label="Loading..." color="primary" size="lg" />
            </div>
          ) : (
            <ResizablePanelGroup
              direction="horizontal"
              className="bg-gray-900 rounded-xl p-4  border border-gray-600 shadow-2xl shadow-gray-950/50 "
            >
              <ResizablePanel>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    defaultSize={20}
                    className="bg-gray-800 rounded-xl flex flex-col border border-gray-600"
                  >
                    <MarketSelector
                      handleClick={() => setIsMarketListOpen((prev) => !prev)}
                    />
                    {isMarketListOpen ? (
                      <MarketList
                        markets={MARKETS.filter(
                          (it) =>
                            it.marketPda !==
                            selectedMarket?.publicKey.toString()
                        )}
                        // handleSelect={findAndSetMarket}
                      />
                    ) : (
                      <TradeForm />
                    )}
                  </ResizablePanel>
                  {/* <ResizableHandle/>
              <ResizablePanel
                defaultSize={20}
                className="bg-gray-800 rounded-xl flex flex-col border border-gray-600"
              ></ResizablePanel> */}
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle />
              <ResizablePanel
                defaultSize={50}
                className="bg-gray-800 rounded-xl"
              >
                <ResizablePanelGroup
                  direction="vertical"
                  className="bg-gray-900"
                >
                  <ResizablePanel
                    defaultSize={50}
                    className="bg-gray-800 rounded-xl border border-gray-500 text-white/50 grid place-items-center text-xl "
                  >
                    <TradeChart />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel
                    defaultSize={50}
                    className="bg-gray-800 rounded-xl flex flex-col border border-gray-600 "
                  >
                    <AccountData />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                defaultSize={25}
                className="bg-gray-800 flex flex-col rounded-xl border shadow-xl border-gray-600"
              >
                <Orderbook />
              </ResizablePanel>
            </ResizablePanelGroup>
          )
        ) : (
          <div className="bg-gray-900 rounded-xl p-4 flex-1 text-3xl grid place-items-center text-white/60 border border-gray-600 shadow-xl">
            Please connect wallet to continue.
          </div>
        )}

        {showTutorial && <TutorialPopover/>}
      </main>
    </>
  );
}

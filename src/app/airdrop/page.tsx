"use client";
import CreateOpenOrdersAccountModal from "@/components/shared/CreateAccountModal";
import { MARKETS } from "@/solana/constants";
import { fetchTokenBalance } from "@/solana/utils/helpers";
import { useFermiStore } from "@/stores/fermiStore";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";
import MarketSelector from "@/components/trade-form/MarketSelector";
import MarketList from "@/components/trade-form/MarketList";
import Navigation from "@/components/layout/Navigation";
type Balances = { baseBalance: string; quoteBalance: string };

const Airdrop = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const marketParam = searchParams?.get("market");
  const selectedMarket = useFermiStore((state) => state.selectedMarket);
  const connectedWallet = useAnchorWallet();
  const { connection } = useConnection();
  const client = useFermiStore((s) => s.client);
  const set = useFermiStore((s) => s.set);
  const [isMarketListOpen, setIsMarketListOpen] = useState(false);
  const {
    isOpen: isCreateOOModalOpen,
    onOpen: openCreateOOModal,
    onClose: closeCreateOOModal,
    onOpenChange: onCreateOOModalOpenChange,
  } = useDisclosure({ id: "create-oo-modal" });

  const [balances, setBalances] = useState<Balances>({
    quoteBalance: "0.00",
    baseBalance: "0.00",
  });
  useLayoutEffect(() => {
    if (!marketParam) {
      router.replace(`/airdrop?market=${MARKETS[0].marketPda}`);
    }
  }, [marketParam, router]);

  const findAndSetMarket = async (marketPk: string) => {
    try {
      console.log("[MARKET] Fetching ... ");
      const { marketPda, baseTokenName, quoteTokenName } =
        MARKETS.find((it) => it.marketPda === marketPk) ?? MARKETS[0];
      console.log(
        "[MARKET IDENTIFIED] ",
        `${baseTokenName}-${quoteTokenName} |`,
        marketPda
      );
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
      });

      console.log("[MARKET] Fetch Succesfull");
    } catch (err: any) {
      console.log("[MARKET]", err);
      toast.error("Market Not Found");
    }
  };
  useEffect(() => {
    if (client && marketParam) {
      findAndSetMarket(marketParam);
    }
  }, [marketParam]);
  const getQuoteBalance = async () => {
    try {
      setBalances((prev) => ({
        ...prev,
        quoteBalance: "Fetching...",
      }));
      if (!connectedWallet?.publicKey) throw new Error("Wallet not connected");
      if (!selectedMarket?.current) throw new Error("Market not selected");

      const quoteBalance = await fetchTokenBalance(
        connectedWallet?.publicKey,
        selectedMarket.current?.quoteMint,
        connection
      );

      setBalances((prev) => ({
        ...prev,
        quoteBalance: (Number(quoteBalance) / 1000000).toFixed(2),
      }));
    } catch (err) {
      setBalances((prev) => ({
        ...prev,
        quoteBalance: "0.00",
      }));
      console.log("Error in getQuoteBalance", err);
    }
  };
  const getBaseBalance = async () => {
    try {
      setBalances((prev) => ({
        ...prev,
        baseBalance: "Fetching...",
      }));
      if (!connectedWallet?.publicKey) throw new Error("Wallet not connected");
      if (!selectedMarket?.current) throw new Error("Market not selected");

      const baseBalance = await fetchTokenBalance(
        connectedWallet.publicKey,
        selectedMarket.current?.baseMint,
        connection
      );
      setBalances((prev) => ({
        ...prev,
        baseBalance: (Number(baseBalance) / 1000000000).toFixed(2),
      }));
    } catch (err) {
      setBalances((prev) => ({
        ...prev,
        baseBalance: "0.00",
      }));
      console.log("Error in getBaseBalance", err);
    }
  };

  const airdropToken = async (mint: string, amount: number) => {
    try {
      setIsLoading(true);
      const data = {
        destinationAddress: connectedWallet?.publicKey,
        mint,
        amount,
      };
      console.log(data);
      const res = await axios.post("/api/airdrop", data);
      console.log(res.data);
      await getBaseBalance();
      await getQuoteBalance();
      toast.success("Airdrop Successful ✅");
    } catch (err) {
      toast.error("Failed to send airdrop!!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connectedWallet && selectedMarket) {
      getBaseBalance();
      getQuoteBalance();
    }
  }, [selectedMarket, connectedWallet]);

  // if (!isMarketLoading && !selectedMarket.publicKey) {
  //   return (
  //     <Layout>
  //       <div className="flex items-center justify-center screen-center">
  //         INVALID MARKET
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <>
      <Navigation />
      <div className="screen-center">
        <div className="border-default-200 from-default-100/75 to-default-100/75 relative flex w-full max-w-md flex-col gap-4 overflow-hidden rounded-xl border bg-gradient-to-br via-black p-6">
          {/* PAY SECTION */}
          <div className="flex items-center justify-between gap-4 rounded-xl">
            <p className="whitespace-nowrap  text-2xl font-medium">
              Airdrop Tokens
            </p>
          </div>
          <div className="bg-default-100/80 border-default-300 rounded-xl  border p-4">
            <p className="font-medium">Market</p>
            <p className="text-default-600 text-xs">
              {selectedMarket !== undefined
                ? selectedMarket?.publicKey?.toString()
                : "Loading Market...."}
            </p>
          </div>
          <div className="bg-default-100/80 border-default-300 rounded-xl border p-4">
            <p className="font-medium">Quote token</p>
            <p className="text-default-600 text-xs">
              {selectedMarket !== undefined
                ? selectedMarket.current?.quoteMint.toString()
                : "Loading..."}
            </p>
            <Button
              isDisabled={selectedMarket === undefined}
              radius="none"
              onClick={() => {
                if (!selectedMarket?.current) return;
                airdropToken(
                  selectedMarket?.current?.quoteMint.toString(),
                  1000 * 1000000
                );
              }}
              size="sm"
              className="my-2"
              color="primary"
            >
              Airdrop 1000 quote tokens
            </Button>
            <p>Balance : {balances.quoteBalance}</p>
          </div>
          <div className="bg-default-100/80 border-default-300 rounded-xl  border p-4">
            <p className="font-medium">Base Token</p>
            <p className="text-default-600 text-xs">
              {selectedMarket !== undefined
                ? selectedMarket.current?.baseMint.toString()
                : "Loading..."}
            </p>
            <Button
              isDisabled={selectedMarket === undefined}
              onClick={() => {
                if (!selectedMarket?.current) return;
                airdropToken(
                  selectedMarket.current?.baseMint.toString(),
                  1000 * 1000000000
                );
              }}
              size="sm"
              radius="none"
              className="my-2"
              color="primary"
            >
              Airdrop 1000 base tokens
            </Button>
            <p>Balance : {balances.baseBalance}</p>
          </div>
          <div className="bg-gray-900">
            <MarketSelector
              handleClick={() => setIsMarketListOpen((prev) => !prev)}
            />
            {isMarketListOpen && (
              <MarketList
                markets={MARKETS.filter(
                  (it) => it.marketPda !== selectedMarket?.publicKey.toString()
                )}
                handleSelect={findAndSetMarket}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Airdrop;

"use client";
import AppLayout from "@/components/layout/AppLayout";
import CreateOpenOrdersAccountModal from "@/components/trade/CreateAccountModal";
import MarketSelector from "@/components/shared/MarketSelector";
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
type Balances = { baseBalance: string; quoteBalance: string };

const Airdrop = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const selectedMarketPda = searchParams?.get("market");
  const openOrdersAccountPk = useFermiStore(
    (state) => state.openOrders?.publicKey,
  );

  const updateMarket = useFermiStore((state) => state.actions.fetchMarket);
  const selectedMarket = useFermiStore((state) => state.selectedMarket);
  const fetchOpenOrders = useFermiStore(
    (state) => state.actions.fetchOpenOrders,
  );
  const connectedWallet = useAnchorWallet();
  const { connection } = useConnection();

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
    if (!selectedMarketPda) {
      router.push("/airdrop?market=" + MARKETS[0].marketPda);
    } else {
      updateMarket(new PublicKey(selectedMarketPda));
    }
  }, [selectedMarketPda]);

  useEffect(() => {
    if (selectedMarket?.publicKey) {
      fetchOpenOrders();
    }
  }, [selectedMarket]);

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
        connection,
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
      if (!selectedMarket.current) throw new Error("Market not selected");

      const baseBalance = await fetchTokenBalance(
        connectedWallet.publicKey,
        selectedMarket.current?.baseMint,
        connection,
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
    <div className="screen-center">
      <div className="border-default-200 from-default-100/75 to-default-100/75 relative flex w-full max-w-md flex-col gap-4 overflow-hidden rounded-xl border bg-gradient-to-br via-black p-6">
        {/* PAY SECTION */}
        <div className="flex items-center justify-between gap-4 rounded-xl">
          <p className="whitespace-nowrap  text-2xl font-medium">
            Airdrop Tokens
          </p>
          <MarketSelector />
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
                1000 * 1000000,
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
                1000 * 1000000000,
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
        <div className="bg-default-100/80 border-default-300 rounded-xl border p-4">
          <p className="mb-2 font-medium">
            Open orders account{" "}
            {openOrdersAccountPk == undefined && `( Loading )`}
          </p>
          {openOrdersAccountPk ? (
            <p className="text-xs">{openOrdersAccountPk.toString()}</p>
          ) : (
            <Button
              radius="none"
              size="sm"
              color="primary"
              onClick={() => openCreateOOModal()}
            >
              Create open orders account
            </Button>
          )}
        </div>
        {isLoading && (
          <div className="absolute left-0 top-0 z-10 flex h-full w-full scale-[0.995] flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-xl">
            <Spinner size="lg" />
            <p>Loading...</p>
          </div>
        )}
      </div>
      <CreateOpenOrdersAccountModal
        closeModal={closeCreateOOModal}
        isOpen={isCreateOOModalOpen}
      />
    </div>
  );
};

export default Airdrop;

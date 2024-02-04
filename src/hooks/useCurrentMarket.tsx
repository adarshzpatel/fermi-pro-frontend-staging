import { MARKETS } from "@/solana/constants";
import { useFermiStore } from "@/stores/fermiStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const useCurrentMarket = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const marketPdaParam = searchParams?.get("market");
  const currentMarket = useFermiStore((s) => s.selectedMarket);
  const updateMarket = useFermiStore((s) => s.actions.updateMarket);
  const isMarketLoading = useFermiStore((s) => s.isMarketLoading);

  const marketName = useMemo(() => {
    if (currentMarket?.publicKey != undefined) {
      return (
        MARKETS.find(
          (market) =>
            market.marketPda.toString() === currentMarket?.publicKey?.toString()
        )?.name ?? "UNKNOWN MAKRET"
      );
    } else {
      return "INVALID MARKET";
    }
  }, [currentMarket]);

  const { baseTokenName, quoteTokenName } = useMemo(() => {
    if (marketName) {
      const splits = marketName.split("/");
      const baseTokenName = splits[0];
      const quoteTokenName = splits[1];
      return { baseTokenName, quoteTokenName };
    }
    return { baseTokenName: "UNKNOWN", quoteTokenName: "UNKNOWN" };
  }, [marketName]);

  useEffect(() => {
    if (marketPdaParam) {
      console.log(
        "Found market pda param , updating market to",
        marketPdaParam
      );
      updateMarket(marketPdaParam);
    } else {
      console.log(
        "No market pda param found, updating market to",
        MARKETS[0].marketPda
      );
      router.replace("/?market=" + MARKETS[0].marketPda);
    }
  }, [marketPdaParam]);

  useEffect(()=>{
    if(currentMarket?.publicKey){

    }
  },[currentMarket])
  return { currentMarket, marketName, isMarketLoading, updateMarket ,baseTokenName,quoteTokenName};
};

export default useCurrentMarket;

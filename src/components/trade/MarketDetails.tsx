import useCurrentMarket from "@/hooks/useCurrentMarket";
import { useFermiStore } from "@/stores/fermiStore";
import { ScrollShadow, Spinner } from "@nextui-org/react";
import React from "react";
import { CopyableText } from "../shared/Copyable";

type Props = {};

const MarketDetails = (props: Props) => {
  const {
    marketName,
    isMarketLoading,
    currentMarket,
    baseTokenName,
    quoteTokenName,
  } = useCurrentMarket();

  if (isMarketLoading) {
    return (
      <div className="h-full w-full animate-pulse flex items-center justify-center">
        <Spinner label="Loading market..." />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h6 className="font-bold text-2xl ">{marketName}</h6>
      <ScrollShadow className="space-y-2 mt-2 h-[240px]">
        <p className="font-medium text-sm">
          Market
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket?.publicKey?.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Base Token Mint ({baseTokenName})
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket?.publicKey?.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Quote Token Mint ({quoteTokenName})
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket?.publicKey?.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Base Lot Size ({baseTokenName})
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket.current?.baseLotSize.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Quote Lot Size ({quoteTokenName})
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket.current?.quoteLotSize.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Maker Fee
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket.current?.makerFee.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Maker Volume
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket.current?.makerVolume.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Market Base Vault
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket.current?.marketBaseVault.toString() ?? ""}
          />
        </p>
        <p className="font-medium text-sm">
          Market Quote Vault
          <CopyableText
            className="text-xs text-gray-400"
            textToCopy={currentMarket.current?.marketQuoteVault.toString() ?? ""}
          />
        </p>
      </ScrollShadow>
    </div>
  );
};

export default MarketDetails;

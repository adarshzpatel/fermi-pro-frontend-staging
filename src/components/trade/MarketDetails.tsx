import useCurrentMarket from "@/hooks/useCurrentMarket";
import { ScrollShadow, Spinner } from "@nextui-org/react";
import React from "react";
import { CopyableText } from "../shared/Copyable";
import StyledCard from "../shared/StyledCard";

const MarketDetails = () => {
  const { marketName, currentMarket, baseTokenName, quoteTokenName } =
    useCurrentMarket();

  if (!currentMarket?.publicKey) {
    return (
      <StyledCard>
        <div className="flex h-full w-full animate-pulse items-center justify-center">
          <Spinner label="Loading market..." />
        </div>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <div className="p-4">
        <h6 className="text-2xl font-bold ">{marketName}</h6>
        <ScrollShadow className="mt-2 h-[240px] space-y-2">
          <p className="text-sm font-medium">
            Market
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={currentMarket?.publicKey?.toString() ?? ""}
            />
          </p>
          <p className="text-sm font-medium">
            Base Token Mint ({baseTokenName})
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={currentMarket?.publicKey?.toString() ?? ""}
            />
          </p>
          <p className="text-sm font-medium">
            Quote Token Mint ({quoteTokenName})
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={currentMarket?.publicKey?.toString() ?? ""}
            />
          </p>
          <p className="text-sm font-medium">
            Base Lot Size ({baseTokenName})
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={currentMarket.current?.baseLotSize.toString() ?? ""}
            />
          </p>
          <p className="text-sm font-medium">
            Quote Lot Size ({quoteTokenName})
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={currentMarket.current?.quoteLotSize.toString() ?? ""}
            />
          </p>
          <p className="text-sm font-medium">
            Maker Fee
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={currentMarket.current?.makerFee.toString() ?? ""}
            />
          </p>
          <p className="text-sm font-medium">
            Maker Volume
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={currentMarket.current?.makerVolume.toString() ?? ""}
            />
          </p>
          <p className="text-sm font-medium">
            Market Base Vault
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={
                currentMarket.current?.marketBaseVault.toString() ?? ""
              }
            />
          </p>
          <p className="text-sm font-medium">
            Market Quote Vault
            <CopyableText
              className="text-xs text-gray-400"
              textToCopy={
                currentMarket.current?.marketQuoteVault.toString() ?? ""
              }
            />
          </p>
        </ScrollShadow>
      </div>
    </StyledCard>
  );
};

export default MarketDetails;

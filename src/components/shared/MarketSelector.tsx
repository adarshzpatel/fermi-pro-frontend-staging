import useCurrentMarket from "@/hooks/useCurrentMarket";
import { MARKETS } from "@/solana/constants";
import { useFermiStore } from "@/stores/fermiStore";
import { Select, SelectItem, Selection } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const MarketSelector = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { updateMarket, isMarketLoading } = useCurrentMarket();
  const [selectedKeys, setSelectedKeys] = useState([MARKETS[0].marketPda]);

  const changeMarket = async (marketPda: string) => {
    if(!searchParams) return;
    console.log("Changing market to", marketPda);
    const params = new URLSearchParams(searchParams);
    params.set("market", marketPda);
    replace(`${pathname}?${params.toString()}`);
    const knownMarket = MARKETS.find((m) => m.marketPda === marketPda);
    console.log("Known market", knownMarket);
    if (knownMarket) {
      setSelectedKeys([marketPda]);
      await updateMarket(knownMarket.marketPda);
    }
  };

  const onSelectionChange = (key: Selection) => {
    const marketPubKey = Array.from(key)[0];
    changeMarket(marketPubKey as string);
  };

  return (
    <Select
      label="Select Market"
      placeholder="Select Market"
      variant="faded"
      size="lg"
      classNames={{
        value: "text-lg font-medium",
        label: "text-gray-500 mb-1",
        trigger: "bg-gray-800 hover:bg-gray-800/50",
      }}
      multiple={false}
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      isLoading={isMarketLoading}
    >
      {MARKETS.map((m) => (
        <SelectItem
          aria-label={`${m.name}`}
          key={m.marketPda}
          value={m.marketPda}
          textValue={`${m.name}`}
        >
          {m.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default MarketSelector;

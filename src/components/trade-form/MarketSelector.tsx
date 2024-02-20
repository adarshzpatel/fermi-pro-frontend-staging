import { shortenAddress } from "@/solana/utils/helpers";
import { useFermiStore } from "@/stores/fermiStore";
import React from "react";
import { HiChevronDown } from "react-icons/hi2";

const MarketSelector = ({ handleClick }: { handleClick: () => void }) => {
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  return (
    <>
      <button
        onClick={handleClick}
        className="p-4 hover:bg-gray-900/50 border-b focus:bg-gray-900/50 outline-none duration-200   ease-out   rounded-t-xl border-gray-700 flex items-center justify-between w-full"
      >
        <div className="text-xl text-left">
       {selectedMarket?.publicKey ? (`${selectedMarket?.baseTokenName}-${selectedMarket?.quoteTokenName}`):"Loading..."}
          <span className="text-xs text-white/40 block">
            {shortenAddress(selectedMarket?.publicKey.toString() ?? "")}
          </span>
        </div>
        <HiChevronDown className="h-6 w-6" />
      </button>
    </>
  );
};

export default MarketSelector;

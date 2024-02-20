"use client"
import { MarketType } from "@/solana/constants";
import { shortenAddress } from "@/solana/utils/helpers";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const MarketList = ({
  markets,
  // handleSelect,
}: {
  markets: MarketType[];
  // handleSelect: (marketPk:string) => void;
}) => {
  const router = useRouter()
  const pathname = usePathname();

  return (
    <div className="rounded-b-xl relative shadow-2xl divide-y divide-gray-700 flex-1 overflow-y-scroll ">
      {markets.map((it) => (
        <div
          onClick={()=> router.replace(pathname+`?market=${it.marketPda}`)}
          key={`market-${it.marketPda}`}
          className="p-4 group hover:bg-gray-700/50 cursor-pointer duration-200 ease-out text-white/70 hover:text-white "
        >
          <div className="">
            {it.baseTokenName}-{it.quoteTokenName}
            <span className="text-xs text-white/30 group-hover:text-white/40 block">
              {shortenAddress(it?.marketPda)}
            </span>
          </div>
        </div>
      ))}
       <div className="text-center text-xs text-white/40 p-4">  --- </div>  
    </div>
  );
};

export default MarketList;

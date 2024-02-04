import useCurrentMarket from "@/hooks/useCurrentMarket";
import { BN } from "@coral-xyz/anchor";
import { Skeleton } from "@nextui-org/react";
import React, { useMemo, useState } from "react";

const Orderbook = () => {
  const {
    currentMarket: { bids, asks },
  } = useCurrentMarket();

  return (
    <div id="orderbook" aria-label="orderbook" className="p-4">
      {/* Bids */}
      <div className="text-sm">
        <div className="flex text-gray-400 pb-1 justify-between">
          <div>Price</div>
          <div>Size</div>
          <div>Price</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-1 space-y-1 text-emerald-500 ">
            {bids
              ? bids.map((item, i: number) => (
                  <div
                  key={`bidc-${item.key.toString()}`}
                    className="flex justify-between bg-emerald-500/10"
                  >
                    <p>{new BN(item.key).shrn(64).toString()}</p>
                    <p>{item?.quantity.toString()}</p>
                  </div>
                ))
              : [...Array(10)].map((_, i) => (
                  <Skeleton
                    key={"loading-asks-" + i}
                    className="h-4 col-span-1 bg-gray-900 opacity-50"
                  />
                ))}
          </div>
          <div className="col-span-1 space-y-1 text-rose-500 ">
            {asks
              ? asks.map((item: any, i: number) => (
                  <div
                    key={`ask-${item.key.toString()}`}
                    className="flex justify-between bg-rose-500/10"
                  >
                    <p>{new BN(item.key).shrn(64).toString()}</p>
                    <p>{item?.quantity.toString()}</p>
                  </div>
                ))
              : [...Array(10)].map((_, i) => (
                  <Skeleton
                    key={"loading-asks-" + i}
                    className="h-4 col-span-1 bg-gray-900 opacity-50"
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderbook;

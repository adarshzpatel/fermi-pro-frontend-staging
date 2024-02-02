import useCurrentMarket from "@/hooks/useCurrentMarket";
import { BN } from "@coral-xyz/anchor";
import { Skeleton } from "@nextui-org/react";
import React, { useState } from "react";

type Props = {};

const Orderbook = (props: Props) => {
  const {
    currentMarket: { bids, asks },
  } = useCurrentMarket();
  const [isLoading, setIsLoading] = useState(true);

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
          <div className="col-span-1 space-y-1 text-emerald-500 bg-emerald-500/10">
            {bids
              ? bids.map((item, i) => (
                  <div
                    key={`bid-${
                      item?.clientOrderId?.toString() +
                      item?.key.toString().slice(0, 5)
                    }`}
                    className="flex justify-between"
                  >
                    <p>{new BN(item?.key).shrn(64).toString()}</p>
                    <p>{item?.quantity?.toString()}</p>
                  </div>
                ))
              : [...Array(10)].map((_, i) => (
                  <Skeleton
                    key={"loading-asks-" + i}
                    className="h-4 col-span-1 bg-gray-900 opacity-50"
                  />
                ))}
          </div>
          <div className="col-span-1 space-y-1 text-rose-500">
            {asks
              ? asks.map((item, i) => (
                  <div
                    key={`ask-${
                      item?.clientOrderId?.toString() +
                      item?.key.toString().slice(0, 5)
                    }`}
                    className="flex justify-between"
                  >
                    <p>{item?.quantity?.toString()}</p>
                    <p>{new BN(item?.key).shrn(64).toString()}</p>
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

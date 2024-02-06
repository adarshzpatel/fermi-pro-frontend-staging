import useCurrentMarket from "@/hooks/useCurrentMarket";
import { BN } from "@coral-xyz/anchor";
import { Skeleton } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import StyledCard from "../shared/StyledCard";
import { useFermiStore } from "@/stores/fermiStore";




const Orderbook = () => {
  const orderbook = useFermiStore((s) => s.orderbook);
  const [bids, asks] = useMemo(() => {
    if (!orderbook) return [null, null];
    const bids = orderbook.bids
      ? orderbook.bids.map((item) => ({
          key: "bid-" + item.key.toString(),
          price: new BN(item.key).shrn(64).toString(),
          quantity: item.quantity.toString(),
        }))
      : [];
    const asks = orderbook.asks
      ? orderbook.asks.map((item) => ({
          key: "ask-" + item.key.toString(),
          price: new BN(item.key).shrn(64).toString(),
          quantity: item.quantity.toString(),
        }))
      : [];

    return [bids, asks];
  }, [orderbook]);

  return (
    <StyledCard>
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
              {bids ? (
                bids.length !== 0 ? (
                  bids.map((item, i: number) => (
                    <div
                      key={item.key}
                      className="flex justify-between bg-emerald-500/10"
                    >
                      <p>{item.price}</p>
                      <p>{item.quantity}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-left "> No Asks Found </div>
                )
              ) : (
                [...Array(10)].map((_, i) => (
                  <Skeleton
                    key={"loading-asks-" + i}
                    className="h-4 col-span-1 bg-gray-900 opacity-50"
                  />
                ))
              )}
            </div>
            <div className="col-span-1 space-y-1 text-rose-500 ">
              {asks ? (
                asks.length !== 0 ? (
                  asks.map((item: any, i: number) => (
                    <div
                      key={item.key}
                      className="flex justify-between bg-rose-500/10"
                    >
                      <p>{item.price}</p>
                      <p>{item.quantity}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-right "> No Asks Found </div>
                )
              ) : (
                [...Array(10)].map((_, i) => (
                  <Skeleton
                    key={"loading-asks-" + i}
                    className="h-4 col-span-1 bg-gray-900 opacity-50"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </StyledCard>
  );
};

export default Orderbook;

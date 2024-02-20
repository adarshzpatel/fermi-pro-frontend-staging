import React from "react";
import LastTradedPrice from "./LastTradedPrice";
import Bids from "./Bids";
import Asks from "./Asks";
import { useFermiStore } from "@/stores/fermiStore";

type Props = {};

const Orderbook = (props: Props) => {
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const orderbook = useFermiStore(s=>s.orderbook);
  return (
    <>
      <div className="border-b px-3 py-2   border-gray-600 text-lg bg-gray-900/50">
        Orderbook
      </div>
      <div className="text-xs  flex-1 flex flex-col">
        <div className="flex text-white/40 bg-gray-900 border-b border-gray-600 p-3 py-2 justify-between items-center">
          <div>
            Price{" "}
            <span className="p-0.5 px-1.5 rounded-sm bg-gray-800">
              {selectedMarket?.quoteTokenName ?? "QUOTE"}
            </span>
          </div>
          <div>
            Quantity{" "}
            <span className="p-0.5 px-1.5 rounded-sm bg-gray-800">
              {selectedMarket?.baseTokenName ?? "BASE"}
            </span>
          </div>
        </div>

        <Asks data={orderbook?.asks} />
        <LastTradedPrice />
        <Bids data={orderbook?.bids}/>
      </div>
    </>
  );
};

export default Orderbook;

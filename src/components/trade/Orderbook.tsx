import { Skeleton } from "@nextui-org/react";
import React, { useState } from "react";

type Props = {};

const Orderbook = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const asks = [];
  const bids = [];
  return (
    <div id="orderbook" aria-label="orderbook" className="p-3">
      {/* Bids */}
      <div className="text-sm">
        <div className="flex text-gray-400 pb-1 justify-between">
          <div>Price</div>
          <div>Size</div>
          <div>Price</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-1 space-y-1">
            {[...Array(10)].map((_, i) => (
              <Skeleton
                key={"loading-asks-" + i}
                className="h-4 col-span-1 bg-gray-900 opacity-50"
              />
            ))}
          </div>
          <div className="col-span-1 space-y-1">
            {[...Array(10)].map((_, i) => (
              <Skeleton
                key={"loading-bids-" + i}
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

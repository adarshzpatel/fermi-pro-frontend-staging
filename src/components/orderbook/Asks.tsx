import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { toast } from "sonner";
import { useFermiStore } from "@/stores/fermiStore";

type Props = {
  data: any;
};

const Asks = ({ data }: Props) => {
  const placeOrderAndFinalize = useFermiStore(
    (s) => s.actions.placeOrderAndFinalize
  );

  const handleFillAskOrder = async (order: any) => {
    try {
      console.log("Order", order);
      await placeOrderAndFinalize(
        new BN(order.key),
        new BN(order.quantity),
        "bid",
        new PublicKey(order.owner)
      );
    } catch (err) {
      toast.error("Failed to fill order");
      console.log("Error filling Ask order", err);
    }
  };
  return (
    <div className="flex-grow flex flex-col-reverse text-red-400">
      {data?.map((order: any) => (
        <Popover key={order.key} placement="left">
          <PopoverTrigger>
            <div className="flex orderems-center bg-red-800/20 px-3 py-1.5 justify-between hover:bg-red-700/50 hover:border hover:border-red-500 cursor-pointer">
              <span>{order.price}</span>
              <span className="m">{order.quantordery}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-900 border border-gray-700 shadow-2xl">
            <div className="p-2 space-y-2">
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="pr-2">OrderId</td>
                    <td>: {order.key}</td>
                  </tr>
                  <tr>
                    <td className="pr-2">Owner:</td>
                    <td>: {order.owner.toString()}</td>
                  </tr>
                  <tr>
                    <td className="pr-2">Price:</td>
                    <td>: {order.price.toString()}</td>
                  </tr>
                  <tr>
                    <td className="pr-2">Quantity:</td>
                    <td>: {order.quantity.toString()}</td>
                  </tr>
                </tbody>
              </table>
              <Button
                onClick={() => handleFillAskOrder(order)}
                size="sm"
                color="primary"
                radius="sm"
              >
                Fill Order
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

export default Asks;

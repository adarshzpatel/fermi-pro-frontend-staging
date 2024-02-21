import { useFermiStore } from "@/stores/fermiStore";
import React, { useMemo } from "react";
import AccountNotFound from "./AccountNotFound";
import OpenOrdersRow from "./OpenOrdersRow";

const OpenOrders = () => {
  const openOrders = useFermiStore((s) => s.openOrders);
  const eventHeap = useFermiStore((s) => s.eventHeap);

  const canFinalise = useMemo(() => {
    let map: { [x: string]: any } = {};
    if (eventHeap != undefined && openOrders != undefined) {
      openOrders?.orders?.forEach((order) => {
        const match = eventHeap?.find(
          (event: any) =>
            event.makerClientOrderId.toString() === order.clientOrderId || event.takerClientOrderId.toString() === order.clientOrderId
        );
        if (match) map[order.id] = match;
      });
    }
    console.log("[FINALISABLE EVENTS ]", map);
    return map;
  }, [openOrders, eventHeap]);

  return (
    <table className="w-full table-fixed text-white/70 ">
      <thead>
        <tr className="bg-gray-900 text-sm  text-white/60 ">
          <th className="p-2 pl-4 text-left font-normal">Order Id</th>
          <th className="font-normal">Client Order Id</th>
          <th className="font-normal">Price</th>
          <th className="font-normal">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {!openOrders?.publicKey && (
          <tr className="text-center border-t border-gray-700 hover:bg-gray-700/25 duration-200 ease-out">
            <td colSpan={4}>
              <AccountNotFound />
            </td>
          </tr>
        )}
        {openOrders?.orders?.length === 0 && (
          <tr className="text-center border-t border-gray-700 hover:bg-gray-700/25 duration-200 ease-out">
            <td colSpan={4}>
              <div className="px-4 py-3 text-center text-white/60">
                No orders found
              </div>
            </td>
          </tr>
        )}
        {openOrders?.orders?.map((it) => (
          <OpenOrdersRow
            key={`order-${it.id}`}
            id={it.id}
            clientOrderId={it.clientOrderId}
            finaliseEvent={canFinalise[it.id]}
            lockedPrice={it.lockedPrice}
          />
        ))}
      </tbody>
    </table>
  );
};

export default OpenOrders;

import { useFermiStore } from "@/stores/fermiStore";
import { BN } from "@coral-xyz/anchor";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { PublicKey } from "@solana/web3.js";

import React, { useMemo } from "react";
import { toast } from "sonner";
import OpenOrdersActionsCell from "./OpenOrdersActionsCell";

const OpenOrdersTable = () => {
  const openOrders = useFermiStore((s) => s.openOrders);
  const eventHeap = useFermiStore((s) => s.eventHeap);

  const canFinalise = useMemo(() => {
    let map: { [x: string]: any } = {};
    if (eventHeap != undefined && openOrders != undefined) {
      openOrders?.orders?.forEach((order) => {
        const match = eventHeap?.find(
          (event: any) =>
            event.makerClientOrderId.toString() === order.clientOrderId,
        );
        if (match) map[order.id] = match;
      });
    }
    console.log("can finalise map", map);
    return map;
  }, [openOrders, eventHeap]);

  return (
    <Table
      fullWidth
      layout="fixed"
      classNames={{
        table: "bg-gray-900",
        wrapper: "bg-gray-900 p-0 rounded-none shadow-none",
        th: "bg-gray-800",
      }}
      isHeaderSticky={true}
      aria-label="User's open orders list"
    >
      <TableHeader>
        <TableColumn key="clientId" allowsResizing>
          Client Order Id
        </TableColumn>
        <TableColumn key="id" allowsResizing>
          Order Id
        </TableColumn>
        <TableColumn key="lockedPrice" allowsResizing>
          Price
        </TableColumn>
        <TableColumn key="actions" align="center">
          Actions
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"No Orders to display."}
        items={openOrders?.orders ?? []}
      >
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.clientOrderId}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.lockedPrice}</TableCell>
            <TableCell>
              <OpenOrdersActionsCell
                finaliseEvent={canFinalise[item.id]}
                orderId={item.id}
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OpenOrdersTable;

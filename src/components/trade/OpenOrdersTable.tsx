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

const OpenOrdersTable = () => {
  const orders = useFermiStore((s) => s.openOrders.orders) ?? [];
  const openOrders = useFermiStore((s) => s.openOrders);
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const eventHeap = selectedMarket.eventHeap;
  const finalise = useFermiStore((s) => s.actions.finalise);
  const cancelOrderById = useFermiStore(
    (state) => state.actions.cancelOrderById
  );

  const canFinalise = useMemo(() => {
    let map: { [x: string]: any } = {};
    if (eventHeap != undefined && openOrders != undefined) {
      openOrders?.orders?.forEach((order) => {
        const match = eventHeap?.find(
          (event: any) => event.makerClientOrderId.toString() === order.clientId
        );
        if (match) map[order.id] = match;
      });
    }
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
      <TableBody items={orders}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.clientId}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.lockedPrice}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {/* {canFinalise[item.id] === true && ( */}
                <Button
                  onClick={() =>
                    toast.promise(
                      finalise(
                        new PublicKey(
                          "6rDnvxVYAg9DUYSAEP2pASDLHZ2fHxSkcx9BnfqSCsoj"
                        ),
                        new PublicKey(
                          "HCqEBGByEeFS1HZZr1Aw8MmmAP3i9pHKJK7Kt3aSyDnt"
                        ),
                        new BN(0)
                      )
                    )
                  }
                  color="success"
                  size="sm"
                  variant="solid"
                >
                  Finalise
                </Button>
                {/* )} */}
                <Button
                  size="sm"
                  onClick={() =>
                    toast.promise(cancelOrderById(item.id), {
                      loading: "Cancelling",
                      success: "Cancelled",
                      error: "Error",
                    })
                  }
                >
                  Cancel
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OpenOrdersTable;

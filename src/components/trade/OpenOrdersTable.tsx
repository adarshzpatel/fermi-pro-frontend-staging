import { useFermiStore } from "@/stores/fermiStore";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

import React from "react";

const OpenOrdersTable = () => {
  const orders = useFermiStore(s => s.openOrders.orders) ?? []
  const isOOLoading = useFermiStore(s => s.isOOLoading)
  
  return (
    <Table fullWidth layout="fixed" classNames={{table:'bg-gray-900',wrapper:'bg-gray-900 p-0 rounded-none shadow-none',th:'bg-gray-800'}} isHeaderSticky={true} aria-label="User's open orders list">
      <TableHeader>
        <TableColumn  key="clientId"  allowsResizing>
          Client Order Id
        </TableColumn>
        <TableColumn key="id" allowsResizing>
          Order Id
        </TableColumn>
        <TableColumn key="lockedPrice" allowsResizing>
          Price
        </TableColumn>
        <TableColumn key="actions" align="center" >Actions</TableColumn>
      </TableHeader>
      <TableBody
        items={orders}
      isLoading={isOOLoading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.clientId}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.lockedPrice}</TableCell>
            <TableCell >
              <div className="flex gap-2">
                <Button color="success" size="sm" variant="solid">Finalise</Button>
                <Button size="sm" >Cancel</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OpenOrdersTable;

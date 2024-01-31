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
  const orders = [
    { id: "342423", clientOrderId: 0, price: 69, timestamp: "2021-09-01" },
    { id: "3422343", clientOrderId: 1, price: 169, timestamp: "2021-09-01" },
    { id: "34235256", clientOrderId: 2, price: 59, timestamp: "2021-09-01" },
    { id: "45423", clientOrderId: 3, price: 9, timestamp: "2021-09-01" },
  ];

  return (
    <Table fullWidth layout="fixed" classNames={{table:'bg-gray-900',wrapper:'bg-gray-900 p-0 rounded-none shadow-none',th:'bg-gray-800'}} isHeaderSticky={true} aria-label="User's open orders list">
      <TableHeader>
        <TableColumn key="clientOrderId"  allowsResizing>
          Client Order Id
        </TableColumn>
        <TableColumn key="id" allowsResizing>
          Order Id
        </TableColumn>
        <TableColumn key="price" allowsResizing>
          Price
        </TableColumn>
        <TableColumn key="timestamp" allowsResizing>
          Placed on
        </TableColumn>
        <TableColumn key="actions" align="center" >Actions</TableColumn>
      </TableHeader>
      <TableBody
        items={orders}
        isLoading={false}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.clientOrderId}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell >{item.timestamp}</TableCell>
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

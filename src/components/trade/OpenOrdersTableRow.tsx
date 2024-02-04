import { useFermiStore } from "@/stores/fermiStore";
import { Button, TableCell, TableRow } from "@nextui-org/react";
import React, { useState } from "react";

type OpenOrdersTableRowProps = {
  id: string;
  clientOrderId: string;
  lockedPrice: string;
  finaliseEvent: any;
};

const OpenOrdersTableRow = ({
  id,
  clientOrderId,
  lockedPrice,
  finaliseEvent,
}: OpenOrdersTableRowProps) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const cancelOrderById = useFermiStore(
    (state) => state.actions.cancelOrderById
  );

  const handleCancel = async () => {
    setIsCancelling(true);
    await cancelOrderById(id);
    setIsCancelling(false);
  };

  /// implement finalise
  // implement cancel
  // implement isFinalisable


  return (
    <TableRow key={id}>
      <TableCell>{clientOrderId}</TableCell>
      <TableCell>{id}</TableCell>
      <TableCell>{lockedPrice}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button color="success" size="sm" variant="solid">
            Finalise
          </Button>
          <Button
            onClick={handleCancel}
            isLoading={isCancelling}
            // isDisabled={isFinalising}
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OpenOrdersTableRow;

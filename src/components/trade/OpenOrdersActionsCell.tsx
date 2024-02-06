import { useFermiStore } from "@/stores/fermiStore";
import { BN } from "@coral-xyz/anchor";
import { Button, TableCell, TableRow } from "@nextui-org/react";
import React, { useState } from "react";

type OpenOrdersTableRowProps = {
  orderId: string;
  finaliseEvent: any;
};

const OpenOrdersTableRow = ({
  orderId,
  finaliseEvent,
}: OpenOrdersTableRowProps) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isFinalising, setIsFinalising] = useState(false);
  const cancelOrderById = useFermiStore(
    (state) => state.actions.cancelOrderById,
  );
  const finalise = useFermiStore((s) => s.actions.finalise);

  const handleCancel = async () => {
    setIsCancelling(true);
    await cancelOrderById(orderId);
    setIsCancelling(false);
  };

  const handleFinalise = async () => {
    if (!finaliseEvent) return;
    await finalise(
      finaliseEvent.maker,
      finaliseEvent.taker,
      new BN(finaliseEvent.index),
    );
    setIsFinalising(false);
  };
  /// implement finalise
  // implement cancel
  // implement isFinalisable

  return (
    <>
      <div className="flex gap-2">
        {/* {canFinalise[item.id] === true && ( */}
        {finaliseEvent && (
          <Button
            isDisabled={isCancelling}
            isLoading={isFinalising}
            onClick={handleFinalise}
            color="success"
            size="sm"
            variant="solid"
          >
            Finalise
          </Button>
        )}
        {/* )} */}
        <Button
          isDisabled={isFinalising}
          isLoading={isCancelling}
          size="sm"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default OpenOrdersTableRow;

import { FillEvent } from "@/solana/fermiClient";
import { useFermiStore } from "@/stores/fermiStore";
import { BN } from "@coral-xyz/anchor";
import { Button, ButtonGroup } from "@nextui-org/react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  lockedPrice: string;
  id: string;
  side: string;
  finaliseEvent: (FillEvent & { index: string | number }) | undefined;
};

const SideCell = ({ side }: { side: string }) => {
  if (side == "bid") {
    return (
      <div className="px-2 w-fit mx-auto py-0.5 rounded-full text-green-500 bg-green-500/10">
        BID
      </div>
    );
  }
  if (side == "ask") {
    return (
      <div className="px-2  w-fit mx-auto  py-0.5 rounded-full text-red-500 bg-red-10">ASK</div>
    );
  }
  return <div className="px-2  w-fit mx-auto  py-0.5 rounded-full  bg-gray-700">NONE</div>;
};
const OpenOrdersRow = ({ id, side, lockedPrice, finaliseEvent }: Props) => {
  const [cancel, finalise, cancelWithPenalty] = useFermiStore((s) => [
    s.actions.cancelOrderById,
    s.actions.finalise,
    s.actions.cancelWithPenalty,
  ]);
  const [isFinalising, setIsFinalising] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleFinalise = async () => {
    try {
      if (!finaliseEvent) return;
      setIsFinalising(true);
      await finalise(
        finaliseEvent.maker,
        finaliseEvent.taker,

        new BN(Number(finaliseEvent.index))
      );
    } catch (err) {
      console.error("[FINALISE] :", err);
      toast.error("Failed to finalise.");
    } finally {
      setIsFinalising(false);
    }
  };
  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      await cancel(id);
    } catch (err) {
      console.log(err);
      toast.error("Failed to cancel");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelWithPenalty = async () => {
    try {
      if (!finaliseEvent) return;
      setIsCancelling(true);
      await cancelWithPenalty(
        finaliseEvent.maker,
        finaliseEvent.taker,
        side,
        new BN(finaliseEvent.index)
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to cancel");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <tr className="text-center border-t border-gray-700 hover:bg-gray-700/25 duration-200 ease-out">
      <td className="py-3 pl-4 text-left">{id}</td>
      <td>
        <SideCell side={side} />
      </td>
      <td>{lockedPrice}</td>
      <td className="flex items-center justify-end pr-4 py-3">
        <ButtonGroup variant="bordered" size="sm" className="ml-auto">
          {finaliseEvent && (
            <Button
              isLoading={isFinalising}
              isDisabled={isCancelling}
              onClick={handleFinalise}
              className="bg-gray-900/50 border-gray-500 border hover:brightness-125 text-white/60"
            >
              Finalise
            </Button>
          )}
          <Button
            isLoading={isCancelling}
            isDisabled={isFinalising}
            onClick={finaliseEvent ? handleCancelWithPenalty : handleCancel}
            className="bg-gray-900/50 border-gray-500 border hover:brightness-125 text-white/60 "
          >
            Cancel
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  );
};

export default OpenOrdersRow;

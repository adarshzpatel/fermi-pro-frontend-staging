import { useFermiStore } from "@/stores/fermiStore";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import React, { FormEvent, useState } from "react";
import { NumericFormat } from "react-number-format";
import MarketSelector from "../shared/MarketSelector";
import { toast } from "sonner";
import { BN } from "@coral-xyz/anchor";
import CreateAccountModal from "./CreateAccountModal";
import StyledCard from "../shared/StyledCard";

type FormDataType = {
  size: string;
  price: string;
  side: "bid" | "ask";
};

const DEFAULT_FORM_STATE: FormDataType = {
  size: "",
  price: "",
  side: "bid",
};

function TradeForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [processing, setProcessing] = useState(false);
  const placeOrder = useFermiStore((s) => s.actions.placeOrder);
  const oo = useFermiStore((s) => s.openOrders);
  const {
    isOpen: isCreateAccountModalOpen,
    onOpen: openCreateAccountModal,
    onClose: closeCreateAccountModal,
  } = useDisclosure({ id: "createAccount" });

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    try {
      // input validation
      if (
        formData.size === DEFAULT_FORM_STATE.size ||
        formData.price == DEFAULT_FORM_STATE.price
      ) {
        throw new Error("Size and price are required");
      }
      // check if open orders account exist
      // if not, open create open orders account modal

      if (!oo) {
        openCreateAccountModal();
        return;
      }

      // else place order

      await placeOrder(
        new BN(formData.price),
        new BN(formData.size),
        formData.side
      );
    } catch (err: any) {
      const message = err?.message || "Failed to place order";
      toast.error(message);
      console.error("Error in placeOrder:", err);
    } finally {
      setFormData((s) => ({
        ...DEFAULT_FORM_STATE,
        side: s.side as "bid" | "ask",
      }));
      setProcessing(false);
    }
  };



  return (
    <StyledCard>

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col p-4 justify-between h-full  "
      >
        <MarketSelector />
        <Tabs
          onSelectionChange={(key) =>
            setFormData((state) => ({
              ...state,
              side: key.toString() as "bid" | "ask",
            }))
          }
          color={formData.side === "bid" ? "primary" : "danger"}
          selectedKey={formData.side}
          className=" font-medium"
          radius="sm"
          classNames={{ tabList: "border border-gray-700" }}
          fullWidth
        >
          <Tab title="Buy" key="bid" />
          <Tab title="Sell" key="ask" />
        </Tabs>
        <div>
          <Select
            label="Order type"
            placeholder="Select order type"
            selectedKeys={["limit"]}
            disabledKeys={["market"]}
            unselectable="on"
            labelPlacement="outside"
            classNames={{
              trigger:
                "bg-gray-800  border-2 border-default-200 hover:border-default-400 active:border-default-400",
              label: "text-sm !text-gray-400",
            }}
            radius="sm"
          >
            <SelectItem key="limit" textValue="Limit">
              Limit
            </SelectItem>
            <SelectItem key="market" textValue="Market">
              Market
            </SelectItem>
          </Select>
        </div>
        <div>
          <NumericFormat
            value={formData.price}
            displayType="input"
            placeholder="0"
            min={0}
            customInput={Input}
            label="Price"
            name="price"
            required
            isDisabled={processing}
            radius="sm"
            variant="faded"
            labelPlacement="outside"
            classNames={{ label: "text-sm !text-gray-400" }}
            onValueChange={(values) => {
              const { value } = values;
              setFormData((state) => ({ ...state, price: value }));
            }}
            thousandSeparator=","
            allowNegative={false}
          />
        </div>
        <div>
          <NumericFormat
            value={formData.size}
            displayType="input"
            placeholder="0"
            min={0}
            name="size"
            customInput={Input}
            label="Size"
            required
            isDisabled={processing}
            radius="sm"
            variant="faded"
            labelPlacement="outside"
            classNames={{ label: "text-sm !text-gray-400" }}
            onValueChange={(values) => {
              const { value } = values;
              setFormData((state) => ({ ...state, size: value }));
            }}
            thousandSeparator=","
            allowNegative={false}
          />
        </div>
        <div className="pt-2 bg-gray-800 rounded-lg">
          <div className="flex px-3 pt-1.5 pb-2 text-sm text-gray-300 justify-between">
            <p>Total</p>
            <p>
              ~ {(Number(formData.price) * Number(formData.size)).toFixed(6)}
            </p>
          </div>
          <Button
            type="submit"
            fullWidth
            radius="sm"
            isLoading={processing}
            color={formData.side === "bid" ? "primary" : "danger"}
          >
            Place Order
          </Button>
        </div>
        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          closeModal={closeCreateAccountModal}
        />
      </form>
    </StyledCard>
  );
}

export default TradeForm;

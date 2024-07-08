import {
  Button,
  Checkbox,
  Select,
  SelectItem,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import React, { FormEvent, useState } from "react";

import { BN } from "@coral-xyz/anchor";
import CreateAccountModal from "../shared/CreateAccountModal";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { useFermiStore } from "@/stores/fermiStore";
import useTokenBalances from "@/hooks/useTokenBalances";

type FormDataType = {
  size: string;
  price: string;
  side: "bid" | "ask";
  type: "market" | "limit";
};

const DEFAULT_FORM_STATE: FormDataType = {
  size: "0",
  price: "0",
  side: "bid",
  type: "limit",
};

const TradeForm = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  /**
   * Auto Settlement ( Show in market order )
   * -> If true , call finalise market from our side
   * -> If false , give option to user to finalise the order
   * Default is true
   */
  const [autoSettlement, setAutoSettlement] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [placeOrder, placeMarketOrder] = useFermiStore((s) => [
    s.actions.placeOrder,
    s.actions.placeMarketOrder,
  ]);
  const oo = useFermiStore((s) => s.openOrders);
  const { baseTokenBalance, quoteTokenBalance } = useTokenBalances();
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
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

      // check if open orders account exist
      // if not, open create open orders account modal
      if (!oo) {
        toast.warning("Create an account first !");
        openCreateAccountModal();
        return;
      }

      // else place order
      if (formData.type === "market") {
        await placeMarketOrder(
          new BN(formData.price),
          new BN(formData.size),
          formData.side,
          autoSettlement
        );
      }

      if (formData.type === "limit") {
        await placeOrder(
          new BN(formData.price),
          new BN(formData.size),
          formData.side
        );
      }

      // Order
    } catch (err: any) {
      const message = err?.message || "Failed to place order";
      toast.error(message);
      console.error("Error in placeOrder:", err);
    } finally {
      setFormData((s) => ({
        ...DEFAULT_FORM_STATE,
        side: s.side as "bid" | "ask",
        type: s.type as "market" | "limit",
      }));
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col flex-1">
      {/* Trade Form */}
      <Tabs
        fullWidth
        variant="solid"
        size="lg"
        radius="none"
        color={formData.side === "bid" ? "primary" : "danger"}
        selectedKey={formData.side}
        onSelectionChange={(key) => {
          setFormData((state) => ({
            ...state,
            side: key as "bid" | "ask",
          }));
        }}
        classNames={{
          tabList: "bg-gray-900 p-0 border-b border-gray-700 ",
          tab: "py-5",
        }}
      >
        <Tab key={"bid"} title="Buy" />
        <Tab key={"ask"} title="Sell" />
      </Tabs>
      <div className="px-4 mt-4">
        <Select
          selectedKeys={[formData.type]}
          onChange={(e) => {
            setFormData((state) => ({
              ...state,
              type: e.target.value as "market" | "limit",
            }));
          }}
          disallowEmptySelection
          value={formData.type}
          label="Order Type"
          variant="faded"
          classNames={{
            label: "mb-2 !text-white/60 font-medium text-base",
            trigger: "p-2 px-3 bg-gray-900/50 border-gray-600",
            popoverContent: "bg-gray-900 border-gray-600",
          }}
          size="lg"
          radius="sm"
          labelPlacement="outside"
          className="w-full"
        >
          <SelectItem key={"market"}>Market</SelectItem>
          <SelectItem key={"limit"}>Limit</SelectItem>
        </Select>
      </div>

      <div className="px-4 mt-4">
        <label
          htmlFor="price"
          className="flex items-center justify-between mb-2 text-white/60 font-medium"
        >
          {formData.type === "limit" ? "Limit Price" : "Market Price"}
          <span className="text-xs text-white/30 block">
            {quoteTokenBalance} {selectedMarket?.quoteTokenName}
          </span>
        </label>
        <NumericFormat
          value={formData.price}
          displayType="input"
          min={0}
          name="price"
          placeholder="Enter limit price"
          className="w-full rounded-lg text-xl placeholder:text-base p-2 px-3 outline-none border-2 border-gray-600 bg-gray-900/50 hover:border-primary-500 focus-within:border-primary-500 placeholder-white/20 "
          required
          onValueChange={(values) => {
            const { value } = values;
            setFormData((state) => ({ ...state, price: value }));
          }}
          thousandSeparator=","
          allowNegative={false}
        />
      </div>

      <div className="px-4 mt-4">
        <label
          htmlFor="quantity"
          className="flex items-center justify-between mb-2  text-white/60 font-medium"
        >
          Quantity
          <span className="text-xs text-white/30 block">
            {baseTokenBalance} {selectedMarket?.baseTokenName}
          </span>
        </label>
        <div className="mb-4">
          <NumericFormat
            value={formData.size}
            displayType="input"
            min={0}
            name="quantity"
            placeholder="Enter quantity/size"
            className="w-full rounded-lg text-xl placeholder:text-base p-2 px-3 outline-none border-2 border-gray-600 bg-gray-900/50 hover:border-primary-500 focus-within:border-primary-500 placeholder-white/20"
            required
            onValueChange={(values) => {
              const { value } = values;
              setFormData((state) => ({ ...state, size: value }));
            }}
            thousandSeparator=","
            allowNegative={false}
          />
        </div>
      </div>

      {/* {formData.type === "market" && (
        <div className="px-4 mt-2">
          <Checkbox
            color="primary"
            size="lg"
            isSelected={autoSettlement}
            onValueChange={setAutoSettlement}
            classNames={{
              wrapper: "bg-gray-900/50",
            }}
          >
            Auto settlement
          </Checkbox>
        </div>
      )} */}
      <div className="grid grid-cols-2 text-sm gap-2 grid-rows-2 bg-gray-900/50 rounded-lg p-4 mt-auto mx-4 ">
        <div className="text-white/60">Total Cost </div>
        <div className="text-right">
          {" "}
          ~{" "}
          {formData?.price || formData?.size
            ? Number(formData.price) * Number(formData.size)
            : "-"}
        </div>
        <div className="text-white/60">Fee </div>
        <div className="text-right">-</div>
      </div>
      <Button
        type="submit"
        isLoading={processing}
        color="primary"
        radius="sm"
        size="lg"
        className="m-4"
      >
        Place Order
      </Button>
      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        closeModal={closeCreateAccountModal}
      />
    </form>
  );
};

export default TradeForm;

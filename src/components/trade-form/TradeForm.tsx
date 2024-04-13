import React, { FormEvent, useState } from "react";
import MarketList from "./MarketList";
import { Button, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { NumericFormat } from "react-number-format";
import { useFermiStore } from "@/stores/fermiStore";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";
import CreateAccountModal from "../shared/CreateAccountModal";

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

const TradeForm = () => {
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
        toast.warning("Create an account first !")
        openCreateAccountModal();
        return;
      }
      // else place order

      await placeOrder(
        new BN(formData.price),
        new BN(formData.size),
        formData.side
      );

      // Order 

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
    <form onSubmit={handleFormSubmit} className="flex flex-col flex-1">
      {/* Trade Form */}
      <Tabs
        fullWidth
        variant="solid"
        size="lg"
        radius="none"
        // color="primary"
        onSelectionChange={(key) =>{

          setFormData((state) => ({
            ...state,
            side: key.toString() as "bid" | "ask",
          }))
        }}
        color={formData.side === "bid" ? "primary" : "danger"}
        selectedKey={formData.side}
        classNames={{
          tabList: "bg-gray-900 p-0 border-b border-gray-700 ",
          tab: "py-5",
        }}
      >
        <Tab  key={"bid"} title="Buy" />
        <Tab key={"ask"} title="Sell" />
      </Tabs>
      <div className="px-4 mt-4">
        <label
          htmlFor="price"
          className="block mb-2  text-white/60 font-medium"
        >
          Limit Price
        </label>
        <div>
          <NumericFormat
            value={formData.price}
            displayType="input"
            min={0}
            name="price"
            placeholder="Enter limit price"
            className="w-full rounded-lg text-xl placeholder:text-base p-2 px-3 outline-none border border-gray-600 bg-gray-900/50 hover:border-primary-500 focus-within:border-primary-500 placeholder-white/20"
            required
            onValueChange={(values) => {
              const { value } = values;
              setFormData((state) => ({ ...state, price: value }));
            }}
            thousandSeparator=","
            allowNegative={false}
          />
        </div>
      </div>
      <div className="px-4 mt-4">
        <label
          htmlFor="quantity"
          className="block mb-2  text-white/60 font-medium"
        >
          Quantity
        </label>
        <div className="mb-4">
          <NumericFormat
            value={formData.size}
            displayType="input"
            min={0}
            name="quantity"
            placeholder="Enter quantity/size"
            className="w-full rounded-lg text-xl placeholder:text-base p-2 px-3 outline-none border border-gray-600 bg-gray-900/50 hover:border-primary-500 focus-within:border-primary-500 placeholder-white/20"
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
      <div className="grid grid-cols-2 text-sm gap-2 grid-rows-2 bg-gray-900/50 rounded-lg p-4 mt-auto mx-4 ">
        <div className="text-white/60">Total Cost </div>
        <div className="text-right">
          {" "}
          ~{" "}
          {formData?.price || formData?.size
            ? (Number(formData.price) * Number(formData.size))
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
      <CreateAccountModal isOpen={isCreateAccountModalOpen} closeModal={closeCreateAccountModal}/>
    </form>
  );
};

export default TradeForm;

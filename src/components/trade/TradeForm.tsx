import { BN } from "@coral-xyz/anchor";
import { Button, Input, Select, SelectItem, Tab, Tabs } from "@nextui-org/react";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";

type FormDataType = {
  size: string;
  price: string;
  side: "buy" | "sell";
};

const DEFAULT_FORM_STATE: FormDataType = {
  size: "0.00",
  price: "0.00",
  side: "buy",
};

function TradeForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);

  return (
    <div className="flex h-full flex-col p-3">
      <Tabs
        size="lg"
        onSelectionChange={(key) =>
          setFormData((state) => ({
            ...state,
            side: key.toString() as "buy" | "sell",
          }))
        }
        color={formData.side === "buy" ? "primary" : "danger"}
        selectedKey={formData.side}
        className=" font-medium"
        radius="md"
        classNames={{tabList:"border border-gray-700"}}
        fullWidth
      >
        <Tab title="Buy" key="buy" />
        <Tab title="Sell" key="sell" />
      </Tabs>
      <form className="flex-1 flex flex-col space-y-3 mt-4 ">
        <Select
          label="Order type"
          placeholder="Select order type"
          selectedKeys={["limit"]}
          disabledKeys={["market"]}
          unselectable="on"
          labelPlacement="outside"
          size="lg"
          classNames={{
            trigger:
              "bg-gray-800  border-2 border-default-200 hover:border-default-400 active:border-default-400",
            label: "text-sm !text-gray-400",
            popoverContent:"bg-gray-800 rounded-md border-1 border-default-400  ",

          }}
          radius="none"
        >
          <SelectItem key="limit" textValue="Limit">
            Limit
          </SelectItem>
          <SelectItem key="market" textValue="Market">
            Market
          </SelectItem>
        </Select>
        <div>
          <NumericFormat
            value={formData.price}
            displayType="input"
            placeholder="0.00"
            min={0}
            customInput={Input}
            label="Price"
            name="price"
            required
            // isDisabled={processing}
            radius="none"
            variant="faded"
            labelPlacement="outside"
            classNames={{ label: "text-sm !text-gray-400" }}
            onValueChange={(values) => {
              const { value } = values;
              setFormData((state) => ({ ...state, price: value }));
            }}
            thousandSeparator=","
            size="lg"
            allowNegative={false}
          />
        </div>
        <div className="flex-1">
          <NumericFormat
            value={formData.size}
            displayType="input"
            placeholder="0.00"
            min={0}
            name="size"
            customInput={Input}
            label="Size"
            required
            // isDisabled={processing}
            radius="none"
            variant="faded"
            labelPlacement="outside"
            size="lg"
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
          <div className=" flex px-3 pt-1.5 pb-2 text-sm text-gray-300 justify-between">
            <p>Total</p>
            <p>
              ~ {(Number(formData.price) * Number(formData.size)).toFixed(6)}
            </p>
          </div>
          <Button
            type="submit"
            fullWidth
            size="lg"
            radius="sm"
            // isLoading={processing}
            color={formData.side === "buy" ? "primary" : "danger"}
          >
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TradeForm;

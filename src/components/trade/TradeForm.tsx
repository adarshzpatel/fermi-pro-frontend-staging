import { MARKETS } from "@/solana/constants";
import { useFermiStore } from "@/stores/fermiStore";
import {
  Button,
  Input,
  Link,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { FormEvent, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import MarketSelector from "../shared/MarketSelector";
;

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
  
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  
  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col p-4 justify-between h-full  "
    >
      <MarketSelector/>
      <Tabs
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
        classNames={{ tabList: "border border-gray-700" }}
        fullWidth
      >
        <Tab title="Buy" key="buy" />
        <Tab title="Sell" key="sell" />
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
          // radius="none"
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
          placeholder="0.00"
          min={0}
          customInput={Input}
          label="Price"
          name="price"
          required
          // isDisabled={processing}
          // radius="none"

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
          placeholder="0.00"
          min={0}
          name="size"
          customInput={Input}
          label="Size"
          required
          // isDisabled={processing}
          // radius="none"
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
          <p>~ {(Number(formData.price) * Number(formData.size)).toFixed(6)}</p>
        </div>
        <Button
          type="submit"
          fullWidth
          radius="sm"
          // isLoading={processing}
          color={formData.side === "buy" ? "primary" : "danger"}
        >
          Place Order
        </Button>
      </div>
    </form>
  );
}

export default TradeForm;

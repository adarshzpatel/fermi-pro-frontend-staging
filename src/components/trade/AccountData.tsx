import { Tab, Tabs } from "@nextui-org/react";
import OpenOrdersTable from "./OpenOrdersTable";

export default function AccountData() {
  return (
    <div className="p-3">
      <Tabs
        classNames={{
          cursor: "bg-gray-700",
          tabList: "border border-gray-600",
        }}
      >
        <Tab key="open_orders" title="Open Orders">
          <OpenOrdersTable/>
        </Tab>
        <Tab key="balances" title="Balances">

        </Tab>
      </Tabs>
    </div>
  );
}

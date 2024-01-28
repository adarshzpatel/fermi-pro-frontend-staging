import { Tab, Tabs } from "@nextui-org/react";

export default function AccountData() {
  return (
    <div className="p-3">
      <Tabs classNames={{cursor:"bg-gray-700",tabList:"border border-gray-600"}}>
        <Tab>Open Orders</Tab>
        <Tab>Balances</Tab>
      </Tabs>
    </div>
  );
}

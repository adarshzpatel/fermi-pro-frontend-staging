import { Tab, Tabs } from "@nextui-org/react";

import OpenOrders from "./OpenOrders";
import React from "react";
import SettleBalances from "./SettleBalances";

const AccountData = () => {
  return (
    <Tabs
      fullWidth
      variant="solid"
      size="lg"
      radius="none"
      color="primary"
      classNames={{
        cursor: "bg-gray-700  ",
        tabList: "bg-gray-900/50 p-0 border-b border-gray-600 ",
        tab: "py-5",
        panel: "p-0 overflow-y-scroll",
      }}
    >
      <Tab value={"open-orders"} title="Open Orders">
        <OpenOrders />
      </Tab>
      <Tab value={"unsettled-balances"} title="Settle Funds">
        <SettleBalances />
      </Tab>
    </Tabs>
  );
};

export default AccountData;

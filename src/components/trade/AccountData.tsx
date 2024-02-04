"use client"
import { Button, Spinner, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import OpenOrdersTable from "./OpenOrdersTable";
import { useFermiStore } from "@/stores/fermiStore";
import CreateAccountModal from "./CreateAccountModal";
import { useEffect } from "react";
import useCurrentMarket from "@/hooks/useCurrentMarket";

export default function AccountData() {
  const oo = useFermiStore((s) => s.openOrders);
  const isOOLoading = useFermiStore((s) => s.isOOLoading);

  const {
    isOpen: isCreateAccountModalOpen,
    onOpen: openCreateAccountModal,
    onClose: closeCreateAccountModal,
  } = useDisclosure({ id: "createAccount" });

  const client = useFermiStore((s) => s.client);
  const fetchOpenOrders = useFermiStore((s) => s.actions.fetchOpenOrders);
  const {currentMarket} = useCurrentMarket()
  
  useEffect(() => {
    if (client && currentMarket.publicKey) {
      fetchOpenOrders();
    }
  }, [client, currentMarket]);


  if (isOOLoading) {
    return (
      <div>
        <Spinner label="Loading Open Orders" />
      </div>
    );
  }



  if (!oo.publicKey) {
    return (
      <div className="p-3 items-center space-y-2">
        <div>
          Open Orders Account not found. Please create one to start trading !
        </div>
        <Button onClick={()=>openCreateAccountModal()} radius="sm" color="primary">
          Create Accoount
        </Button>
        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          closeModal={closeCreateAccountModal}
        />
      </div>
    );
  }

  return (
    <div className="p-3">
      <Tabs

        classNames={{
          cursor: "bg-gray-700",
          tabList: "border border-gray-600",
        }}
      >
        <Tab key="open_orders" title="Open Orders">
          <OpenOrdersTable />
        </Tab>
        <Tab key="balances" title="Balances"></Tab>
      </Tabs>
    </div>
  );
}

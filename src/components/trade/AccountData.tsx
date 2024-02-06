"use client";
import { Button, Spinner, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import OpenOrdersTable from "./OpenOrdersTable";
import { useFermiStore } from "@/stores/fermiStore";
import CreateAccountModal from "./CreateAccountModal";
import { useEffect } from "react";
import useCurrentMarket from "@/hooks/useCurrentMarket";
import StyledCard from "../shared/StyledCard";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function AccountData() {
  const openOrders = useFermiStore((s) => s.openOrders);
  const connectedWallet = useAnchorWallet()
  const {
    isOpen: isCreateAccountModalOpen,
    onOpen: openCreateAccountModal,
    onClose: closeCreateAccountModal,
  } = useDisclosure({ id: "createAccount" });

  if (openOrders === undefined) {
    return (
      <StyledCard>
        <div className="bg-gray-800 animate-pulse h-full w-full flex items-center justify-center">
            Loading Account...
        </div>
      </StyledCard>
    );
  }

  if (openOrders.account === null) {
    return (
      <StyledCard>
        <div className="p-6 space-y-2">
          <div>
            Open Orders Account not found. Please create one to start trading !
          </div>
          <Button
            onClick={() => openCreateAccountModal()}
            radius="sm"
            color="primary"
          >
            Create Accoount
          </Button>
          <CreateAccountModal
            isOpen={isCreateAccountModalOpen}
            closeModal={closeCreateAccountModal}
          />
        </div>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
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
    </StyledCard>
  );
}

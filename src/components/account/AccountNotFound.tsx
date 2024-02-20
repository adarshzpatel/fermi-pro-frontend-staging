import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import CreateAccountModal from "../shared/CreateAccountModal";

const AccountNotFound = () => {
  const {
    isOpen: isCreateAccountModalOpen,
    onOpen: openCreateAccountModal,
    onClose: closeCreateAccountModal,
  } = useDisclosure({ id: "create-account" });

  return (
    <div className="flex items-center justify-between  px-4 py-3">
      <p className="text-sm text-white/60">
        You {"don't"} have an account to start trading.{" "}
      </p>
      <Button
        onClick={() => openCreateAccountModal()}
        size="sm"
        color="warning"
      >
  
        Create Account
      </Button>
      <CreateAccountModal isOpen={isCreateAccountModalOpen} closeModal={closeCreateAccountModal}/>
    </div>
  );
};

export default AccountNotFound;

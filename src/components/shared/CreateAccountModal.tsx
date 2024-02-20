import useCurrentMarket from "@/hooks/useCurrentMarket";
import { useFermiStore } from "@/stores/fermiStore";
import { BN } from "@coral-xyz/anchor";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Link,
} from "@nextui-org/react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

const CreateAccountModal = ({ isOpen, closeModal }: Props) => {
  const [accountName, setAccountName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [txHash, setTxHash] = useState("");
  const connectedWallet = useAnchorWallet();
  const { currentMarket } = useCurrentMarket();
  const client = useFermiStore((state) => state.client);
  const fetchOpenOrders = useFermiStore(
    (state) => state.actions.fetchOpenOrders
  );
  const createOpenOrdersAccount = async () => {
    try {
      setProcessing(true);
      // Check if open orders account exits or not
      // Logic to get openOrdersAccount
      if (!connectedWallet?.publicKey) {
        throw new Error("Please connect your wallet");
      }
      if (!client) throw new Error("Client not initialized");
      if (!currentMarket?.publicKey) throw new Error("Market not selected");

      const marketPublicKey = new PublicKey(currentMarket.publicKey);
      // const market = await client.deserializeMarketAccount(marketPublicKey);
      // if (!market) throw new Error("Market not found");

      // Check if openOrdersAccount exits
      const openOrdersAccounts = await client.findOpenOrdersForMarket(
        connectedWallet.publicKey,
        marketPublicKey
      );
      if (openOrdersAccounts.length > 0) {
        console.log(
          "OpenOrdersAccount already exists",
          JSON.stringify(openOrdersAccounts)
        );
        return;
      }

      // If user does not have an openOrdersAccount, create one
      const allOpenOrders = await client.findAllOpenOrders(client.walletPk);

      console.group("Create Open Orders Account");

      const [ixs] = await client.createOpenOrdersIx(
        marketPublicKey,
        accountName,
        connectedWallet.publicKey,
        null
      );
      console.log(client.walletPk);
      const tx = await client.sendAndConfirmTransaction(ixs, {});
      setTxHash(tx);
      // await fetchOpenOrders();
      console.log("Created open orders account ", { tx });
      await fetchOpenOrders();
      // closeModal();
    } catch (err: any) {
      const message = err?.message || "Failed to place order";
      toast.error(message);
      console.error("Error in placeOrder:", err);
    } finally {
      setProcessing(false);
      console.groupEnd();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      className="border-gray-600 border"
      onClose={closeModal}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="font-heading p-6">
          Create Open Orders Account
        </ModalHeader>
        <ModalBody className="relative pb-6">
          {txHash ? (
            <div className="flex flex-col  items-center justify-center">
              <IoMdCheckmarkCircleOutline className="h-16 w-16 text-green-400" />
              <p className="font-heading mt-4 text-xl font-semibold">
                Transaction Sent Successfully
              </p>
              <Link
                showAnchorIcon
                target="_blank"
                href={`https://solscan.io/tx/${txHash}?cluster=devnet`}
                className="mb-4 flex flex-wrap justify-center text-sm"
              >
                Tx Hash : {txHash.slice(0, 8) + "..." + txHash.slice(-8)}{" "}
                <span>{"( click to view in explorer )"}</span>
              </Link>
              <Button
                color="primary"
                variant="ghost"
                onClick={closeModal}
                radius="sm"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text text-gray-300">
                  You need to create an open orders account before your can
                  trade
                </p>
                <Input
                  value={accountName}
                  required
                  disabled={processing}
                  name="name"
                  type="text"
                  label="Name"
                  radius="sm"
                  placeholder="Enter account name"
                  onValueChange={(val) => setAccountName(val)}
                />
                <Button
                  color="primary"
                  radius="sm"
                  isLoading={processing}
                  onClick={createOpenOrdersAccount}
                >
                  Create Account
                </Button>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateAccountModal;

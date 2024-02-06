import useSolBalance from "@/hooks/useSolBalance";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TbArrowsExchange2, TbCopy, TbLogout } from "react-icons/tb";

const CustomWalletConnectButton = () => {
  const { disconnect } = useWallet();
  const { solBalance } = useSolBalance();
  const { setVisible: setModalVisible } = useWalletModal();
  const { buttonState, onConnect, publicKey } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true);
    },
  });
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;

      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return;

      setMenuOpen(false);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect().catch(() => {
      // Silently catch because any errors are caught by the context `onError` handler
    });
  }, [disconnect]);

  const content = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + "..." + base58.slice(-4);
    } else if (buttonState === "connecting") {
      return "Connecting...";
    } else if (buttonState === "has-wallet") {
      return "Connect";
    } else if (buttonState === "no-wallet") {
      return "Select Wallet";
    }
  }, [buttonState, publicKey]);

  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: "",
          content:
            "bg-gray-900 ring ring-gray-700/25 border border-gray-700    border-gray-600",
          arrow: "",
        }}
      >
        {buttonState === "connected" ? (
          <DropdownTrigger className="flex cursor-pointer items-center  justify-between  rounded-full border border-gray-600 bg-gray-800/75  px-4 py-2 text-gray-400 shadow-lg ring-gray-800/75 focus-within:outline-none hover:border-gray-400 hover:bg-gray-700/80 hover:text-gray-200  hover:ring  focus:border-gray-400 focus:bg-gray-700/80 focus:text-gray-200 focus:ring-2">
            <div className="flex items-center gap-2">
              <p className="hidden font-medium sm:block">
                {solBalance && (solBalance / 1000000000).toFixed(4) + " SOL "}
              </p>
              <div className="bg-default-400 h-4 w-[1px]"></div>
              <p className="">{content}</p>
            </div>
          </DropdownTrigger>
        ) : (
          <button
            onClick={() => {
              console.log(buttonState);
              setModalVisible(true);
              switch (buttonState) {
                case "no-wallet":
                  setModalVisible(true);
                  break;
                case "has-wallet":
                  if (onConnect) {
                    onConnect();
                  }
                  break;
              }
            }}
            aria-expanded={menuOpen}
            className="flex cursor-pointer items-center  justify-between  rounded-full border border-gray-600 bg-gray-800/75  px-4 py-2 text-gray-400 shadow-lg ring-gray-800/75 focus-within:outline-none hover:border-gray-400 hover:bg-gray-700/80 hover:text-gray-200  hover:ring  focus:border-gray-400 focus:bg-gray-700/80 focus:text-gray-200 focus:ring-2"
          >
            {content}
          </button>
        )}
        <DropdownMenu
          variant="faded"
          aria-label="Wallet dropdown with options to change wallet and disconnect"
        >
          <DropdownItem
            closeOnSelect={false}
            startContent={<TbCopy className="h-5 w-5" />}
            onClick={async () => {
              await navigator.clipboard.writeText(publicKey?.toBase58() ?? "");
              setCopied(true);
              setTimeout(() => setCopied(false), 400);
            }}
            key="copy_address"
          >
            {copied ? "Copied" : "Copy Address"}
          </DropdownItem>
          <DropdownItem
            startContent={<TbArrowsExchange2 className="h-5 w-5" />}
            onClick={() => setModalVisible(true)}
            key="change_wallet"
          >
            Change wallet
          </DropdownItem>
          <DropdownItem
            className="text-red-500"
            startContent={<TbLogout className="h-5 w-5" />}
            onClick={() => handleDisconnect()}
            key="disconnect"
          >
            Disconnect
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default CustomWalletConnectButton;

import React, { useEffect, useState } from "react";
import Copyable from "../shared/Copyable";
import { Button } from "@nextui-org/react";
import { useFermiStore } from "@/stores/fermiStore";
import AccountNotFound from "./AccountNotFound";
import {
  shortenAddress,
  toUiDecimals,
  toUiDecimalsForQuote,
} from "@/solana/utils/helpers";
import { toast } from "sonner";
const SettleBalances = () => {
  const [processing, setProcessing] = useState(false);
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const openOrders = useFermiStore((s) => s.openOrders);
  const client = useFermiStore((s) => s.client);
  const fetchOpenOrders = useFermiStore((s)=>s.actions.fetchOpenOrders)
  
  const handleSettleFunds = async () => {
    try {
      if (!openOrders || !openOrders.account)
        throw new Error("Open orders account not found.");
      if (!selectedMarket || !selectedMarket.current)
        throw new Error("No market found.");

      const [ix, signers] = await client.settleFundsIx(
        openOrders?.publicKey,
        openOrders?.account,
        selectedMarket?.publicKey,
        selectedMarket?.current
        );
        await client
        .sendAndConfirmTransaction([ix], {
          additionalSigners: signers,
        })
        await fetchOpenOrders()
    } catch (err) {
      console.log("Error settling funds : ", err);
      toast.error("Failed to settle funds.");
    }
  };

  return (
    <>
      <table className="w-full table-fixed text-white/70 ">
        <thead>
          <tr className="bg-gray-900 text-sm text-white/60 ">
            <th className="p-2 pl-4 text-left">Token</th>
            <th>Token Mint Address</th>
            <th className="text-right pr-4">Amount Claimable</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {!openOrders?.publicKey ? (
            <tr className="text-center border-t border-gray-700 hover:bg-gray-700/25 duration-200 ease-out">
              <td colSpan={3}>
                <AccountNotFound />
              </td>
            </tr>
          ) : (
            <>
              <tr className="text-center border-t border-gray-700 hover:bg-gray-700/25 duration-200 ease-out">
                <td className="text-left py-3 pl-4">Base (SOL)</td>
                <td className="py-3 px">
                  <Copyable
                    textToCopy={shortenAddress(
                      selectedMarket?.current?.baseMint.toString() ?? "-"
                    )}
                    className="flex items-center justify-center gap-1"
                  >
                    {shortenAddress(
                      selectedMarket?.current?.baseMint.toString() ?? "-"
                    )}
                    <Copyable.Icon />
                  </Copyable>
                </td>
                <td className="text-right py-3 pr-4 text-lg font-medium text-white ">
                  {toUiDecimals(
                    openOrders.account?.position.baseFreeNative.toString(),
                    9
                  )}
                </td>
              </tr>
              <tr className="text-center border-y border-gray-700  hover:bg-gray-700/25 duration-200 ease-out">
                <td className="text-left py-3 pl-4">Quote (USDC)</td>
                <td className="py-3 px-4 ">
                  <Copyable
                    textToCopy={shortenAddress(
                      selectedMarket?.current?.quoteMint.toString() ?? "-"
                    )}
                    className="flex items-center justify-center gap-1"
                  >
                    {shortenAddress(
                      selectedMarket?.current?.quoteMint.toString() ?? "-"
                    )}
                    <Copyable.Icon />
                  </Copyable>
                </td>
                <td className="text-right py-3 pr-4 text-lg font-medium text-white ">
                  {toUiDecimalsForQuote(
                    openOrders.account?.position.quoteFreeNative.toString()
                  )}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      {openOrders?.publicKey && (
        <Button
          onClick={handleSettleFunds}
          isLoading={processing}
          radius="sm"
          color="primary"
          className="m-4"
        >
          Settle Funds
        </Button>
      )}
    </>
  );
};

export default SettleBalances;

import React, { useState, useEffect, use } from "react";
import LastTradedPrice from "./LastTradedPrice";
import Bids from "./Bids";
import Asks from "./Asks";
import { useFermiStore } from "@/stores/fermiStore";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import WebSocketStatus from "./WebsocketStatus";

const wsUrl = "ws://3.6.83.91:8080/";

type Props = {};

const Orderbook = (props: Props) => {
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const connectedWallet = useAnchorWallet();
  const [isWsConnected, setIsWsConnected] = useState(false);
  const {fetchOpenOrders,fetchEventHeap} = useFermiStore((s) => s.actions);
  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    if (selectedMarket?.publicKey) {
      ws.onopen = () => {
        setIsWsConnected(true);
        console.log("WebSocket connection established");
        // Subscribe to the selected market
        ws.send(
          JSON.stringify({
            type: "subscribe",
            subscriberPublicKey: connectedWallet?.publicKey?.toBase58(),
            marketAddress: selectedMarket.publicKey,
          })
        );
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        fetchOpenOrders();
        fetchEventHeap();
        if (message.type === "bids") {
          setBids(message.data);
        } else if (message.type === "asks") {
          setAsks(message.data);
        }
      };

      ws.onclose = () => {
        setIsWsConnected(false);
        console.log("WebSocket connection closed");
      };

      ws.onerror = (err) => {
        setIsWsConnected(false);
        console.error("WebSocket connection error", err);
      };
    }
    return () => {
      // Clean up the WebSocket connection when the component unmounts
      ws.close();
    };
  }, [selectedMarket, connectedWallet]);

  return (
    <>
      <div className="border-b px-3 py-2 flex justify-between  border-gray-600 text-lg bg-gray-900/50">
        Orderbook
        <WebSocketStatus isConnected={isWsConnected} />
      </div>
      <div className="text-xs  flex-1 flex flex-col">
        <div className="flex text-white/40 bg-gray-900 border-b border-gray-600 p-3 py-2 justify-between items-center">
          <div>
            Price{" "}
            <span className="p-0.5 px-1.5 rounded-sm bg-gray-800">
              {selectedMarket?.quoteTokenName ?? "QUOTE"}
            </span>
          </div>
          <div>
            Quantity{" "}
            <span className="p-0.5 px-1.5 rounded-sm bg-gray-800">
              {selectedMarket?.baseTokenName ?? "BASE"}
            </span>
          </div>
        </div>

        <Asks data={asks} />
        <LastTradedPrice />
        <Bids data={bids} />
      </div>
    </>
  );
};

export default Orderbook;

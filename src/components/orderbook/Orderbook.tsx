import React, { useState, useEffect } from "react";
import LastTradedPrice from "./LastTradedPrice";
import Bids from "./Bids";
import Asks from "./Asks";
import { useFermiStore } from "@/stores/fermiStore";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import WebSocketStatus from "./WebsocketStatus";

const wsUrl = "wss://api.fermilabs.xyz";

type Props = {};

const Orderbook = (props: Props) => {
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const connectedWallet = useAnchorWallet();
  const [isWsConnected, setIsWsConnected] = useState(false);


  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsWsConnected(true);
        console.log("WebSocket connection established");
        // Subscribe to the selected market
        ws?.send(
          JSON.stringify({
            type: "subscribe",
            subscriberPublicKey: connectedWallet?.publicKey?.toBase58(),
            marketAddress: selectedMarket?.publicKey,
          })
        );
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "bids") {
          setBids(message.data);
        } else if (message.type === "asks") {
          setAsks(message.data);
        }
      };

      ws.onclose = () => {
        setIsWsConnected(false);
        console.log("WebSocket connection closed");
        // Try to reconnect after a delay
      };

      ws.onerror = (err) => {
        setIsWsConnected(false);
        console.error("WebSocket connection error", err);
        // Try to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
      };
    };

    if (selectedMarket?.publicKey) {
      connectWebSocket();
    }

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      if (ws) {
        ws.close();
      }
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

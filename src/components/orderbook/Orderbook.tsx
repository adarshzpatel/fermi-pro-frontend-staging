import React, { useState, useEffect } from "react";
import LastTradedPrice from "./LastTradedPrice";
import Bids from "./Bids";
import Asks from "./Asks";
import { useFermiStore } from "@/stores/fermiStore";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import WebSocketStatus from "./WebsocketStatus";
import { toast } from "sonner";

const wsUrl = "wss://api.fermilabs.xyz";

type Props = {};

const Orderbook = (props: Props) => {
  const [ws,setWs] = useState<WebSocket | null>(null);
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const connectedWallet = useAnchorWallet();
  const [isWsConnected, setIsWsConnected] = useState(false);


  useEffect(() => {
    const connectWebSocket = () => {
      if(ws?.OPEN || ws?.CONNECTING) return
      const websocket = new WebSocket(wsUrl);
      setWs(websocket);

      websocket.onopen = () => {
        setIsWsConnected(true);
        toast.success("Orderbook connected.");
        // Subscribe to the selected market
        websocket.send(
          JSON.stringify({
            type: "subscribe",
            subscriberPublicKey: connectedWallet?.publicKey?.toBase58(),
            marketAddress: selectedMarket?.publicKey,
          })
        );
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "bids") {
          setBids(message.data);
        } else if (message.type === "asks") {
          setAsks(message.data);
        }
      };

      websocket.onclose = () => {
        setIsWsConnected(false);
        // Try to reconnect after a delay
        toast.error("WebSocket connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 100);
      };

      websocket.onerror = (err) => {
        setIsWsConnected(false);
        // Try to reconnect after a delay
        setTimeout(connectWebSocket, 1000);
      };
    };

    if (selectedMarket?.publicKey) {
      connectWebSocket();
    }

    console.log({bids,asks});
    
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

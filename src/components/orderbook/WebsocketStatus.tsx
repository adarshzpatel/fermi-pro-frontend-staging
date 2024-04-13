import React from "react";

type Props = {
  isConnected: boolean;
};

const WebSocketStatus = ({ isConnected }: Props) => {
  const statusColor = isConnected ? "bg-green-500" : "bg-red-500";
  return (
    <div className="flex items-center space-x-1">
      <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
      <span className="text-xs hidden lg:block">{isConnected ? "Connected" : "Disconnected"}</span>
    </div>
  );
};

export default WebSocketStatus;
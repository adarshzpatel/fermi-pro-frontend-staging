import React from "react";

type Props = {
  data: any;
};
const Asks = ({ data }: Props) => {
  return (
    <div className="flex-grow flex flex-col-reverse text-red-400">
      {data?.map((it: any) => (
        <div
          key={it.key}
          className="flex items-center bg-red-800/20 px-3 py-1.5 justify-between"
        >
          <span>{it.price}</span>
          <span className="m">{it.quantity}</span>
        </div>
      ))}
    </div>
  );
};

export default Asks;

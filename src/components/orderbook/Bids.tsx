import React from "react";

type Props = {
  data: {
    key: string;
    price: string;
    quantity: string;
  }[];
};

const Bids = ({ data }: Props) => {
  return (
    <div className="flex-grow flex flex-col text-green-400 ">
      {data?.map((it) => (
        <div key={it.key} className="flex items-center bg-green-700/20 px-3 py-1.5 justify-between ">
          <span>{it.price}</span>
          <span className="m">{it.quantity}</span>
        </div>
      ))}
    </div>
  );
};

export default Bids;

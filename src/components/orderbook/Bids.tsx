import React from "react";

type Props = {
  data:any
};

const Bids = ({ data }: Props) => {
  return (
    <div className="flex-grow flex flex-col text-green-400 ">
      {data?.map((it:any) => (
        <div key={it.id} className="flex items-center bg-green-700/20 px-3 py-1.5 justify-between ">
          <span>{it.price}</span>
          <span className="">{it.quantity}</span>
        </div>
      ))}
    </div>
  );
};

export default Bids;

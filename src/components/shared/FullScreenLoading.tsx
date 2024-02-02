import React from "react";

type Props = {};

const FullScreenLoading = (props: Props) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {/* <Spinner label="Loading..." /> */}
      <h1 className="font-bold text-2xl animate-pulse">FERMI.</h1>
    </div>
  );
};

export default FullScreenLoading;

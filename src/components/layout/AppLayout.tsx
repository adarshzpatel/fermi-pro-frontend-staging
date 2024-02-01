"use client"
import React, { useEffect,useState } from "react";
import Navigation from "./Navigation";
import CustomToaster from "../shared/CustomToaster";


type Props = {
  children: React.ReactNode;
};

const AppLayout = (props: Props) => {
  return (
    <>
      <Navigation />
      <main>{props.children}</main>
      <CustomToaster />
    </>
  );
};

export default AppLayout;

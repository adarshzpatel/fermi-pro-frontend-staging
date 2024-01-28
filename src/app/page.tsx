"use client";
import Navigation from "@/components/layout/Navigation";
import StyledCard from "@/components/shared/StyledCard";
import AccountData from "@/components/trade/AccountData";
import Orderbook from "@/components/trade/Orderbook";
import TradeForm from "@/components/trade/TradeForm";
import { Spinner } from "@nextui-org/react";
import { use, useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";


export default function Home() {
  // Calculate screen innerHeigh in useSate
  const [mounted,setMounted] = useState(false)
  const [rowHeight, setRowHeight] = useState(140);
  
  useEffect(()=>{
    setMounted(true)
  },[])
  useEffect(() => {
    setRowHeight((window.innerHeight-154)/5)

  }, []);
  useEffect(()=>{
    console.log(rowHeight)
  },[rowHeight])

  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const layouts = {
    lg: [
      { i: "trade-form", x: 0, y: 0, w: 3, h: 3 },
      { i: "chart", x: 3, y: 0, w: 6, h: 3 },
      { i: "orderbook", x: 9, y: 0, w: 3, h: 3 },
      { i: "account-data", x: 0, y: 1, w: 9, h: 2 },
      { i: "market-details", x: 9, y: 1, w: 3, h: 2 },
    ],
    md: [
      { i: "trade-form", x: 0, y: 0, w: 3, h: 3 },
      { i: "chart", x: 3, y: 0, w: 7, h: 3 },
      { i: "orderbook", x: 0, y: 1, w: 5, h: 2 },
      { i: "market-details", x: 5, y: 1, w: 5, h: 2 },
      { i: "account-data", x: 0, y: 2, w: 10, h: 2 },
    ],
    sm: [
      { i: "trade-form", x: 0, y: 0, w: 2.5, h: 3 },
      { i: "chart", x: 2.5, y: 0, w: 3.5, h: 3 },
      { i: "orderbook", x: 0, y: 1, w: 3, h: 2 },
      { i: "market-details", x: 3, y: 1, w: 3, h: 2 },
      { i: "account-data", x: 0, y: 2, w: 6, h: 2 },
    ],
    xs: [
      { i: "chart", x: 0, y: 1, w: 4, h: 2 },
      { i: "trade-form", x: 0, y: 0, w: 4, h: 1 },
      { i: "orderbook", x: 0, y: 3, w: 4, h: 2 },
      { i: "market-details", x: 4, y: 1, w: 4, h: 2 },
      { i: "account-data", x: 0, y: 5, w: 4, h: 2 },
    ],
    xxs: [
      { i: "trade-form", x: 0, y: 0, w: 1, h: 1 },
      { i: "chart", x: 1, y: 0, w: 1, h: 1 },
      { i: "orderbook", x: 0, y: 1, w: 1, h: 1 },
      { i: "market-details", x: 1, y: 1, w: 1, h: 1 },
      { i: "account-data", x: 0, y: 2, w: 1, h: 1 },
    ],
  };

  if(!mounted){
    return <div className="screen-center">
      <Spinner label="Loading..."/>
    </div>
  }

  return (
    <>
      <div>
        <ResponsiveReactGridLayout
          margin={[16,16]}
          rowHeight={rowHeight}
          autoSize={true}
          className="layout"
          layouts={layouts}
          isDraggable={false}
          containerPadding={[16, 16]}
          // compactType={"vertical"}
          breakpoints={{ lg: 1024, md: 768, sm: 640, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        >
          <div key="trade-form">
            <StyledCard><TradeForm/></StyledCard>
          </div>
          <div key="chart">
            <StyledCard> Chart</StyledCard>
          </div>
          <div key="orderbook">
            <StyledCard><Orderbook/></StyledCard>
          </div>
          <div key="account-data">
            <StyledCard><AccountData/></StyledCard>
          </div>
          <div key="market-details">
            <StyledCard> Market details</StyledCard>
          </div>
        </ResponsiveReactGridLayout>
      </div>
    </>
  );
}

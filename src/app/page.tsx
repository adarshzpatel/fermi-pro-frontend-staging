"use client";
import { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

export default function Home() {
  
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const layouts = {
    lg: [
      { i: "trade-form", x: 0, y: 0, w: 3, h: 3 },
      { i: "chart", x: 3, y: 0, w: 6, h: 3 },
      { i: "orderbook", x: 9, y: 0, w: 3, h: 3 },
      { i: "balances", x: 0, y: 1, w: 9, h: 2 },
      { i: "market-details", x: 9, y: 1, w: 3, h: 2 },
    ],
    md: [
      { i: "trade-form", x: 0, y: 0, w: 3, h: 3 },
      { i: "chart", x: 3, y: 0, w:7, h: 3 },
      { i: "orderbook", x: 0, y: 1, w: 5, h: 2 },
      { i: "market-details", x: 5, y: 1, w: 5, h: 2 },
      { i: "balances", x: 0, y: 2, w: 10, h: 2 },
    ],
    sm: [
      { i: "trade-form", x: 0, y: 0, w: 2.5, h: 3 },
      { i: "chart", x: 2.5, y: 0, w:3.5, h: 3 },
      { i: "orderbook", x: 0, y: 1, w: 3, h: 2 },
      { i: "market-details", x: 3, y: 1, w: 3, h: 2 },
      { i: "balances", x: 0, y: 2, w: 6, h: 2 },
    ],
    xs: [
      { i: "chart", x: 0, y: 1, w: 4, h: 2 },
      { i: "trade-form", x: 0, y: 0, w: 4, h: 1 },
      { i: "orderbook", x: 0, y: 3, w: 4, h: 2 },
      { i: "market-details", x: 4, y: 1, w: 4, h: 2 },
      { i: "balances", x: 0, y: 5, w: 4, h: 2 },
    ],
    xxs: [
      { i: "trade-form", x: 0, y: 0, w: 1, h: 1 },
      { i: "chart", x: 1, y: 0, w: 1, h: 1 },
      { i: "orderbook", x: 0, y: 1, w: 1, h: 1 },
      { i: "market-details", x: 1, y: 1, w: 1, h: 1 },
      { i: "balances", x: 0, y: 2, w: 1, h: 1 },
    ],
  };

  return (
    <>
      <ResponsiveReactGridLayout
        className="layout"
        layouts={layouts}
        isDraggable={false}
        breakpoints={{ lg: 1024, md: 768, sm: 640, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        <div className="bg-gray-800" key="trade-form">
          Place order
        </div>
        <div className="bg-gray-800" key="chart">
          Chart
        </div>
        <div className="bg-gray-800" key="orderbook">
          Orderbook
        </div>
        <div className="bg-gray-800" key="balances">
          Balances
        </div>
        <div className="bg-gray-800" key="market-details">
          Market Details
        </div>
      </ResponsiveReactGridLayout>
    </>
  );
}

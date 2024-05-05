export const RPC_URL = {
  devnet:
    "https://devnet.helius-rpc.com/?api-key=5163c3d1-8082-442e-8a15-c27bff3cfabb",
};
export const FERMI_DEVNET_PROGRAM_ID =
  "DLisWw99mbFRajC9aLCk1kE9xBLVTQjvkGy7i6q9PpfD";

export type MarketType = {
  baseTokenName: string;
  quoteTokenName: string;
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    baseTokenName: "TEST",
    quoteTokenName: "SOL",
    marketPda: "NyQXaS1suj11LfiTHG6tHNHYEbf1KUZB1JaucyhArVY",
  },
  {
    baseTokenName: "BONK",
    quoteTokenName: "SOL",
    marketPda: "9yZS8s7bC2kXRvd1TTDG2ApDtLT8qKWm1CDpprCXfRVt",
  },

];

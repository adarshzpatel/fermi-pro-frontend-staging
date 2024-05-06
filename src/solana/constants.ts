export const RPC_URL = {
  devnet:
    "https://devnet.helius-rpc.com/?api-key=5163c3d1-8082-442e-8a15-c27bff3cfabb",
};
export const FERMI_DEVNET_PROGRAM_ID =
  "6pYD7cBvgQMCBHWQaKzL7k1qfBuG9RpFB2hmbszd4u1A";

export type MarketType = {
  baseTokenName: string;
  quoteTokenName: string;
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    baseTokenName: "TEST",
    quoteTokenName: "SOL",
    marketPda: "C3rYxfxh1qRm2D1M6Egsy9dv7q6ktFxMacKQbKawd2ot",
  },
  {
    baseTokenName: "BONK",
    quoteTokenName: "SOL",
    marketPda: "DFrVQZeppfRQCjpa7K3MNmbhJYF9yTWpUUt2v9iFZmie",
  },

];

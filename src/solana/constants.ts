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
    marketPda: "95EJEn1owV83yPsVfyaN7y8buBsEpNd5p8yqWf8FuDmW",
  },
  {
    baseTokenName: "BONK",
    quoteTokenName: "SOL",
    marketPda: "DFrVQZeppfRQCjpa7K3MNmbhJYF9yTWpUUt2v9iFZmie",
  },

];

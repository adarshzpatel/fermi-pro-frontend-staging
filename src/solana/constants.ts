export const RPC_URL = {
  devnet:
    "https://devnet.helius-rpc.com/?api-key=5163c3d1-8082-442e-8a15-c27bff3cfabb",
};
export const FERMI_DEVNET_PROGRAM_ID =
  "DVYGTDbAJVTaXyUksSwAwZr3rw5HmKZsATm6EmSenQAq";

export type MarketType = {
  baseTokenName: string;
  quoteTokenName: string;
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    baseTokenName: "BONK",
    quoteTokenName: "SOL",
    marketPda: "Eh4VvHRezE7TGXwkdqXpSRKkcDA1zhy19tVX4dxYDG7U",
  },
];

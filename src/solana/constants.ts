export const RPC_URL = {
  devnet:
    "https://devnet.helius-rpc.com/?api-key=5163c3d1-8082-442e-8a15-c27bff3cfabb",
};
export const FERMI_DEVNET_PROGRAM_ID = "E6cNbXn2BNoMjXUg7biSTYhmTuyJWQtAnRX1fVPa7y5v";

export type MarketType = {
  name: string;
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    name: "SOL/USDC",
    marketPda: "5Eba9CxDqjuf84q7xuV69LwMDa9EEkNKBUxYPEEF6N1v",
  },
];

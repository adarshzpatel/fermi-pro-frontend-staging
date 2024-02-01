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
    marketPda: "JBpTX7sqGNRMiLrwTm6YNG6zjfyw3yP5F4a88nDEjSwa",
  },
  {
    name: "BONK/USDC",
    marketPda: "nsBsuahj3TeY66Y2g6pc2MRXavNiR2Siwk6neKm1uuf",
  },
];

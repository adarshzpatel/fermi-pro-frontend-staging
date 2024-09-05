export const RPC_URL = {
  devnet: "https://api.devnet.solana.com",
};
export const FERMI_DEVNET_PROGRAM_ID =
  "61iWk6RE2TdZXDgKFpfLAsqTswXBdXHfgoE2UVcd6EHJ";

export type MarketType = {
  baseTokenName: string;
  quoteTokenName: string;
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    baseTokenName: "JUP",
    quoteTokenName: "USDC",
    marketPda: "BYRtfsJ8g8pieJuCFf2Gub7KmtNMun1eCDeNzt6ne13T",
  },
];

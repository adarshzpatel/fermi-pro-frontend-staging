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
    baseTokenName: "JUP",
    quoteTokenName: "USDC",
    marketPda: "9LG7KkAR65iS85S55Kn5W6mE7u5EoyKfAXt1mcCcVuui",
  },
  {
    baseTokenName: "CWIF",
    quoteTokenName: "USDC",
    marketPda: "Akx6Rkbui8kGZW4N5T6nqiHYLmzP8WyyUBqub1VyGCd1",
  },
  {
    baseTokenName: "KMNO",
    quoteTokenName: "USDC",
    marketPda: "3B3CYgQFA5icDY6GEzi7R4MtU9Krh5gdY64DDbnVvu25",
  },
];

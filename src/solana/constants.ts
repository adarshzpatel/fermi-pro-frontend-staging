export const RPC_URL = {
  devnet: "https://api.devnet.solana.com",
};
export const FERMI_DEVNET_PROGRAM_ID = "DrgsHv79i7B9YBW5jNcgQmXWHvur3MbRGKrbCauBm79z";

export type MarketType = {
  baseTokenName: string;
  quoteTokenName: string;
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    baseTokenName: "JUP",
    quoteTokenName: "USDC",
    marketPda: "awTecE3H3MasJwWP9MG1cYhtZ95ozvtrfWWxXeXUo4u",
  },
];

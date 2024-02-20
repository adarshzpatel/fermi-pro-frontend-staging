export const RPC_URL = {
  devnet:
    "https://devnet.helius-rpc.com/?api-key=5163c3d1-8082-442e-8a15-c27bff3cfabb",
};
export const FERMI_DEVNET_PROGRAM_ID = "DVYGTDbAJVTaXyUksSwAwZr3rw5HmKZsATm6EmSenQAq";

export type MarketType = {
  baseTokenName:string 
  quoteTokenName:string 
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    baseTokenName: 'SOL',
    quoteTokenName: 'USDC',
    marketPda: "CLgZcs7kRfiAfkg7FuGRVeTxRUtN2s2vbDAtqgeRt29M",
  },

  {
    baseTokenName: 'BONK',
    quoteTokenName: 'SOL',
    marketPda: "2RZVJQTjVVjyEekiNarS31GFNKjGTwxWa7JP9iMmJcMq",
  },

];

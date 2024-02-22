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
    marketPda: "E45ZiHS6B6suxTaAWih5tkwJ56Trqw16hZrUYCP8zmm8",
  },

  {
    baseTokenName: 'BONK',
    quoteTokenName: 'SOL',
    marketPda: "HVzXgjn9uGfBTX1Z2MCqvNz1MgEir9joDPoQpoE6BELx",
  },
  {
    baseTokenName: 'DOGE',
    quoteTokenName: 'SOL',
    marketPda: "AZHkGWdchSNgPfeMoiD7SVGN6ZjQhuvAweBmSc5ZTLhg",
  },

];

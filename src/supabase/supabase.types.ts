interface Market {
  address: string;
  name: string;
  baseToken: Token
  quoteToken: Token
}

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

// TODO 
// [ ] Orderbook
// [ ] OpenOrdersAccount
// [ ] Trade ( Place orders buy / sell)

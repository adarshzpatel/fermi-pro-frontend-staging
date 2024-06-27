export const RPC_URL = {
  devnet: "https://api.devnet.solana.com",
};
export const FERMI_DEVNET_PROGRAM_ID =
  "33ZENzbUfMGwZZYQDCj8DEeBKBqd8LaCKnMfQQnMVGFW";

export type MarketType = {
  baseTokenName: string;
  quoteTokenName: string;
  marketPda: string;
};

export const MARKETS: MarketType[] = [
  {
    baseTokenName: "JUP",
    quoteTokenName: "USDC",
    marketPda: "C6YLjpnvz4aUQUzqdqdiZg1nBDPG6XGVxy6FWmWSiFAD",
  },
  {
    baseTokenName: "CWIF",
    quoteTokenName: "USDC",
    marketPda: "DgH5EyJK8EUFeYwfKnLU5JVrFbRZUJBiVh3Re5QRTN3p",
  },
  {
    baseTokenName: "KMNO",
    quoteTokenName: "USDC",
    marketPda: "2UgASzUhxCpEMqX91MqaYQp1GzSoqDUPLAV3QMb3UKgb",
  },
];

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { fetchTokenBalance } from "@/solana/utils/helpers";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import { useFermiStore } from "@/stores/fermiStore";

const useTokenBalances = () => {
  const [baseTokenBalance, setBaseTokenBalance] = useState<number>(0);
  const [quoteTokenBalance, setQuoteTokenBalance] = useState<number>(0);
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  const { connection } = useConnection();
  const connectedWallet = useAnchorWallet();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!connectedWallet?.publicKey) return;
      if (!selectedMarket?.current) return;
      if (!connection) return;

      const quoteBalance = await fetchTokenBalance(
        connectedWallet?.publicKey,
        selectedMarket.current?.quoteMint,
        connection
      );

      const baseBalance = await fetchTokenBalance(
        connectedWallet.publicKey,
        selectedMarket.current?.baseMint,
        connection
      );

      setBaseTokenBalance(Number(baseBalance) / 1000000000);
      setQuoteTokenBalance(Number(quoteBalance) / 1000000);
    };

    fetchBalances();
  }, [connectedWallet, selectedMarket, connection]);

  return { baseTokenBalance, quoteTokenBalance };
};


export default useTokenBalances;
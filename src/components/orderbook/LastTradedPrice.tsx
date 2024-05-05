import { useFermiStore } from "@/stores/fermiStore";
import supabase from "@/supabase";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {};

const LastTradedPrice = (props: Props) => {
  const [lastTradedPrice, setLastTradedPrice] = useState<string | null>(null);
  const selectedMarket = useFermiStore((s) => s.selectedMarket);
  useEffect(() => {
    if (selectedMarket?.publicKey) {
      const getLastTradedPrice = async () => {
        // make this realtime.
        // get the last traded price with latest timestamp from spabase table price_feed

        const { data, error } = await supabase
          .from("price_feed")
          .select("*")
          .eq("market", selectedMarket.publicKey.toString())
          .order("timestamp", { ascending: false })
          .limit(1);

        if (error) {
          toast.error("Failed to get last traded price");
          console.error("[LAST_TRADED_PRICE] :", error);
          return;
        }
        if(data?.length > 0){
          const price = data?.[0]?.["price"];
          if (price) setLastTradedPrice(price);
        }
      };
      getLastTradedPrice();
    }
  }, [selectedMarket]);

  return (
    <div className="bg-gray-900/75 border-y text-center text-sm  font-medium border-gray-600 p-4">
      {lastTradedPrice ?? "Last traded price"}
    </div>
  );
};

export default LastTradedPrice;

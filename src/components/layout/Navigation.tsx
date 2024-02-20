"use client";
import Link from "next/link";
import CustomWalletConnectButton from "./CustomConnectWalletButton";
import { MARKETS } from "@/solana/constants";

export default function Navigation() {
  return (
    <nav className="bg-gray-900 rounded-xl   flex items-center  border border-gray-600 shadow-xl h-16">
      <div className=" h-full grid place-items-center px-4 rounded-l-xl  bg-gray-800/50 border-r  border-gray-700 ">
        <h1 className="text-xl">FERMI</h1>
      </div>
      <div className="text-white/60 flex items-center text-sm   gap-3 px-3">
        <Link
          href={"/"}
          className="hover:text-white h-full  px-4 py-2 hover:bg-gray-700/50 duration-300 ease-out rounded-md"
        >
          Trade
        </Link>
        <Link
          href={`/airdrop?market=${MARKETS[0].marketPda}`}
          className="hover:text-white h-full px-4 py-2 hover:bg-gray-700/50 duration-300 ease-out rounded-md"
        >
          Airdrop
        </Link>
      </div>
      <div className="ml-auto h-full grid place-items-center   ">
        <CustomWalletConnectButton />
      </div>
    </nav>
  );
}

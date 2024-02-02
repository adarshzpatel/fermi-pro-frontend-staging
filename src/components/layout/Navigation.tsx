"use client";
import Link from "next/link";
import CustomWalletConnectButton from "./CustomConnectWalletButton";

export default function Navigation() {
  return (
    <header className=" border-gray-600 w-screen pt-4 px-4 ">
      <nav className="flex items-center justify-between ">
        <Link
          href={"/"}
          className="font-semibold  flex-1 text-2xl  font-heading"
        >
           FERMI.
        </Link>
        <div className="flex items-center gap-4">
          <Link
            color="foreground"
            href="/airdrop"
            className={
              "rounded-full px-4 py-2  focus-within:outline-none  border-gray-600 bg-gray-800/75 hover:ring ring-gray-800/75  border shadow-lg hover:bg-gray-700/80 focus:bg-gray-700/80 hover:border-gray-400 text-gray-400 hover:text-gray-200 focus:text-gray-200 focus:border-gray-400  focus:ring-2  flex items-center justify-between cursor-pointer"
            }
          >
            Airdrop
          </Link>
          <Link
            color="foreground"
            href="/trade"
            className={
              " rounded-full px-4 py-2  focus-within:outline-none  border-gray-600 bg-gray-800/75 hover:ring ring-gray-800/75 hover:bg-gray-700/80 focus:bg-gray-700/80  border shadow-lg hover:border-gray-400 text-gray-400 hover:text-gray-200 focus:text-gray-200 focus:border-gray-400  focus:ring-2  flex items-center justify-between cursor-pointer"
            }
          >
            Trade
          </Link>
          <div>
            <CustomWalletConnectButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

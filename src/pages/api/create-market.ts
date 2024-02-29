import { FERMI_DEVNET_PROGRAM_ID, RPC_URL } from "@/solana/constants";
import { OpenBookV2Client } from "@/solana/fermiClient";
import {
  createMint
} from "@/solana/utils/helpers";
import { AnchorProvider, BN, Wallet } from "@coral-xyz/anchor";

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    1, 60, 46, 125, 82, 22, 178, 15, 93, 247, 249, 207, 76, 156, 177, 42, 124,
    17, 225, 67, 204, 111, 68, 38, 71, 16, 206, 114, 165, 219, 70, 72, 134, 112,
    118, 222, 227, 101, 128, 158, 70, 17, 179, 29, 31, 208, 236, 211, 12, 89,
    41, 84, 52, 209, 127, 51, 144, 164, 103, 219, 20, 253, 3, 158,
  ])
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try{
    const payer = OWNER_KEYPAIR 
    const wallet = new Wallet(OWNER_KEYPAIR);
    console.log("OWNER KEYPAIR: ",payer.publicKey.toString())
    const name = req.query.name as string ?? "market_name";
    const conn = new Connection(RPC_URL.devnet);
    const provider = new AnchorProvider(conn, wallet, {
      commitment: "confirmed",
    });
    const client = new OpenBookV2Client(provider, new PublicKey(FERMI_DEVNET_PROGRAM_ID));
    const coinMint = Keypair.generate();
    const pcMint = Keypair.generate();
    
    await createMint(provider, coinMint, 9);
    await createMint(provider, pcMint, 6);
    
    const quoteMint = new PublicKey(coinMint.publicKey.toBase58());
    const baseMint = new PublicKey(pcMint.publicKey.toBase58());
    
    // Define market parameter
    const quoteLotSize = new BN(1000000);
    const baseLotSize = new BN(1000000000);
    const makerFee = new BN(0);
    const takerFee = new BN(0);
    const timeExpiry = new BN(0);
    
    const [
      [bidIx, askIx, eventHeapIx, ix],
      [market, bidsKeypair, askKeypair, eventHeapKeypair],
    ] = await client.createMarketIx(
      payer.publicKey,
      name,
      quoteMint,
      baseMint,
      quoteLotSize,
      baseLotSize,
      makerFee,
      takerFee,
      timeExpiry,
      null, // oracleA
      null, // oracleB
      null, // openOrdersAdmin
      null, // consumeEventsAdmin
      null // closeMarketAdmin
      );
      console.log(market.publicKey.toString())
      console.log("Creating New Market....");
      await client.sendAndConfirmTransaction([bidIx, askIx, eventHeapIx, ix], {
        additionalSigners: [
          payer,
          market,
          bidsKeypair,
          askKeypair,
          eventHeapKeypair,
        ],
      });
      
    console.log("MARKET CREATED SUCCESSFULLY")
      res.status(200).json({ message: "SUCESS", marketPk: market.publicKey.toString()});
    } catch(err){
      res.status(500).json({message:"ERROR",error:JSON.stringify(error)});
    }
}

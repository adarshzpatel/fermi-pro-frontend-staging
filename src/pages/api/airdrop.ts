import {
  checkOrCreateAssociatedTokenAccount,
  mintTo,
} from "@/solana/utils/helpers";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";

const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    229, 207, 192, 114, 233, 58, 53, 201, 119, 77, 46, 179, 94, 131, 174, 205,
    54, 177, 178, 55, 62, 42, 240, 50, 60, 78, 34, 14, 181, 90, 90, 57, 181, 45,
    63, 255, 32, 103, 173, 51, 75, 240, 141, 152, 55, 52, 35, 133, 252, 111,
    202, 141, 174, 123, 200, 180, 83, 1, 183, 161, 227, 154, 145, 39,
  ])
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const destinationAddress = req.body?.destinationAddress;
  const mint = req.body?.mint;
  const amount = Number(req.body?.amount);
  if (!destinationAddress || !mint || !amount)
    res.status(500).send("Invalid inputs");

  const destination = new PublicKey(destinationAddress);
  const wallet = new Wallet(OWNER_KEYPAIR);
  const connection = new Connection("https://api.devnet.solana.com", {
    commitment: "confirmed",
  });
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  const authorityCoinTokenAccount = await checkOrCreateAssociatedTokenAccount(
    provider,
    new PublicKey(mint),
    destination
  );

  await mintTo(
    provider,
    new PublicKey(mint),
    new PublicKey(authorityCoinTokenAccount),
    BigInt(amount)
  );
  console.log("MINTED");

  res.status(200).json({ message: "SUCESS" });
}

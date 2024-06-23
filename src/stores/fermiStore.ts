import { AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  BookSideAccount,
  EventHeapAccount,
  FermiClient,
  FillEvent,
  LeafNode,
  MarketAccount,
  OpenOrdersAccount,
  OutEvent,
} from "@/solana/fermiClient";
import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { FERMI_DEVNET_PROGRAM_ID, MARKETS, RPC_URL } from "@/solana/constants";
import {
  Side,
  checkOrCreateAssociatedTokenAccount,
} from "@/solana/utils/helpers";
import { parseBookSideAccount, parseEventHeap } from "@/solana/parsers";

import { AnchorWallet } from "@solana/wallet-adapter-react";
import EmptyWallet from "@/solana/utils/emptyWallet";
import { create } from "zustand";
import { produce } from "immer";
import { subscribeWithSelector } from "zustand/middleware";
import supabase from "@/supabase";
import { toast } from "sonner";

type FermiStore = {
  client: FermiClient;
  set: (x: (x: FermiStore) => void) => void;
  selectedMarket:
    | {
        current: MarketAccount | null;
        publicKey: PublicKey;
        baseTokenName: string;
        quoteTokenName: string;
      }
    | undefined;
  openOrders:
    | {
        publicKey: PublicKey;
        account: OpenOrdersAccount | null;
        orders: {
          clientOrderId: string;
          lockedPrice: string;
          id: string;
        }[];
      }
    | undefined;
  orderbook:
    | {
        bids: LeafNode[] | null;
        asks: LeafNode[] | null;
      }
    | undefined;
  eventHeap: any | undefined;
  actions: {
    connectClientToWallet: (
      wallet: AnchorWallet,
      connection: Connection
    ) => void;
    fetchOpenOrders: () => Promise<void>;
    // fetchMarket: (marketPda: PublicKey) => Promise<void>;
    fetchEventHeap: () => Promise<void>;
    fetchOrderbook: () => Promise<void>;
    placeOrder: (price: BN, size: BN, side: "bid" | "ask") => Promise<void>;
    placeMarketOrder: (price: BN, side: "bid" | "ask") => Promise<void>;
    cancelOrderById: (id: string) => Promise<void>;
    finalise: (
      maker: PublicKey,
      taker: PublicKey,
      takerSide: number,
      slotsToConsume: BN,
      price: any
    ) => Promise<void>;
    finaliseDirect: () => Promise<void>;
    cancelWithPenalty: (
      maker: PublicKey,
      taker: PublicKey,
      takerSide: number,
      side: string,
      slot: BN
    ) => Promise<void>;
  };
};

export const initFermiClient = (provider: AnchorProvider) => {
  const postSendTxCallback = ({ txid }: { txid: string }) => {
    console.log(`[Tx] ${txid} sent`);
    console.log(
      `[Tx] Explorer: https://explorer.solana.com/tx/${txid}?cluster=devnet`
    );
    toast("Transaction sent", { description: txid });
  };
  const txConfirmationCommitment: Commitment = "confirmed";
  const opts = {
    postSendTxCallback,
    txConfirmationCommitment,
  };
  const client = new FermiClient(
    provider,
    new PublicKey(FERMI_DEVNET_PROGRAM_ID),
    opts
  );
  return client;
};

const ENDPOINT = RPC_URL.devnet;
const emptyWallet = new EmptyWallet(Keypair.generate());

export const useFermiStore = create<FermiStore>()(
  subscribeWithSelector((_set, get) => {
    const connection = new Connection(ENDPOINT);
    const provider = new AnchorProvider(connection, emptyWallet, {
      commitment: "finalized",
    });
    const client = initFermiClient(provider);
    return {
      client: client,
      set: (fn) => _set(produce(fn)),
      selectedMarket: undefined,
      openOrders: undefined,
      orderbook: undefined,
      eventHeap: undefined,
      actions: {
        connectClientToWallet: (
          wallet: AnchorWallet,
          connection: Connection
        ) => {
          const set = get().set;
          const provider = new AnchorProvider(connection, wallet, {
            commitment: "finalized",
          });
          const client = initFermiClient(provider);
          set((s) => {
            s.client = client;
          });
          toast("Connected to wallet");
        },
        fetchEventHeap: async () => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const eventHeapPk = get().selectedMarket?.current?.eventHeap;
          if (!eventHeapPk) throw new Error("Market not found");
          const eventHeapAcc = await client.deserializeEventHeapAccount(
            eventHeapPk
          );
          const parsedEventHeap = parseEventHeap(client, eventHeapAcc);

          get().set((s) => {
            s.eventHeap = parsedEventHeap;
          });
        },
        fetchOpenOrders: async () => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const selectedMarket = get().selectedMarket;
          const set = get().set;
          if (!selectedMarket) throw new Error("No market selected");

          const openOrdersAccList = await client?.findOpenOrdersForMarket(
            client.walletPk,
            selectedMarket?.publicKey
          );

          const openOrdersAccPk = openOrdersAccList[0] ?? "";

          const openOrdersAcc = await client?.deserializeOpenOrderAccount(
            openOrdersAccPk
          );
          let orders: any = openOrdersAcc?.openOrders;

          if (orders) {
            orders = orders.filter((i: any) => i.isFree === 0);
            orders = orders.map((i: any) => {
              let side = "none";
              return {
                clientOrderId: i.clientId.toString(),
                side: i.sideAndTree === 0 ? "bid" : "ask",
                lockedPrice: i.lockedPrice.toString(),
                id: i.id.toString(),
              };
            });
          }

          set((s) => {
            s.openOrders = {
              publicKey: openOrdersAccPk,
              account: openOrdersAcc,
              orders: orders,
            };
          });
        },
        fetchOrderbook: async () => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const selectedMarket = get().selectedMarket?.current;
          const set = get().set;
          if (!selectedMarket) throw new Error("No market selected");
          const bidsPk = selectedMarket?.bids;
          const asksPk = selectedMarket?.asks;
          const bidsAcc = await client.deserializeBookSide(bidsPk);
          const asksAcc = await client.deserializeBookSide(asksPk);
          if (!bidsAcc || !asksAcc)
            throw new Error("[Orderbook] Asks or Bids not ");
          const bids = parseBookSideAccount(client, bidsAcc);
          const asks = parseBookSideAccount(client, asksAcc);

          // const stringifiedBids = bids?.map((bid) => ({})

          set((s) => {
            s.orderbook = {
              bids,
              asks,
            };
          });
        },
        cancelOrderById: async (id: string) => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const market = get().selectedMarket;
          const openOrders = get().openOrders;
          const orderId = new BN(id);

          if (!openOrders?.account)
            throw new Error("Open orders account not found");
          if (!market?.current) throw new Error("market not found");

          const [ix, signers] = await client?.cancelOrderById(
            openOrders.publicKey,
            openOrders.account,
            market.current,
            orderId
          );
          await client.sendAndConfirmTransaction([ix]);
          await get().actions.fetchOpenOrders();
          await get().actions.fetchOrderbook();
        },
        placeMarketOrder: async (price: BN, side: "bid" | "ask") => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const oo = get().openOrders;
          const selectedMarket = get().selectedMarket;

          if (!oo?.account) throw new Error("Open orders not found");
          if (!selectedMarket?.current) throw new Error("Market Not Selected");

          // Generate client order id  - number of open orders + 1
          const clientOrderId = new BN((oo?.orders?.length ?? 0) + 1);

          // build order args
          const orderArgs = {
            side: side === "bid" ? Side.Bid : Side.Ask,
            priceLots: price,
            maxBaseLots: new BN(0),
            maxQuoteLotsIncludingFees: new BN(0),
            clientOrderId,
            orderType: { immediateOrCancel: {} }, // market order
            expiryTimestamp: new BN(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
            selfTradeBehavior: { decrementTake: {} }, // Options might include 'decrementTake', 'cancelProvide', 'abortTransaction', etc.
            limit: 5,
          };

          // Get the user's token accounts

          const userBaseTokenAccount = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              selectedMarket.current.baseMint,
              client.walletPk
            )
          );

          const userQuoteTokenAccount = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              selectedMarket.current.quoteMint,
              client.walletPk
            )
          );

          const [ix, signers] = await client.placeTakeOrderIx(
            new PublicKey(selectedMarket.publicKey),
            selectedMarket.current,
            userBaseTokenAccount,
            userQuoteTokenAccount,
            null, // openOrdersAdmin,
            orderArgs,
            [], // remainingAccounts
            null // referrerAccount
          );

          // Send transaction
          await client.sendAndConfirmTransaction([ix], {
            additionalSigners: signers,
          });

          await get().actions.fetchOrderbook();
          await get().actions.fetchOpenOrders();
          await get().actions.fetchEventHeap();
        },
        placeOrder: async (price: BN, size: BN, side: "bid" | "ask") => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const oo = get().openOrders;
          const selectedMarket = get().selectedMarket;

          if (!oo?.account) throw new Error("Open orders not found");
          if (!selectedMarket?.current) throw new Error("Market not found");

          // generate client id  - number of open orders + 1
          const clientOrderId = new BN((oo?.orders?.length ?? 0) + 1);
          // build order args
          const orderArgs = {
            side: side === "bid" ? Side.Bid : Side.Ask,
            priceLots: price,
            maxBaseLots: size,
            maxQuoteLotsIncludingFees: new BN(size).mul(new BN(price)),
            clientOrderId,
            orderType: { limit: {} },
            expiryTimestamp: new BN(Math.floor(Date.now() / 1000) + 3600),
            selfTradeBehavior: { decrementTake: {} }, // Options might include 'decrementTake', 'cancelProvide', 'abortTransaction', etc.
            limit: 5,
          };

          // get user token account according to the side
          // quote ata for bid, base ata for ask
          let userTokenAccount;
          if (side === "bid") {
            userTokenAccount = new PublicKey(
              await checkOrCreateAssociatedTokenAccount(
                client.provider,
                selectedMarket.current?.quoteMint,
                client.walletPk
              )
            );
          } else {
            userTokenAccount = new PublicKey(
              await checkOrCreateAssociatedTokenAccount(
                client.provider,
                selectedMarket.current?.baseMint,
                client.walletPk
              )
            );
          }
          const [ix, signers] = await client.placeOrderIx(
            oo.publicKey,
            selectedMarket.publicKey,
            selectedMarket.current,
            selectedMarket.current.marketAuthority,
            userTokenAccount,
            null, // openOrdersAdmin
            orderArgs,
            [] // remainingAccounts
          );
          // Send transaction
          await client.sendAndConfirmTransaction([ix], {
            additionalSigners: signers,
          });

          await get().actions.fetchOrderbook();
          await get().actions.fetchOpenOrders();
          await get().actions.fetchEventHeap();
        },
        cancelWithPenalty: async (
          maker: PublicKey,
          taker: PublicKey,
          takerSide: number,
          side: string,
          slot: BN
        ) => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const selectedMarket = get().selectedMarket;
          if (!selectedMarket) throw new Error("Market Not Selected");
          // accs -> market , marketAuth, eventHeap, makerAta,takerAta,marketVaultQuote,marketVaultBase,maker,taker,tokenProgram,systemprogram,
          // args -> side, slot
          const market = selectedMarket.current;
          if (market === null)
            throw new Error("error in cancel ith penalty : market is null");
          const ooMaker = await client.deserializeOpenOrderAccount(maker);
          const ooTaker = await client.deserializeOpenOrderAccount(taker);

          if (!ooMaker || !ooTaker) throw new Error("Open orders not found");
          // taker Side = 0 ( bid ) , 1 = (ask)
          const makerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              takerSide === 0 ? market.baseMint : market.quoteMint,
              ooMaker?.owner
            )
          );
          const takerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              takerSide === 0 ? market.quoteMint : market.baseMint,
              ooTaker?.owner
            )
          );

          const ix = await client.program.methods
            .cancelWithPenalty(side === "bid" ? Side.Bid : Side.Ask, slot)
            .accounts({
              market: selectedMarket.publicKey,
              eventHeap: market.eventHeap,
              maker: maker,
              taker: taker,
              makerAta: makerAtaPublicKey,
              takerAta: takerAtaPublicKey,
              marketAuthority: market.marketAuthority,
              marketVaultBase: market.marketBaseVault,
              marketVaultQuote: market.marketQuoteVault,
            })
            .instruction();

          await client.sendAndConfirmTransaction([ix]);
          await get().actions.fetchOrderbook();
          await get().actions.fetchOpenOrders();
          await get().actions.fetchEventHeap();
        },
        finaliseDirect: async () => {},
        finalise: async (maker, taker, takerSide, slotsToConsume, price) => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const market = get().selectedMarket?.current;
          if (!market) throw new Error("No market found!");
          const marketPublicKey = get().selectedMarket?.publicKey;
          if (!marketPublicKey) throw new Error("No market found!");

          const ooMaker = await client.deserializeOpenOrderAccount(maker);
          const ooTaker = await client.deserializeOpenOrderAccount(taker);
          if (!ooMaker || !ooTaker) throw new Error("Open orders not found");

          // taker Side = 0 ( bid ) , 1 = (ask)
          const makerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              takerSide === 0 ? market.baseMint : market.quoteMint,
              ooMaker?.owner
            )
          );
          const takerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              takerSide === 0 ? market.quoteMint : market.baseMint,
              ooTaker?.owner
            )
          );
          console.log("EVENT HEAP : ", get().eventHeap);
          console.log("FINALISE ARGS : ", {
            currentWallet: client.walletPk.toString(),
            currentWalletOpenOrders: get().openOrders?.publicKey.toString(),
            maker: maker.toString(),
            taker: taker.toString(),
            makerAtaPublicKey: makerAtaPublicKey.toString(),
            takerAtaPublicKey: takerAtaPublicKey.toString(),
            slot: slotsToConsume.toString(),
            takerSide,
            makerOwnerWallet: ooMaker?.owner.toString(),
            takerOwnerWallet: ooTaker?.owner?.toString(),
            baseToken: market.baseMint.toString(),
            quoteToken: market.quoteMint.toString(),
          });

          const [ixs, signers] =
            await client.createFinalizeGivenEventsInstruction(
              marketPublicKey,
              market.marketAuthority,
              market.eventHeap,
              makerAtaPublicKey,
              takerAtaPublicKey,
              market.marketBaseVault,
              market.marketQuoteVault,
              maker,
              taker,
              slotsToConsume
            );

          await client.sendAndConfirmTransaction(ixs);

          const { data, error } = await supabase
            .from("price_feed")
            .insert([
              {
                price: Number(price.toString()),
                market: marketPublicKey.toString(),
              },
            ])
            .select();
          if (error) console.log("error adding to price feed ", error);
          toast.success("Order Finalised");
          await get().actions.fetchOrderbook();
          await get().actions.fetchEventHeap();
          await get().actions.fetchOpenOrders();
        },
      },
    };
  })
);

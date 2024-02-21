import {
  BookSideAccount,
  EventHeapAccount,
  FillEvent,
  LeafNode,
  MarketAccount,
  OpenBookV2Client,
  OpenOrdersAccount,
  OutEvent,
} from "@/solana/fermiClient";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { create } from "zustand";
import { produce } from "immer";
import { subscribeWithSelector } from "zustand/middleware";

import { toast } from "sonner";
import EmptyWallet from "@/solana/utils/emptyWallet";

import { FERMI_DEVNET_PROGRAM_ID, MARKETS, RPC_URL } from "@/solana/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  Side,
  checkOrCreateAssociatedTokenAccount,
} from "@/solana/utils/helpers";

type FermiStore = {
  client: OpenBookV2Client;
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
    cancelOrderById: (id: string) => Promise<void>;
    finalise: (
      maker: PublicKey,
      taker: PublicKey,
      side:string,
      slotsToConsume: BN
    ) => Promise<void>;
    cancelWithPenalty: (
      maker: PublicKey,
      taker: PublicKey,
      side:string,
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
  const client = new OpenBookV2Client(
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
          console.log({ eventHeapAcc, parsedEventHeap });
          // console.log({ parsedEventHeap });
          get().set((s) => {
            s.eventHeap = parsedEventHeap;
          });
          console.log("[ EVENT HEAP ]: ", get().eventHeap);
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
          // console.log(JSON.stringify(openOrdersAcc?.position, null));

          let orders: any = openOrdersAcc?.openOrders;
          // parse orders
          const orderbook = get().orderbook

          if (orders) {
            orders = orders.filter((i: any) => i.isFree === 0);
            orders = orders.map((i: any) => {
              let side = 'none'
              if(orderbook?.bids?.find((it)=>it.key === i.id.toString())) side = "bid";
              if(orderbook?.asks?.find((it)=>it.key === i.id.toString())) side = "ask";
              return ({
                clientOrderId: i.clientId.toString(),
                side,
                lockedPrice: i.lockedPrice.toString(),
                id: i.id.toString(),
              })
            })
          }

          set((s) => {
            s.openOrders = {
              publicKey: openOrdersAccPk,
              account: openOrdersAcc,
              orders: orders,
            };
          });
          console.log("[ OPEN ORDERS ACCOUNT ]: ", get().openOrders);
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
          console.log("[ ORDERBOOK ] : ", get().orderbook);
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
          toast.success("Order Cancelled");
          await get().actions.fetchOrderbook();
          await get().actions.fetchOpenOrders();
          await get().actions.fetchEventHeap();
        },
        cancelWithPenalty: async (
          maker: PublicKey,
          taker: PublicKey,
          side:string,
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
          const makerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              market.baseMint,
              ooMaker?.owner
            )
          );

          const takerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              market.baseMint,
              ooTaker?.owner
            )
          );

          const ix = await client.program.methods
            .cancelWithPenalty(side === 'bid' ? Side.Bid : Side.Ask, slot)
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
          console.log("cancelled with penalty");
          await get().actions.fetchOrderbook();
          await get().actions.fetchOpenOrders();
          await get().actions.fetchEventHeap();
        },
        finalise: async (maker, taker, side,slotsToConsume: BN) => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const market = get().selectedMarket?.current;
          if (!market) throw new Error("No market found!");
          const marketPublicKey = get().selectedMarket?.publicKey;
          if (!marketPublicKey) throw new Error("No market found!");

          const ooMaker = await client.deserializeOpenOrderAccount(maker);
          const ooTaker = await client.deserializeOpenOrderAccount(taker);
          // console.log(ooMaker?.owner.toString());
          // console.log(ooTaker?.owner.toString());
          if (!ooMaker || !ooTaker) throw new Error("Open orders not found");

          console.log({
            slotsToConsume,
          });


          const makerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              side === 'bid' ? market.baseMint : market.quoteMint,
              ooMaker?.owner
            )
          );
          const takerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              side === 'bid' ? market.quoteMint : market.baseMint,
              ooTaker?.owner
            )
          );

          const [ix, signers] =
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

          await client.sendAndConfirmTransaction([ix], {
            additionalSigners: signers,
          });

          toast.success("Order Finalised");
          await get().actions.fetchOrderbook();
          await get().actions.fetchOpenOrders();
          await get().actions.fetchEventHeap();
        },
      },
    };
  })
);

export const parseBookSideAccount = (
  client: OpenBookV2Client,
  acc: BookSideAccount
) => {
  const nodes =
    acc &&
    client.getLeafNodes(acc).map((node) => ({
      ...node,
      key: node.key.toString(),
      price: new BN(node.key).shrn(64).toString(),
      quantity: node.quantity.toString(),
    }));

  return nodes;
};

export const parseEventHeap = (
  client: OpenBookV2Client,
  eventHeap: EventHeapAccount | null
) => {
  if (eventHeap == null) throw new Error("Event Heap not found");
  let fillEvents: any = [];
  let outEvents: any = [];
  // let nodes: any = [];
  if (eventHeap !== null) {
    (eventHeap.nodes as any).forEach((node: any, i: number) => {
      // nodes.push(node.event);
      if (node.event.eventType === 0) {
        const fillEvent: FillEvent = client.program.coder.types.decode(
          "FillEvent",
          Buffer.from([0, ...node.event.padding])
        );
        if (fillEvent.timestamp.toString() !== "0") {
          fillEvents.push({
            ...fillEvent,
            index: i,
            maker: fillEvent.maker.toString(),
            taker: fillEvent.taker.toString(),
            price: fillEvent.price.toString(),
            quantity: fillEvent.quantity.toString(),
            makerClientOrderId: fillEvent.makerClientOrderId.toString(),
            takerClientOrderId: fillEvent.takerClientOrderId.toString(),
          });
        }
      } else {
        const outEvent: OutEvent = client.program.coder.types.decode(
          "OutEvent",
          Buffer.from([0, ...node.event.padding])
        );
        if (outEvent.timestamp.toString() !== "0")
          outEvents.push({ ...outEvent, index: i });
      }
    });
  }
  // console.log({ fillEvents, outEvents });
  return fillEvents;
};

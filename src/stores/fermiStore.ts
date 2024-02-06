import {
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
      connection: Connection,
    ) => void;
    fetchOpenOrders: () => Promise<void>;
    fetchMarket: (marketPda: PublicKey) => Promise<void>;
    fetchEventHeap: () => Promise<void>;
    fetchOrderbook: () => Promise<void>;
    placeOrder: (price: BN, size: BN, side: "bid" | "ask") => Promise<void>;
    cancelOrderById: (id: string) => Promise<void>;
    finalise: (
      maker: PublicKey,
      taker: PublicKey,
      slotsToConsume: BN,
    ) => Promise<void>;
  };
};

export const initFermiClient = (provider: AnchorProvider) => {
  const postSendTxCallback = ({ txid }: { txid: string }) => {
    console.group("Post tx sent callback");
    console.log(`Transaction ${txid} sent`);
    console.log(
      `Explorer: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
    );
    toast.success("Transaction sent successfully", { description: txid });
  };
  const txConfirmationCommitment: Commitment = "finalized";
  const opts = {
    postSendTxCallback,
    txConfirmationCommitment,
  };
  const client = new OpenBookV2Client(
    provider,
    new PublicKey(FERMI_DEVNET_PROGRAM_ID),
    opts,
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
          connection: Connection,
        ) => {
          const set = get().set;
          const provider = new AnchorProvider(connection, wallet, {
            commitment: "finalized",
          });
          const client = initFermiClient(provider);
          set((s) => {
            s.client = client;
          });
          toast.success("Connected to wallet");
        },
        fetchEventHeap: async () => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const eventHeapPk = get().selectedMarket?.current?.eventHeap;
          if (!eventHeapPk) throw new Error("Market not found");
          const eventHeapAcc =
            await client.deserializeEventHeapAccount(eventHeapPk);
          const parsedEventHeap = parseEventHeap(client, eventHeapAcc);
          console.log({ parsedEventHeap });
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
            selectedMarket?.publicKey,
          );

          const openOrdersAccPk = openOrdersAccList[0] ?? "";

          const openOrdersAcc =
            await client?.deserializeOpenOrderAccount(openOrdersAccPk);

          let orders: any = openOrdersAcc?.openOrders;
          // parse orders

          if (orders) {
            orders = orders.filter((i: any) => i.isFree === 0);
            orders = orders.map((i: any) => ({
              clientOrderId: i.clientId.toString(),
              lockedPrice: i.lockedPrice.toString(),
              id: i.id.toString(),
            }));
          }

          set((s) => {
            s.openOrders = {
              publicKey: openOrdersAccPk,
              account: openOrdersAcc,
              orders: orders,
            };
          });
        },
        fetchMarket: async (marketPda: PublicKey) => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const set = get().set;
          const market = await client.deserializeMarketAccount(marketPda);

          if (market === null) throw new Error("Invalid market");

          set((s) => {
            s.selectedMarket = {
              publicKey: marketPda,
              current: market,
            };
          });

          await get().actions.fetchOrderbook();
          await get().actions.fetchEventHeap();
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
          const bids = bidsAcc && (await client.getLeafNodes(bidsAcc));
          const asks = asksAcc && (await client.getLeafNodes(asksAcc));

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
          console.log(client.walletPk.toString());
          const [ix, signers] = await client?.cancelOrderById(
            openOrders.publicKey,
            openOrders.account,
            market.current,
            orderId,
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
                client.walletPk,
              ),
            );
          } else {
            userTokenAccount = new PublicKey(
              await checkOrCreateAssociatedTokenAccount(
                client.provider,
                selectedMarket.current?.baseMint,
                client.walletPk,
              ),
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
            [], // remainingAccounts
          );
          // Send transaction
          await client.sendAndConfirmTransaction([ix], {
            additionalSigners: signers,
          });

          await get().actions.fetchOrderbook();
          await get().actions.fetchOpenOrders();
        },
        finalise: async (maker, taker, slotsToConsume: BN) => {
          const client = get().client;
          if (!client) throw new Error("Client not found");
          const market = get().selectedMarket?.current;
          if (!market) throw new Error("No market found!");
          const marketPublicKey = get().selectedMarket?.publicKey;
          if (!marketPublicKey) throw new Error("No market found!");

          const ooMaker = await client.deserializeOpenOrderAccount(maker);
          const ooTaker = await client.deserializeOpenOrderAccount(taker);
          console.log(ooMaker?.owner.toString());
          console.log(ooTaker?.owner.toString());
          if (!ooMaker || !ooTaker) throw new Error("Open orders not found");
          const makerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              market.quoteMint,
              ooMaker?.owner,
            ),
          );
          const takerAtaPublicKey = new PublicKey(
            await checkOrCreateAssociatedTokenAccount(
              client.provider,
              market.quoteMint,
              ooTaker?.owner,
            ),
          );

          const [ix, signers] = await client.createFinalizeEventsInstruction(
            marketPublicKey,
            market.marketAuthority,
            market.eventHeap,
            makerAtaPublicKey,
            takerAtaPublicKey,
            market.marketBaseVault,
            market.marketQuoteVault,
            maker,
            slotsToConsume,
          );

          await client.sendAndConfirmTransaction([ix], {
            additionalSigners: signers,
          });
        },
      },
    };
  }),
);

export const parseEventHeap = (
  client: OpenBookV2Client,
  eventHeap: EventHeapAccount | null,
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
          Buffer.from([0, ...node.event.padding]),
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
          Buffer.from([0, ...node.event.padding]),
        );
        if (outEvent.timestamp.toString() !== "0")
          outEvents.push({ ...outEvent, index: i });
      }
    });
  }
  console.log({ fillEvents, outEvents });
  return fillEvents;
};

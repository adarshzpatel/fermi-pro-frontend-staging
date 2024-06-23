import { BookSideAccount, EventHeapAccount, FermiClient, FillEvent, OutEvent } from "./fermiClient";

import { BN } from "@coral-xyz/anchor";

export const parseBookSideAccount = (
  client: FermiClient,
  acc: BookSideAccount
) => {
  const nodes =
    acc &&
    client.getLeafNodes(acc).map((node: any) => ({
      ...node,
      key: node.key.toString(),
      price: new BN(node.key).shrn(64).toString(),
      quantity: node.quantity.toString(),
    }));

  return nodes;
};

export const parseEventHeap = (
  client: FermiClient,
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
  return fillEvents;
};

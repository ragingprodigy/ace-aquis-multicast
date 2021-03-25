import { Socket } from "dgram";

import { orderCancelAsBuffer } from "../../messages/aquis/orderCancel";
import { nextSequence, randomOrderRef } from "../../sequencer";
import send from "./send";

const cancelledOrders: number[] = [];

export default (socket: Socket): void => {
  const { orderRef, instrumentId } = randomOrderRef();

  if (!cancelledOrders.includes(orderRef)) {
    const message = orderCancelAsBuffer(
      {
        instrumentId,
        orderRef,
        timestamp: BigInt(Date.now()),
      },
      { sequence: nextSequence() },
    );

    cancelledOrders.push(orderRef);
    send(socket, message);
  }
};

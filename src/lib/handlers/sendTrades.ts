import { Socket } from "dgram";

import { tradeAsBuffer } from "../../messages/aquis/trade";
import { getOrderRef, getTradeType, nextSequence, nextTradeRef } from "../../sequencer";
import send from "./send";

export default (socket: Socket): void => {
  const order = getOrderRef();
  if (order) {
    const { instrumentId, orderRef } = order;
    const message = tradeAsBuffer({
      instrumentId,
      options: Math.floor(Math.random() * 100),
      orderRef,
      price: BigInt(Math.floor(Math.random() * 1000000000)),
      quantity: Math.floor(Math.random() * 1000),
      timestamp: BigInt(Date.now()),
      tradeRef: nextTradeRef(),
      tradeType: getTradeType(),
    }, { sequence: nextSequence() });

    send(socket, message);
  }
};

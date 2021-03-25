import { Side } from "@archax/ace-market-data-lib";
import { Socket } from "dgram";

import { orderAddAsBuffer } from "../../messages/aquis/orderAdd";
import { addOrderRef, nextOrderRef, nextSequence } from "../../sequencer";
import send from "./send";

export default (socket: Socket): void => {
  const orderRef = nextOrderRef();
  const instrumentId = [3, 4][Math.random() < 0.5 ? 0 : 1];
  const message = orderAddAsBuffer(
    {
      instrumentId,
      orderRef,
      // price: BigInt(Math.floor(Math.random() * 5000000)),
      price: 110n,
      quantity: Math.ceil(Math.random() * 10),
      side: [Side.buy, Side.sell][Math.random() < 0.5 ? 0 : 1],
      timestamp: BigInt(Date.now()),
    },
    { sequence: nextSequence() },
  );

  addOrderRef({ instrumentId, orderRef });
  send(socket, message);
};

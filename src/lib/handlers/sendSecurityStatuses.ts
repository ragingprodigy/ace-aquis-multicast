import { Socket } from "dgram";

import { securityStatusAsBuffer } from "../../messages/aquis/securityStatus";
import { nextSequence } from "../../sequencer";
import send from "./send";

export default (socket: Socket): void => {
  [3, 4, 5].forEach(instrumentId => {
    const message = securityStatusAsBuffer(
      {
        instrumentId,
        marketFlags: instrumentId === 5 ? 0 : 1,
        timestamp: BigInt(Date.now()),
        tradingStatus: instrumentId === 5 ? 3 : 1,
      },
      { sequence: nextSequence() },
    );

    send(socket, message);
  });
};

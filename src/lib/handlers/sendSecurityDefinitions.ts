import { Socket } from "dgram";

import { securityDefinitionAsBuffer } from "../../messages/aquis/securityDefinition";
import { nextSequence } from "../../sequencer";
import send from "./send";

export default (socket: Socket): void => {
  [3, 4, 5].forEach(instrumentId => {
    const message = securityDefinitionAsBuffer(
      {
        currency: "USD",
        instrumentId,
        isin: "huew",
        mic: "7236A",
        tickTableId: 2,
        umtf: "uwyeri"
      },
      { sequence: nextSequence() },
    );
    
    send(socket, message);
  });
};

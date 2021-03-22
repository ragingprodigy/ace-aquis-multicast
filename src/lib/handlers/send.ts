import { info } from "@archax/ace-lib/ops/log";
import { Socket } from "dgram";

import app from "../../config/app";
import { headerAsObject } from "../../messages/aquis/header";
import { MessageType } from "../../messages/aquis/types";
import { registerMessage } from "../../sequencer";

export default (socket: Socket, message: Buffer): void => {
  const { messageType, sequence } = headerAsObject(message);

  registerMessage({ message, sequence });

  // Prepend byte to the message
  const aquisBuffer = Buffer.concat([Buffer.alloc(1), message]);

  socket.send(
    aquisBuffer,
    0,
    aquisBuffer.length,
    app.port,
    app.multicastAddress,
    () => info(
      "broadcast sent",
      `stream.send.${MessageType[messageType]}`,
      {
        aquisBuffer: aquisBuffer.toString("hex"),
        message: message.toString("hex"),
        sequence
      },
    ),
  );
};

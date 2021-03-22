import { error, info } from "@archax/ace-lib/ops/log";
import dgram, { Socket } from "dgram";
import ip from "ip";

import { headerAsObject } from "../messages/aquis/header";
import { orderAddAsObject } from "../messages/aquis/orderAdd";
import { securityDefinitionAsObject } from "../messages/aquis/securityDefinition";
import { securityStatusAsObject } from "../messages/aquis/securityStatus";
import { tradeAsObject } from "../messages/aquis/trade";
import { MessageType } from "../messages/aquis/types";

export default async (): Promise<void> => {
  info("starting stream client", "clients.stream");

  const PORT = 18000;
  const MULTICAST_ADDR = "239.1.1.0";

  const client: Socket = dgram.createSocket("udp4");

  client.on("message", (message) => {
    const { messageType, sequence } = headerAsObject(message);
    let data: unknown;

    switch (messageType) {
      case MessageType.securityDefinition:
        data = securityDefinitionAsObject(message);
        break;
      case MessageType.securityStatus:
        data = securityStatusAsObject(message);
        break;
      case MessageType.orderAdd:
        data = orderAddAsObject(message);
        break;
      case MessageType.trade:
        data = tradeAsObject(message);
        break;
      default:
        error(`Unknown messageType: ${messageType}`, "clients.stream.error");
        break;
    }

    info(
      "message header",
      `clients.stream.decode.${MessageType[messageType]}`,
      { data, sequence },
    );
  });

  client.bind(PORT, () => {
    client.addMembership(MULTICAST_ADDR, ip.address());
  });
};
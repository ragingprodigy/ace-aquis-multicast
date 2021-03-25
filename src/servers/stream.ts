import { info } from "@archax/ace-lib/ops/log";
import dgram, { Socket } from "dgram";

import cancelOrder from "../lib/handlers/cancelOrder";
import sendOrders from "../lib/handlers/sendOrders";
import sendSecurityDefinitions from "../lib/handlers/sendSecurityDefinitions";
import sendSecurityStatuses from "../lib/handlers/sendSecurityStatuses";

// import sendTrades from "../lib/handlers/sendTrades";

const SRC_PORT = 6025;
const ONE_TICK = 100;

let tradeRef: NodeJS.Timeout;
let orderRef: NodeJS.Timeout;
let cancelRef: NodeJS.Timeout;

export default async (): Promise<void> =>
  new Promise((resolve) => {
    const socket: Socket = dgram.createSocket("udp4");

    socket.on("listening", () =>
      info("server listening", "servers.stream.listening"),
    );

    socket.bind(SRC_PORT, () => {
      socket.setBroadcast(true);
      socket.setMulticastTTL(128);

      // Send security definitions and statuses
      setTimeout(() => {
        sendSecurityDefinitions(socket);
        setTimeout(() => {
          sendSecurityStatuses(socket);
        }, ONE_TICK * 2);
      }, ONE_TICK * 3);

      setTimeout(() => {
        // Send an Order every 1000ms
        // Send a Trade every 2500ms
        setInterval(async () => {
          setTimeout(() => {
            if (!orderRef && !cancelRef) {
              // Start Sending Orders and Trades
              orderRef = setInterval(() => {
                sendOrders(socket);
              }, ONE_TICK * 25);

              // tradeRef = setInterval(() => {
              //   sendTrades(socket);
              // }, ONE_TICK * 25);

              cancelRef = setInterval(() => {
                cancelOrder(socket);
              }, ONE_TICK * 25);
            }
          }, ONE_TICK);
        }, ONE_TICK);
      }, ONE_TICK * 10);

      resolve();
    });
  });

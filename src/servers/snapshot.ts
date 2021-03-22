import { error, info } from "@archax/ace-lib/ops/log";
import net from "net";

import { headerAsBuffer, headerAsObject } from "../messages/aquis/header";
import { loginAsObject } from "../messages/aquis/login";
import { replayRequestAsObject } from "../messages/aquis/replayRequest";
import { MessageType } from "../messages/aquis/types";
import { getSnapshotMessages } from "../sequencer";

const LOG_TAG = "servers.snapshot.";

export default async (port: number): Promise<boolean> => new Promise(resolve => {
  const server = net.createServer((socket) => {
    socket.on("end", () => {
      info("snapshot client disconnected", `${LOG_TAG}end`);
    });

    socket.on("data", data => {
      const { messageType } = headerAsObject(data);

      switch (messageType) {
        case MessageType.login:
          // Respond with replayResponse
          info("login", `${LOG_TAG}data`, { ...loginAsObject(data) });
        
          socket.write(
            headerAsBuffer({
              messageType: MessageType.replayResponse,
              sequence: 3,
            })
          );
          break;
        case MessageType.replayRequest:
          // This should be a loop until the endSequence
          const { endSequence: endAt } = replayRequestAsObject(data);
          info("replay until", `${LOG_TAG}replayRequest`, { endAt });

          getSnapshotMessages(endAt).forEach((message, index) => {
            socket.write(message);
            info("sent replay message", `${LOG_TAG}replayResponse.${index}`);
          });
          break;
      }
    });
  });

  server.on("error", (err) => {
    error(err, `${LOG_TAG}error`);
  });
  
  server.listen(port, () => {
    info("snapshot server listening", `${LOG_TAG}listen`);
    resolve(true);
  });
});

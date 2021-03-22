import { createConnection } from "net";

import { headerAsObject } from "../messages/aquis/header";
import { loginAsBuffer } from "../messages/aquis/login";
import { replayRequestAsBuffer } from "../messages/aquis/replayRequest";
import { MessageType } from "../messages/aquis/types";

export default async (host: string, port: number): Promise<boolean> => {
  const client = createConnection({ host, port });

  return new Promise<boolean>((resolve, reject) => {
    // flag to know when we receive the initial replay response message
    let replayed = false;

    // reject if anything goes wrong
    client.on("close", reject);
    client.on("error", reject);

    // connect and send the logon as soon as we've connected
    client.on("connect", () => {
      // send the logon request
      client.write(
        loginAsBuffer({
          password: "pass",
          username: "test-user",
        }),
      );
    });

    client.on("data", (buffer: Buffer) => {
      // get the message header
      const { messageType } = headerAsObject(buffer);

      // if we get here it means the logon was accepted
      client.off("close", reject);

      // if we haven't already send the replay request
      if (messageType === MessageType.replayResponse && !replayed) {
        client.write(
          replayRequestAsBuffer({
            beginSequence: 1,
            endSequence: 20,
          }),
        );
        replayed = true;
        return;
      }

      // we've finished processing the results
      resolve(true);

      // now we need to stop processing the results and close the connection
      client.end();
    });
  });
};

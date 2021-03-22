import ip from "ip";

import snapshotClient from "./clients/snapshotClient";
// import streamClient from "./clients/streamClient";
import snapShotServer from "./servers/snapshot";
import streamServer from "./servers/stream";

(async () => {
  await streamServer();
  // await streamClient();
  await snapShotServer(17516);
  await snapshotClient(ip.address(), 17516);
})();

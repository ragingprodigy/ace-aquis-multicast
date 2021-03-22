# Aquis Multicast Stream and Snapshot Server

### Setting Up

- Install dependencies with: `yarn install`

- Start the server with the command: `yarn start`

### Configure ACE-Market-Data

Update the `.env` file for your `ace-exchange-gateway` with the following values

```sh
AQUIS_STREAM_ADDRESS=239.1.1.0
AQUIS_STREAM_PORT=18000

AQUIS_SNAPSHOT_HOST=<Your Ip Address>
AQUIS_SNAPSHOT_PORT=17516
```

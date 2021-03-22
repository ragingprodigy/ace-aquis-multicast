import { Timestamp } from "@archax/ace-market-data-lib";

import { MessageType } from "./types";

export interface ISnapshotStart {
  securityCount: number;
  streamSequence: number;
  timestamp: Timestamp;
}

export const messageType = MessageType.snapshotStart;

/**
 * Get the snapshotStart details as a JS object
 *
 * @param buffer
 */
export const snapshotStartAsObject = (buffer: Buffer): ISnapshotStart => ({
  securityCount: buffer.readUInt16LE(10),
  streamSequence: buffer.readUInt32LE(6),
  timestamp: buffer.readBigUInt64LE(12),
});

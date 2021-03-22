import { Instrument, OrderRef, Timestamp } from "@archax/ace-market-data-lib";

import { MessageType } from "./types";

export interface IOrderCancel {
  orderRef: OrderRef;
  instrumentId: Instrument;
  timestamp: Timestamp;
}

export const messageType = MessageType.orderCancel;

/**
 * Get the orderCancel details as a JS object
 *
 * @param buffer
 */
export const orderCancelAsObject = (buffer: Buffer): IOrderCancel => ({
  instrumentId: buffer.readUInt16LE(6),
  orderRef: buffer.readUInt32LE(8),
  timestamp: buffer.readBigUInt64LE(12),
});

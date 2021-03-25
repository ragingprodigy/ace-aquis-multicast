import { Instrument, InstrumentSize, OrderRef, OrderRefSize, Timestamp, TimestampSize } from "@archax/ace-market-data-lib";

import { headerAsBuffer, IMessageHeader, messageLength as headerMessageLength } from "./header";
import { MessageType } from "./types";

export interface IOrderCancel {
  orderRef: OrderRef;
  instrumentId: Instrument;
  timestamp: Timestamp;
}

export const messageType = MessageType.orderCancel;
const messageLength =
  InstrumentSize +
  OrderRefSize +
  TimestampSize;

export const orderCancelAsBuffer = (
  { orderRef, instrumentId, timestamp }: IOrderCancel,
  messageHeader: Partial<IMessageHeader> = {},
): Buffer => {
  const buffer = headerAsBuffer(
    { messageType, ...messageHeader },
    Buffer.alloc(messageLength + headerMessageLength),
  );

  let offset = 6;
  buffer.writeUInt16LE(instrumentId, offset);
  offset += InstrumentSize;

  buffer.writeUInt32LE(orderRef, offset);
  offset += OrderRefSize;

  buffer.writeBigUInt64LE(timestamp, offset);
  return buffer;
};

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

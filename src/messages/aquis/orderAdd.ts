import {
  Instrument,
  InstrumentSize,
  OrderRef,
  OrderRefSize,
  Price,
  PriceSize,
  Quantity,
  QuantitySize,
  Side,
  SideSize,
  Timestamp,
  TimestampSize,
} from "@archax/ace-market-data-lib";

import { headerAsBuffer, IMessageHeader, messageLength as headerMessageLength } from "./header";
import { MessageType } from "./types";

export interface IOrderAdd {
  orderRef: OrderRef;
  price: Price;
  quantity: Quantity;
  instrumentId: Instrument;
  side: Side;
  timestamp: Timestamp;
}

export const messageType = MessageType.orderAdd;
const messageLength = InstrumentSize + SideSize + QuantitySize + PriceSize + OrderRefSize + TimestampSize;

export const orderAddAsBuffer = (
  { orderRef, price, quantity, instrumentId, side, timestamp }: IOrderAdd,
  messageHeader: Partial<IMessageHeader> = {},
): Buffer => {
  const buffer = headerAsBuffer(
    { messageType, ...messageHeader },
    Buffer.alloc(messageLength + headerMessageLength),
  );

  let offset = 6;
  buffer.writeUInt16LE(instrumentId, offset);
  offset += InstrumentSize;
  
  buffer.writeUInt8(side, offset);
  offset += SideSize;
  
  buffer.writeUInt32LE(quantity, offset);
  offset += QuantitySize;
  
  buffer.writeBigUInt64LE(price, offset);
  offset += PriceSize;
  
  buffer.writeUInt32LE(orderRef, offset);
  offset += OrderRefSize;

  buffer.writeBigUInt64LE(timestamp, offset);
  return buffer;
};

/**
 * Get the orderAdd details as a JS object
 *
 * @param buffer
 */
export const orderAddAsObject = (buffer: Buffer): IOrderAdd => ({
  instrumentId: buffer.readUInt16LE(6),
  orderRef: buffer.readUInt32LE(21),
  price: buffer.readBigUInt64LE(13),
  quantity: buffer.readUInt32LE(9),
  side: buffer.readUInt8(8),
  timestamp: buffer.readBigUInt64LE(25),
});

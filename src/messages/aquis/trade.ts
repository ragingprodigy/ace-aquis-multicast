import {
  Instrument,
  InstrumentSize,
  OrderRef,
  OrderRefSize,
  Price,
  PriceSize,
  Quantity,
  QuantitySize,
  Timestamp,
  TimestampSize,
  TradeRef,
  TradeRefSize,
  TradeType,
  TradeTypeSize,
} from "@archax/ace-market-data-lib";

import { headerAsBuffer, IMessageHeader, messageLength as headerMessageLength } from "./header";
import { MessageType, TradeOptionsSize } from "./types";

export interface ITrade {
  options: number;
  orderRef: OrderRef;
  price: Price;
  quantity: Quantity;
  instrumentId: Instrument;
  timestamp: Timestamp;
  tradeRef: TradeRef;
  tradeType: TradeType;
}

export const messageType = MessageType.trade;
const messageLength = InstrumentSize + TradeRefSize + TradeTypeSize + QuantitySize + PriceSize + OrderRefSize + TimestampSize + TradeOptionsSize;

export const tradeAsBuffer = (
  { orderRef, price, quantity, instrumentId, timestamp, tradeType, tradeRef, options, }: ITrade,
  messageHeader: Partial<IMessageHeader> = {},
): Buffer => {
  const buffer = headerAsBuffer(
    { messageType, ...messageHeader },
    Buffer.alloc(messageLength + headerMessageLength),
  );

  let offset = 6;
  buffer.writeUInt16LE(instrumentId, offset);
  offset += InstrumentSize;

  buffer.writeUInt8(tradeType, offset);
  offset += TradeTypeSize;

  buffer.writeUInt32LE(quantity, offset);
  offset += QuantitySize;

  buffer.writeBigUInt64LE(price, offset);
  offset += PriceSize;

  buffer.writeUInt32LE(orderRef, offset);
  offset += OrderRefSize;

  buffer.writeUInt32LE(tradeRef, offset);
  offset += TradeRefSize;

  buffer.writeBigUInt64LE(timestamp, offset);
  offset += TimestampSize;

  buffer.writeUInt32LE(options, offset);

  return buffer;
};

/**
 * Get the trade details as a JS object
 *
 * @param buffer
 */
export const tradeAsObject = (buffer: Buffer): ITrade => ({
  instrumentId: buffer.readUInt16LE(6),
  // @todo Need to implement bitmask conversions
  // @see https://dev.to/somedood/bitmasks-a-very-esoteric-and-impractical-way-of-managing-booleans-1hlf
  options: buffer.readUInt32LE(37),

  orderRef: buffer.readUInt32LE(21),
  price: buffer.readBigUInt64LE(13),
  quantity: buffer.readUInt16LE(9),
  timestamp: buffer.readBigUInt64LE(29),
  tradeRef: buffer.readUInt32LE(25),
  tradeType: buffer.readUInt8(8),
});

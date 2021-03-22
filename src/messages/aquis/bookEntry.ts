import {
  Instrument,
  OrderRef,
  Price,
  Quantity,
  Side,
} from "@archax/ace-market-data-lib";

import { MessageType } from "./types";

export interface IBookEntry {
  orderRef: OrderRef;
  price: Price;
  quantity: Quantity;
  instrumentId: Instrument;
  side: Side;
}

export const messageType = MessageType.bookEntry;

/**
 * Get the bookEntry details as a JS object
 *
 * @param buffer
 */
export const bookEntryAsObject = (buffer: Buffer): IBookEntry => ({
  instrumentId: buffer.readUInt16LE(6),
  orderRef: buffer.readUInt32LE(21),
  price: buffer.readBigUInt64LE(13),
  quantity: buffer.readUInt16LE(9),
  side: buffer.readUInt8(8),
});

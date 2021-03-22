import {
  Instrument,
  MarketFlag,
  Price,
  Quantity,
  TradingStatus,
} from "@archax/ace-market-data-lib";

import { MessageType } from "./types";

export interface IBookStatus {
  closingBuyQty: Quantity;
  closingSellQty: Quantity;
  entries: number;
  indicativePrice: Price;
  marketFlags: MarketFlag;
  instrumentId: Instrument;
  tradingStatus: TradingStatus;
}

export const messageType = MessageType.bookStatus;

/**
 * Get the bookStatus details as a JS object
 *
 * @param buffer
 */
export const bookStatusAsObject = (buffer: Buffer): IBookStatus => ({
  closingBuyQty: buffer.readUInt32LE(12),
  closingSellQty: buffer.readUInt32LE(16),
  entries: buffer.readUInt16LE(10),
  indicativePrice: buffer.readBigUInt64LE(12),
  instrumentId: buffer.readUInt16LE(6),
  marketFlags: buffer.readUInt8(9),
  tradingStatus: buffer.readUInt8(8),
});

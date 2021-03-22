import {
  Instrument,
  InstrumentSize,
  MarketFlag,
  MarketFlagSize,
  Timestamp,
  TimestampSize,
  TradingStatus,
  TradingStatusSize,
} from "@archax/ace-market-data-lib";

import {
  headerAsBuffer,
  IMessageHeader,
  messageLength as headerMessageLength,
} from "./header";
import { MessageType } from "./types";

export interface ISecurityStatus {
  marketFlags: MarketFlag;
  instrumentId: Instrument;
  timestamp: Timestamp;
  tradingStatus: TradingStatus;
}

export const messageType = MessageType.securityStatus;

export const messageLength =
  InstrumentSize + TradingStatusSize + MarketFlagSize + TimestampSize;

/**
 * Get the security status as a buffer
 *
 * @param values
 * @param messageHeader
 */
export const securityStatusAsBuffer = (
  values: ISecurityStatus,
  messageHeader: Partial<IMessageHeader> = {},
): Buffer => {
  const buffer = headerAsBuffer(
    { messageType, ...messageHeader },
    Buffer.alloc(messageLength + headerMessageLength),
  );

  let offset = 6;
  buffer.writeUInt16LE(values.instrumentId, offset);
  offset += InstrumentSize;

  buffer.writeUInt8(values.tradingStatus, offset);
  offset += TradingStatusSize;

  buffer.writeUInt8(values.marketFlags, offset);
  offset += MarketFlagSize;

  buffer.writeBigUInt64LE(values.timestamp, offset);
  return buffer;
};

/**
 * Get the securityStatus details as a JS object
 *
 * @param buffer
 */
export const securityStatusAsObject = (buffer: Buffer): ISecurityStatus => ({
  instrumentId: buffer.readUInt16LE(6),
  marketFlags: buffer.readUInt8(9),
  timestamp: buffer.readBigUInt64LE(10),
  tradingStatus: buffer.readUInt8(8),
});

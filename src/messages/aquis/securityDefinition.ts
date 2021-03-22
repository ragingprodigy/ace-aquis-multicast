import { Instrument, InstrumentSize } from "@archax/ace-market-data-lib";

import { toString } from "../message";
import {
  headerAsBuffer,
  IMessageHeader,
  messageLength as headerMessageLength,
} from "./header";
import {
  CurrencySize,
  IsinSize,
  MessageType,
  MicSize,
  TickTableIdSize,
  UmtfSize,
} from "./types";

export interface ISecurityDefinition {
  currency: string;
  isin: string;
  mic: string;
  instrumentId: Instrument;
  tickTableId: number;
  umtf: string;
}

export const messageType = MessageType.securityDefinition;
export const messageLength =
  InstrumentSize +
  CurrencySize +
  IsinSize +
  MicSize +
  TickTableIdSize +
  UmtfSize;

export const securityDefinitionAsBuffer = (
  { currency, isin, mic, instrumentId, tickTableId, umtf }: ISecurityDefinition,
  messageHeader: Partial<IMessageHeader> = {},
): Buffer => {
  const buffer = headerAsBuffer(
    { messageType, ...messageHeader },
    Buffer.alloc(messageLength + headerMessageLength),
  );

  let offset = 6;
  buffer.writeUInt16LE(instrumentId, offset);
  offset += InstrumentSize;

  buffer.write(umtf, offset);
  offset += UmtfSize;

  buffer.write(isin, offset);
  offset += IsinSize;

  buffer.write(currency, offset);
  offset += CurrencySize;

  buffer.write(mic, offset);
  offset += MicSize;

  buffer.writeUInt8(tickTableId, offset);
  return buffer;
};

/**
 * Get the securityDefinition details as a JS object
 *
 * @param buffer
 */
export const securityDefinitionAsObject = (
  buffer: Buffer,
): ISecurityDefinition => ({
  currency: toString(buffer, 26, 3),
  instrumentId: buffer.readUInt16LE(6),
  isin: toString(buffer, 14, 12),
  mic: toString(buffer, 29, 4),
  tickTableId: buffer.readUInt8(33),
  umtf: toString(buffer, 8, 6),
});

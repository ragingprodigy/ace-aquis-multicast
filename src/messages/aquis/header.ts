import { MessageType } from "./types";

export interface IMessageHeader {
  length: number;
  messageType: MessageType;
  sequence: number;
}

let sequence = 0;

/**
 * Header message length
 */
export const messageLength = 6;

/**
 * Get the header as a buffer
 *
 * @param values
 * @param buffer
 */
export const headerAsBuffer = (
  values: Pick<IMessageHeader, "messageType"> & Partial<IMessageHeader>,
  buffer = Buffer.alloc(messageLength),
): Buffer => {
  buffer.writeUInt8(values.messageType, 0);
  buffer.writeUInt8(values.length || buffer.length, 1);
  buffer.writeUInt32LE(values.sequence || ++sequence, 2);
  return buffer;
};

/**
 * Parse the buffer and return the message header
 *
 * @param buffer
 */
export const headerAsObject = (buffer: Buffer): IMessageHeader => ({
  length: buffer.readUInt8(1),
  messageType: buffer.readUInt8(0),
  sequence: buffer.readUInt32LE(2),
});

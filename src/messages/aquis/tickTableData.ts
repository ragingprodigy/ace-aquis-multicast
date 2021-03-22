import { toString } from "../message";
import { headerAsBuffer } from "./header";
import { MessageType } from "./types";

export interface ITickTableData {
  name: string;
  threshold: bigint;
  tickSize: bigint;
  tickTableId: number;
}

export const messageType = MessageType.tickTableData;

/**
 * Get the tickTableData as a buffer
 *
 * @param values
 */
export const tickTableDataAsBuffer = (values: ITickTableData): Buffer => {
  const buffer = headerAsBuffer(
    { messageType: MessageType.tickTableData },
    Buffer.alloc(33),
  );

  buffer.writeUInt8(values.tickTableId, 6);
  buffer.write(values.name, 7, 10);
  buffer.writeBigInt64LE(values.threshold, 17);
  buffer.writeBigInt64LE(values.threshold, 25);
  
  return buffer;
};


/**
 * Get the tickTableData details as a JS object
 *
 * @param buffer
 */
export const tickTableDataAsObject = (buffer: Buffer): ITickTableData => ({
  name: toString(buffer, 7, 10),
  threshold: buffer.readBigUInt64LE(17),
  tickSize: buffer.readBigUInt64LE(25),
  tickTableId: buffer.readUInt8(6),
});

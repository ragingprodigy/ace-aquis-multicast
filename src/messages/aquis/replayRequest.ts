import { headerAsBuffer } from "./header";
import { MessageType } from "./types";

export interface IReplayRequest {
  beginSequence: number;
  endSequence: number;
}

export const messageType = MessageType.replayRequest;

/**
 * Get the replayRequest as a buffer
 *
 * @param values
 */
export const replayRequestAsBuffer = ({
  beginSequence,
  endSequence,
}: IReplayRequest): Buffer => {
  const buffer = headerAsBuffer({ messageType }, Buffer.alloc(14));
  buffer.writeUInt32LE(beginSequence, 6);
  buffer.writeUInt32LE(endSequence, 10);
  return buffer;
};

/**
 * Get the replayRequest details as a JS object
 *
 * @param buffer
 */
export const replayRequestAsObject = (buffer: Buffer): IReplayRequest => ({
  beginSequence: buffer.readUInt32LE(6),
  endSequence: buffer.readUInt32LE(10),
});

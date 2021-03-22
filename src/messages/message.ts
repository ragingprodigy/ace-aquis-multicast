/**
 * Helper for getting strings from the buffer. Handles terminating nulls.
 *
 * @param buffer
 * @param start
 * @param length
 */
export const toString = (
  buffer: Buffer,
  start: number,
  length: number,
): string =>
  // eslint-disable-next-line no-control-regex
  buffer.toString("ascii", start, start + length).split(/\x00/)[0];

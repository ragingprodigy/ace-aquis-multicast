import { toString } from "../message";
import { headerAsBuffer } from "./header";
import { MessageType } from "./types";

export interface ILogin {
  password: string;
  username: string;
}

export const messageType = MessageType.login;

/**
 * Get the login as a buffer
 *
 * @param values
 */
export const loginAsBuffer = (values: ILogin): Buffer => {
  const buffer = headerAsBuffer({ messageType }, Buffer.alloc(26));
  buffer.write(values.username, 6, 10);
  buffer.write(values.password, 16, 10);
  return buffer;
};

/**
 * Get the login details as a JS object
 *
 * @param buffer
 */
export const loginAsObject = (buffer: Buffer): ILogin => ({
  password: toString(buffer, 16, 10),
  username: toString(buffer, 6, 10),
});

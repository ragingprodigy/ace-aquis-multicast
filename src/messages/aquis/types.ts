export enum MessageType {
  heartBeat = 1,
  orderAdd = 2,
  orderCancel = 3,
  orderModify = 4,

  trade = 5,
  tradeBust = 6,

  tickTableData = 7,
  securityDefinition = 8,
  securityStatus = 9,

  snapshotStart = 10,
  bookStatus = 11,
  bookEntry = 12,

  login = 13,
  replayRequest = 14,
  replayResponse = 15,

  marketAtCloseUpdate = 16,
}

export type Umtf = string;
export const UmtfSize = 6;
export type Isin = string;
export const IsinSize = 12;
export type Currency = string;
export const CurrencySize = 3;
export type Mic = string;
export const MicSize = 4;
export type TickTableId = number;
export const TickTableIdSize = 6;
export type TradeOptions = number;
export const TradeOptionsSize = 4;

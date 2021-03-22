import { info } from "@archax/ace-lib/ops/log";
import { TradeType } from "@archax/ace-market-data-lib";

interface SentMessage {
  sequence: number;
  message: Buffer;
}

interface IOrder {
  orderRef: number;
  instrumentId: number;
}

let sequence = 0;
let tradeRef = 0;
let orders: IOrder[] = [];

let sentMessages: SentMessage[] = [];

export const nextOrderRef = (): number => orders.length + 1;

export const nextSequence = (): number => ++sequence;

export const nextTradeRef = (): number => ++tradeRef;

export const addOrderRef = (orderRef: IOrder): number => orders.push(orderRef);

export const registerMessage = ({ sequence, message }: SentMessage): number =>
  sentMessages.push({ message, sequence });

export const resetSequence = (): number => {
  sequence = 0;
  tradeRef = 0;
  orders = [];
  sentMessages = [];

  info("reset sequences", "src.sequencer");

  return sequence;
};

export const getOrderRef = (): IOrder | undefined =>
  orders[Math.floor(Math.random() * orders.length)];

export const getTradeType = (): TradeType =>
  [TradeType.mac, TradeType.hiddenOrderBook, TradeType.visibleOrderBook][
    Math.floor(Math.random() * 3)
  ];

export const getSnapshotMessages = (endAt: number): Buffer[] => {
  const lastIndex = sentMessages.findIndex((msg) => msg.sequence === endAt + 2);
  return sentMessages.slice(0, lastIndex).map(({ message }) => message);
};

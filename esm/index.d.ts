import { TXDAConnection, TXDAMessageHandlers } from "./types";
declare const initialize: (origin: string, handlers?: TXDAMessageHandlers) => Promise<TXDAConnection>;
export { initialize };

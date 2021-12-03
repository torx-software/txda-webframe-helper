import { PortWrapper, TXDAMessageHandlers } from "./types";
declare const initialize: (origin: string, handlers?: TXDAMessageHandlers) => Promise<PortWrapper>;
export { initialize };

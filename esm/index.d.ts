import { TXDAConnection, TXDAMessageHandlers } from "./types";
/**
 * Request a connection to the Torx Design-Analyze application that the current page is embedded in.
 * @param url The URL of the Torx Design-Analyze installation that the current page is embedded in. Used to ensure that only messages from the correct origin URL are accepted.
 * @param handlers Event handlers to execute when events are received from Torx Design-Analyze.
 */
declare const initialize: (url: string, handlers?: TXDAMessageHandlers) => Promise<TXDAConnection>;
export { initialize };

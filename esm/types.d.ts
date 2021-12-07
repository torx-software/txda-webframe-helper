export interface MetaData {
    user: Object;
    project: Object;
}
export interface Design {
    /** A unique UUIDv4 identifier for the design. */
    designId: string;
    /** The name of the design. */
    name: string;
    /** The SMILES of the design's structure. */
    smiles: string;
}
export declare type messageHandler = (event: MessageEvent) => void;
export declare type VoidFunction = () => void;
export declare type connectedHandler = VoidFunction;
export declare type disconnectedHandler = VoidFunction;
export declare type updateCurrentDesignHandler = (currentDesign: Design, metaData: MetaData) => void;
export interface TXDAMessageHandlers {
    /** An event handler that can accept any message from an {@link TXDAConnection._port}. This should not need to be used directly. */
    _message?: messageHandler;
    /** An event handler that is fired when the connection to Torx Design-Analyze is established. */
    onConnected?: connectedHandler;
    /** An event handler that is fired when the connection to Torx Design-Analyze is disconnected. */
    onDisconnected?: disconnectedHandler;
    /** An event handler that is fired when the current design is edited or changed in Torx Design-Analyze, or on request via {@link TXDAConnection.requestCurrentDesign}. */
    onUpdateCurrentDesign?: updateCurrentDesignHandler;
}
export interface TXDAConnection {
    /** A unique identifier for this connection. */
    id: string;
    /** The underlying {@link MessagePort} used to send and receive messages for this connection. This should not need to be used directly. */
    _port: MessagePort;
    /** Request the latest current design be dispatched. Current design data can be handled with {@link TXDAMessageHandlers.onUpdateCurrentDesign}. */
    requestCurrentDesign: () => void;
    /** Prevent messages being further sent or received on this connection. */
    disconnect: () => void;
}

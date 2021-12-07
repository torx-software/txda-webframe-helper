export interface MetaData {
    user: Object;
    project: Object;
}
export interface Design {
    designId: string;
    name: string;
    smiles: string;
}
export declare type messageHandler = (event: MessageEvent) => void;
export declare type connectedHandler = () => void;
export declare type disconnectedHandler = () => void;
export declare type updateCurrentDesignHandler = (currentDesign: Design, metaData: MetaData) => void;
export interface TXDAMessageHandlers {
    _message?: messageHandler;
    onConnected?: connectedHandler;
    onDisconnected?: disconnectedHandler;
    onUpdateCurrentDesign?: updateCurrentDesignHandler;
}
export interface TXDAConnection {
    id: string;
    port: MessagePort;
    requestCurrentDesign: () => void;
    disconnect: () => void;
}

interface MetaData {
    user: Object;
    project: Object;
}
interface Design {
    designId: string;
    name: string;
    smiles: string;
}
declare type messageHandler = (event: MessageEvent) => void;
declare type connectedHandler = () => void;
declare type disconnectedHandler = () => void;
declare type updateCurrentDesignHandler = (currentDesign: Design, metaData: MetaData) => void;
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
export {};

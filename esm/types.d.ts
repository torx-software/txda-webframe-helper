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
declare type connectionEstablishedHandler = () => void;
declare type updateCurrentDesignHandler = (currentDesign: Design, metaData: MetaData) => void;
export interface TXDAMessageHandlers {
    _message?: messageHandler;
    connectionEstablished?: connectionEstablishedHandler;
    updateCurrentDesign?: updateCurrentDesignHandler;
}
export interface TXDAConnection {
    id: string;
    port: MessagePort;
    requestCurrentDesign: () => void;
    disconnect: () => void;
}
export {};

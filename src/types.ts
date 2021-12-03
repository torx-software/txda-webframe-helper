interface MetaData {
  user: Object
  project: Object
}

interface Design {
  designId: string
  name: string
  smiles: string
}

type messageHandler = (event: MessageEvent) => void
type connectedHandler = () => void
type disconnectedHandler = () => void
type updateCurrentDesignHandler = (currentDesign: Design, metaData: MetaData) => void

export interface TXDAMessageHandlers {
  _message?: messageHandler
  onConnected?: connectedHandler
  onDisconnected?: disconnectedHandler
  onUpdateCurrentDesign?: updateCurrentDesignHandler
}

export interface TXDAConnection {
  id: string,
  port: MessagePort;
  requestCurrentDesign: () => void
  disconnect: () => void
}

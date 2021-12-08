export interface User {
  /** A unique UUIDv4 identifier for the user. */
  id: string
  /** The user's username (email address). */
  username: string
  /** The user's full name formatted with email address. */
  listName: string
}

export interface Project {
  /** A unique UUIDv4 identifier for the project. */
  id: string
  /** The name of the project. */
  name: string
}

export interface MetaData {
  user: User
  project: Project
}

export interface Design {
  /** A unique UUIDv4 identifier for the design. */
  designId: string
  /** The name of the design. */
  name: string
  /** The SMILES of the design's structure. */
  smiles: string
}

export interface DesignStructure extends Design {
  /** A 2D MOL block of the design. */
  molBlock2d: string
  /** A 3D MOL block of the design. */
  molBlock3d: string
}

export enum MessageType {
  txdaConnectionRequest = 'txdaConnectionRequest',
  txdaMessagePortTransfer = 'txdaMessagePortTransfer',
  txdaConnectionAcknowledgement = 'txdaConnectionAcknowledgement',

  txdaRequestCurrentDesign = 'txdaRequestCurrentDesign',
  txdaCurrentDesign = 'txdaCurrentDesign',

  txdaRequestCurrentDesignStructure = 'txdaRequestCurrentDesignStructure',
  txdaCurrentDesignStructure = 'txdaCurrentDesignStructure'
}

export interface Message<T> {
  messageType: MessageType,
  metaData: MetaData,
  data: T
}

export type MessageHandler = (event: MessageEvent) => void

/** A function that accepts no arguments and returns nothing. */
export type VoidFunction = () => void

export type MetaDataHandler = (metaData: MetaData) => void

export type ConnectedHandler = MetaDataHandler
export type DisconnectedHandler = VoidFunction
export type UpdateCurrentDesignHandler = (currentDesign: Design, metaData: MetaData) => void
export type UpdateCurrentDesignStructureHandler = (currentDesign: DesignStructure, metaData: MetaData) => void

export interface TXDAMessageHandlers {
  /** An event handler that can accept any message from an {@linkcode TXDAConnection._port}. This should not need to be used directly. */
  _message?: MessageHandler
  /** An event handler that is fired when the connection to Torx Design-Analyze is established. */
  onConnected?: ConnectedHandler
  /** An event handler that is fired when the connection to Torx Design-Analyze is disconnected. */
  onDisconnected?: DisconnectedHandler
  /** An event handler that is fired when the current design is edited or changed in Torx Design-Analyze, or on request via {@linkcode TXDAConnection.requestCurrentDesign}. */
  onUpdateCurrentDesign?: UpdateCurrentDesignHandler
  /** An event handler that is fired on request via {@linkcode TXDAConnection.requestCurrentDesignStructure}. */
  onUpdateCurrentDesignStructure?: UpdateCurrentDesignStructureHandler
}

export interface TXDAConnection {
  /** A unique identifier for this connection. */
  id: string,
  /** The underlying {@link MessagePort} used to send and receive messages for this connection. This should not need to be used directly. */
  _port: MessagePort;
  /** Request the latest current design be dispatched. Current design data can be handled with {@linkcode TXDAMessageHandlers.onUpdateCurrentDesign}. */
  requestCurrentDesign: () => void
  /**
   * Request the latest current design be dispatched with structure. This is more expensive to fetch than {@linkcode TXDAConnection.requestCurrentDesign},
   * therefore it is not automatically dispatched on design edits and changes, and must be requested with this method.
   *
   * Current design data with the 2D and 3D structure can be handled with {@linkcode TXDAMessageHandlers.onUpdateCurrentDesignStructure}
   */
  requestCurrentDesignStructure: () => void
  /** Prevent messages being further sent or received on this connection. */
  disconnect: () => void
}

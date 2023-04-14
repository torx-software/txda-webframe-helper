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

export interface KeyValueData {
  /** Arbitrary key:value pairs of data */
  [key: string]: string | number | boolean | null
}

export interface DesignData {
  /** All key:value data that is associated with the design */
  designKeyValueData: KeyValueData
  /** All key:value data that is associated with the current structure of a design */
  structureKeyValueData: KeyValueData
}

/** An array of unique UUIDv4 identifier for the selected designs. */
export type SelectedDesignIds = Array<string>

export enum MessageType {
  txdaConnectionRequest = 'txdaConnectionRequest',
  txdaMessagePortTransfer = 'txdaMessagePortTransfer',
  txdaConnectionAcknowledgement = 'txdaConnectionAcknowledgement',

  txdaRequestCurrentDesign = 'txdaRequestCurrentDesign',
  txdaCurrentDesign = 'txdaCurrentDesign',

  txdaRequestCurrentDesign3d = 'txdaRequestCurrentDesign3d',
  txdaCurrentDesign3d = 'txdaCurrentDesign3d',

  txdaRequestCurrentDesignData = 'txdaRequestCurrentDesignData',
  txdaCurrentDesignData = 'txdaCurrentDesignData',
  txdaAddCurrentDesignData = 'txdaAddCurrentDesignData',
  txdaAddCurrentStateData = 'txdaAddCurrentStateData',

  txdaSelectedDesignIds = 'txdaSelectedDesignIds'
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
export type UpdateCurrentDesign3dHandler = (currentDesign: DesignStructure, metaData: MetaData) => void
export type UpdateCurrentDesignDataHandler = (currentDesign: DesignData, metaData: MetaData) => void
export type UpdateSelectedDesignIdsHandler = (selectedDesignIds: SelectedDesignIds, metaData: MetaData) => void

export interface TXDAMessageHandlers {
  /** An event handler that can accept any message from an {@linkcode TXDAConnection._port}. This should not need to be used directly. */
  _message?: MessageHandler
  /** An event handler that is fired when the connection to Torx Design-Analyze is established. */
  onConnected?: ConnectedHandler
  /** An event handler that is fired when the connection to Torx Design-Analyze is disconnected. */
  onDisconnected?: DisconnectedHandler
  /** An event handler that is fired when the current design is edited or changed in Torx Design-Analyze, or on request via {@linkcode TXDAConnection.requestCurrentDesign}. */
  onUpdateCurrentDesign?: UpdateCurrentDesignHandler
  /** An event handler that is fired on request via {@linkcode TXDAConnection.requestCurrentDesign3d}. */
  onUpdateCurrentDesign3d?: UpdateCurrentDesign3dHandler
  /** An event handler that is fired on request for data via {@linkcode TXDAConnection.requestCurrentDesignData} */
  onUpdateCurrentDesignData?: UpdateCurrentDesignDataHandler
  /** An event handler that is fired when selecting designs in Data Table in Torx Design-Analyze */
  onUpdateSelectedDesignIds?: UpdateSelectedDesignIdsHandler
}

export interface TXDAConnection {
  /** The underlying `MessagePort` used to send and receive messages for this connection. This should not need to be used directly. */
  _port: MessagePort;
  /** Request the latest current design be dispatched. Current design data can be handled with {@linkcode TXDAMessageHandlers.onUpdateCurrentDesign}. */
  requestCurrentDesign: () => void
  /**
   * Request the latest current design be dispatched with its 3D structure (if any). This is more expensive to fetch than {@linkcode TXDAConnection.requestCurrentDesign},
   * therefore it is not automatically dispatched on design edits and changes, and must be requested with this method.
   *
   * Current design data with the 3D structure can be handled with {@linkcode TXDAMessageHandlers.onUpdateCurrentDesign3d}.
   */
  requestCurrentDesign3d: () => void
  /**
   * Request the data associated with the current design. This will be key:value pairs of data for the design and structure.
   *
   * Data is handled by {@linkcode TXDAMessageHandlers.onUpdateCurrentDesignData}
   */
  requestCurrentDesignData: () => void
  /**
   * Add arbitrary key:value data to the design. If the structure is modified later, design data will be kept.
   */
  addCurrentDesignData: (data: KeyValueData) => void
  /**
   * Add arbitrary key:value data to the specific structure of the design. If the structure is modified later, the data will no longer be shown.
   */
  addCurrentStructureData: (data: KeyValueData) => void
  /** Prevent messages being further sent or received on this connection. */
  disconnect: () => void
}

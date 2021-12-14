import { Design, DesignStructure, Message, TXDAMessageHandlers } from "./types"

export const attachHandlers = (port: MessagePort, handlers: TXDAMessageHandlers) => {
  if (handlers._message) {
    port.addEventListener('message', (portEvent: MessageEvent<Message<any>>) => {
      handlers._message?.(portEvent)
    })
  }

  if (handlers.onConnected) {
    port.addEventListener('message', (portEvent: MessageEvent<Message<undefined>>) => {
      if (portEvent.data?.messageType === 'txdaConnectionAcknowledgement') {
        handlers.onConnected?.(portEvent.data?.metaData)
      }
    })
  }

  if (handlers.onUpdateCurrentDesign) {
    port.addEventListener('message', (portEvent: MessageEvent<Message<Design>>) => {
      if (portEvent.data?.messageType === 'txdaCurrentDesign') {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data
        handlers.onUpdateCurrentDesign?.(currentDesign, metaData)
      }
    })
  }

  if (handlers.onUpdateCurrentDesign3d) {
    port.addEventListener('message', (portEvent: MessageEvent<Message<DesignStructure>>) => {
      if (portEvent.data?.messageType === 'txdaCurrentDesign3d') {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data
        handlers.onUpdateCurrentDesign3d?.(currentDesign, metaData)
      }
    })
  }
}

import { TXDAMessageHandlers } from "./types"

export const attachHandlers = (port: MessagePort, handlers: TXDAMessageHandlers) => {
  if (handlers._message) {
    port.addEventListener('message', portEvent => {
      handlers._message?.(portEvent)
    })
  }

  if (handlers.onConnected) {
    port.addEventListener('message', portEvent => {
      if (portEvent.data?.messageType === 'txdaConnectionAcknowledgement') {
        handlers.onConnected?.()
      }
    })
  }

  if (handlers.onUpdateCurrentDesign) {
    port.addEventListener('message', portEvent => {
      if (portEvent.data?.messageType === 'txdaCurrentDesign') {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data
        handlers.onUpdateCurrentDesign?.(currentDesign, metaData)
      }
    })
  }
}

import { TXDAMessageHandlers } from "./types"

export const attachHandlers = (port: MessagePort, handlers: TXDAMessageHandlers) => {
  if (handlers._message) {
    port.addEventListener('message', portEvent => {
      handlers._message?.(portEvent)
    })
  }

  if (handlers.connectionEstablished) {
    port.addEventListener('message', portEvent => {
      if (portEvent.data?.messageType === 'txdaConnectionAcknowledgement') {
        handlers.connectionEstablished?.()
      }
    })
  }

  if (handlers.updateCurrentDesign) {
    port.addEventListener('message', portEvent => {
      if (portEvent.data?.messageType === 'txdaCurrentDesign') {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data
        handlers.updateCurrentDesign?.(currentDesign, metaData)
      }
    })
  }
}

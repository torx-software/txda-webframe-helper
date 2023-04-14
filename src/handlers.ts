import { Design, DesignData, DesignStructure, Message, SelectedDesignIds, TXDAMessageHandlers } from "./types"

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

  if (handlers.onUpdateCurrentDesignData) {
    port.addEventListener('message', (portEvent: MessageEvent<Message<DesignData>>) => {
      if (portEvent.data?.messageType === 'txdaCurrentDesignData') {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data
        handlers.onUpdateCurrentDesignData?.(currentDesign, metaData)
      }
    })
  }

  if (handlers.onUpdateSelectedDesignIds) {
    port.addEventListener('message', (portEvent: MessageEvent<Message<SelectedDesignIds>>) => {
      if (portEvent.data?.messageType === 'txdaSelectedDesignIds') {
        const {
          metaData,
          data: selectedDesignIds
        } = portEvent.data
        handlers.onUpdateSelectedDesignIds?.(selectedDesignIds, metaData)
      }
    })
  }

}

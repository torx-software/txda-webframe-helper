import { PortWrapper, TXDAMessageHandlers } from "./types"

const initialize = (origin: string, handlers: TXDAMessageHandlers = {}): Promise<PortWrapper> =>
  new Promise((resolve, reject) => {
    if (origin === '*') {
      reject('Specific target origins must be specified to connect to TXDA installs')
    }

    // Listen for events from TXDA for initial setup of MessagePort
    window.addEventListener('message', windowEvent => {
      if (windowEvent.data?.messageType === 'txdaMessagePortTransfer') {
        if (windowEvent.origin !== origin) {
          reject('Attempted TXDA connection event from unauthorized origin')
        }

        const port = windowEvent.ports[0]

        port.addEventListener('message', e => console.log(e))

        // Add any given event handlers to the port
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

        port.start()
        port.postMessage({ messageType: 'txdaRequestCurrentDesign' })

        const portWrapper = {
          port,
          requestCurrentDesign: () => port.postMessage({
            messageType: 'txdaRequestCurrentDesign'
          })
        }

        resolve(portWrapper)
      }
    })

    window.parent.postMessage({
      messageType: 'txdaConnectionRequest',
      windowName: window.name,
    }, origin)

    // If there's no response from TXDA, reject
    setTimeout(() => {
      reject('Connection to TXDA failed (timed out)')
    }, 10000)
  })

export { initialize }

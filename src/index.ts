import { attachHandlers } from "./handlers"
import { PortWrapper, TXDAMessageHandlers } from "./types"

const initialize = (origin: string, handlers: TXDAMessageHandlers = {}): Promise<PortWrapper> =>
  new Promise((resolve, reject) => {
    if (origin === '*') {
      reject('Specific target origins must be specified to connect to TXDA installs')
      return
    }

    // Listen for events from TXDA for initial setup of MessagePort
    window.addEventListener('message', windowEvent => {
      if (windowEvent.data?.messageType === 'txdaMessagePortTransfer') {
        if (windowEvent.origin !== origin) {
          reject('Attempted TXDA connection event from unauthorized origin')
          return
        }

        const port = windowEvent.ports[0]

        // Add any given event handlers to the port
        attachHandlers(port, handlers)

        port.start()

        // Fire an initial request for the current design as soon as the port starts
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

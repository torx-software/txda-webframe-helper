import { v4 as uuidv4 } from 'uuid'

import { attachHandlers } from "./handlers"
import { TXDAConnection, TXDAMessageHandlers } from "./types"

/**
 * Request a connection to the Torx Design-Analyze application that the current page is embedded in.
 * @param url The URL of the Torx Design-Analyze installation that the current page is embedded in. Used to ensure that only messages from the correct origin URL are accepted.
 * @param handlers Event handlers to execute when events are received from Torx Design-Analyze.
 * @returns
 */
const initialize = (url: string, handlers: TXDAMessageHandlers = {}): Promise<TXDAConnection> =>
  new Promise((resolve, reject) => {
    const origin = new URL(url).origin

    if (origin === '*') {
      reject('Specific target origins must be specified to connect to TXDA installs')
      return
    }

    function handleWindowEvent (windowEvent: MessageEvent) {
      if (windowEvent.data?.messageType === 'txdaMessagePortTransfer') {
        // Ensure the origin of the message matches the specified URL's origin
        if (windowEvent.origin !== origin) {
          reject('Attempted TXDA connection event from unauthorized origin')
          return
        }

        // Ensure that the source of the event is the window embedding this one
        if (windowEvent.source !== window.parent) {
          reject('Attempted TXDA connection event from unauthorized source')
          return
        }

        const port = windowEvent.ports[0]

        // Add any given event handlers to the port
        attachHandlers(port, handlers)

        port.start()

        // Fire an initial request for the current design as soon as the port starts
        port.postMessage({ messageType: 'txdaRequestCurrentDesign' })

        const txdaConnection: TXDAConnection = {
          id: uuidv4(),
          _port: port,
          requestCurrentDesign: () => port.postMessage({
            messageType: 'txdaRequestCurrentDesign'
          }),
          requestCurrentDesignStructure: () => port.postMessage({
            messageType: 'txdaRequestCurrentDesignStructure'
          }),
          disconnect: () => {
            port.close()
            handlers.onDisconnected?.()
          }
        }

        resolve(txdaConnection)

        // After establishing the port, unhook this function from receiving further requests
        window.removeEventListener('message', handleWindowEvent)
      }
    }

    // Listen for events from TXDA for initial setup of MessagePort
    window.addEventListener('message', handleWindowEvent)

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

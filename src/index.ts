const initialize = (origin: string): Promise<MessagePort> =>
  new Promise((resolve, reject) => {
    if (origin === '*') {
      reject('Specific target origins must be specified to connect to TXDA installs')
    }

    // Listen for events from TXDA for initial setup of MessagePort
    window.addEventListener('message', event => {
      if (event.data?.messageType === 'txdaMessagePortTransfer') {
        if (event.origin !== origin) {
          reject('Attempted TXDA connection event from unauthorized origin')
        }

        const port = event.ports[0]
        resolve(port)
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

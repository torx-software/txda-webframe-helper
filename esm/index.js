// src/handlers.ts
var attachHandlers = (port, handlers) => {
  if (handlers._message) {
    port.addEventListener("message", (portEvent) => {
      handlers._message?.(portEvent);
    });
  }
  if (handlers.connectionEstablished) {
    port.addEventListener("message", (portEvent) => {
      if (portEvent.data?.messageType === "txdaConnectionAcknowledgement") {
        handlers.connectionEstablished?.();
      }
    });
  }
  if (handlers.updateCurrentDesign) {
    port.addEventListener("message", (portEvent) => {
      if (portEvent.data?.messageType === "txdaCurrentDesign") {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data;
        handlers.updateCurrentDesign?.(currentDesign, metaData);
      }
    });
  }
};

// src/index.ts
var initialize = (origin, handlers = {}) => new Promise((resolve, reject) => {
  if (origin === "*") {
    reject("Specific target origins must be specified to connect to TXDA installs");
    return;
  }
  window.addEventListener("message", (windowEvent) => {
    if (windowEvent.data?.messageType === "txdaMessagePortTransfer") {
      if (windowEvent.origin !== origin) {
        reject("Attempted TXDA connection event from unauthorized origin");
        return;
      }
      const port = windowEvent.ports[0];
      attachHandlers(port, handlers);
      port.start();
      port.postMessage({ messageType: "txdaRequestCurrentDesign" });
      const txdaConnection = {
        port,
        requestCurrentDesign: () => port.postMessage({
          messageType: "txdaRequestCurrentDesign"
        }),
        disconnect: () => port.close()
      };
      resolve(txdaConnection);
    }
  });
  window.parent.postMessage({
    messageType: "txdaConnectionRequest",
    windowName: window.name
  }, origin);
  setTimeout(() => {
    reject("Connection to TXDA failed (timed out)");
  }, 1e4);
});
export {
  initialize
};
//# sourceMappingURL=index.js.map

// src/handlers.ts
var attachHandlers = (port, handlers) => {
  if (handlers._message) {
    port.addEventListener("message", (portEvent) => {
      handlers._message?.(portEvent);
    });
  }
  if (handlers.onConnected) {
    port.addEventListener("message", (portEvent) => {
      if (portEvent.data?.messageType === "txdaConnectionAcknowledgement") {
        handlers.onConnected?.(portEvent.data?.metaData);
      }
    });
  }
  if (handlers.onUpdateCurrentDesign) {
    port.addEventListener("message", (portEvent) => {
      if (portEvent.data?.messageType === "txdaCurrentDesign") {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data;
        handlers.onUpdateCurrentDesign?.(currentDesign, metaData);
      }
    });
  }
  if (handlers.onUpdateCurrentDesign3d) {
    port.addEventListener("message", (portEvent) => {
      if (portEvent.data?.messageType === "txdaCurrentDesign3d") {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data;
        handlers.onUpdateCurrentDesign3d?.(currentDesign, metaData);
      }
    });
  }
  if (handlers.onUpdateCurrentDesignData) {
    port.addEventListener("message", (portEvent) => {
      if (portEvent.data?.messageType === "txdaCurrentDesignData") {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data;
        handlers.onUpdateCurrentDesignData?.(currentDesign, metaData);
      }
    });
  }
};

// src/index.ts
var initialize = (url, handlers = {}) => new Promise((resolve, reject) => {
  const origin = new URL(url).origin;
  if (origin === "*") {
    reject("Specific target origins must be specified to connect to TXDA installs");
    return;
  }
  const handleWindowEvent = (windowEvent) => {
    if (windowEvent.data?.messageType === "txdaMessagePortTransfer") {
      if (windowEvent.origin !== origin) {
        reject("Attempted TXDA connection event from unauthorized origin");
        return;
      }
      if (windowEvent.source !== window.parent) {
        reject("Attempted TXDA connection event from unauthorized source");
        return;
      }
      const port = windowEvent.ports[0];
      attachHandlers(port, handlers);
      port.start();
      port.postMessage({ messageType: "txdaRequestCurrentDesign" });
      const txdaConnection = {
        _port: port,
        requestCurrentDesign: () => port.postMessage({
          messageType: "txdaRequestCurrentDesign"
        }),
        requestCurrentDesign3d: () => port.postMessage({
          messageType: "txdaRequestCurrentDesign3d"
        }),
        requestCurrentDesignData: () => port.postMessage({
          messageType: "txdaRequestCurrentDesignData"
        }),
        addCurrentDesignData: (data) => port.postMessage({
          messageType: "txdaAddCurrentDesignData",
          data
        }),
        addCurrentStructureData: (data) => port.postMessage({
          messageType: "txdaAddCurrentStructureData",
          data
        }),
        disconnect: () => {
          port.close();
          handlers.onDisconnected?.();
        }
      };
      resolve(txdaConnection);
    }
  };
  window.addEventListener("message", handleWindowEvent, { once: true });
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

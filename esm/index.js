// node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/uuid/dist/esm-browser/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
var i;
function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
var stringify_default = stringify;

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default = v4;

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
  if (handlers.onUpdateCurrentDesignStructure) {
    port.addEventListener("message", (portEvent) => {
      if (portEvent.data?.messageType === "txdaCurrentDesignStructure") {
        const {
          metaData,
          data: currentDesign
        } = portEvent.data;
        handlers.onUpdateCurrentDesignStructure?.(currentDesign, metaData);
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
  function handleWindowEvent(windowEvent) {
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
        id: v4_default(),
        _port: port,
        requestCurrentDesign: () => port.postMessage({
          messageType: "txdaRequestCurrentDesign"
        }),
        requestCurrentDesignStructure: () => port.postMessage({
          messageType: "txdaRequestCurrentDesignStructure"
        }),
        disconnect: () => {
          port.close();
          handlers.onDisconnected?.();
        }
      };
      resolve(txdaConnection);
      window.removeEventListener("message", handleWindowEvent);
    }
  }
  window.addEventListener("message", handleWindowEvent);
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

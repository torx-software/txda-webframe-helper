# Torx Design-Analyze Webframe Helper

## Outline

Web pages and applications can be embedded within Torx Design-Analyze through a configurable `webframe` plugin.
Embedded applications can exchange data with Torx Design-Analyze through a secure messaging channel within the browser.
This helper library is designed to make it easy to connect an application embedded within a Torx Design-Analyze `webframe` to
the parent Torx Design-Analyze application, and exchange data between the applications.

## Usage

### Builds

There are two builds of the library available:

#### IIFE build

The IIFE build is in the `dist` folder of this repository, and can be included in a webpage in a `script` tag, loading `txda-webframe-helper.min.js`:

```html
<script src="path/to/txda-webframe-helper.min.js"></script>
```

As an alternative to hosting the script, it can be loaded from a CDN, for example:

```html
<script
  src="https://cdn.jsdelivr.net/gh/torx-software/txda-webframe-helper@d008f3c/dist/txda-webframe-helper.min.js"
  integrity="sha384-VnIm+ZAYynIkBZtkas1w0GoJ+A89rc+EiHh0N0StnH8xMFRhC5Mq+D/zbSWN0TOQ"
  crossorigin="anonymous"
></script>
```

The above example references a specific commit. To update to a new version, replace the `@d008f3c` with the version (commit, or release tag) that you wish to use. The [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) hash will need to be updated.

When loaded, the script provides a `window` global object `txdaWebframeHelper`. See [the section below](#establishing-a-connection-to-torx-design-analyze) for usage.

An example can be found in the source of the [demonstration page](https://github.com/torx-software/txda-webframe-helper/blob/master/demo/index.html).

#### ES module build

The ES module build is in the `esm` folder of this repository, and can be used when integrating with a bundled application using ES6+ modules. To use the ESM build, install the package from GitHub, replacing the `#commit-hash` at the end of the URI with the desired version:

NPM:

```
npm install --save git+https://github.com/torx-software/txda-webframe-helper.git#d008f3c
```

Yarn:

```shell
yarn add git+https://github.com/torx-software/txda-webframe-helper.git#d008f3c
```

Or the repository can be added directly to a `package.json`, followed by `npm install` or `yarn`:

```json
  "dependencies": {
    "txda-webframe-helper": "git+https://github.com/torx-software/txda-webframe-helper.git#d008f3c"
  }
```

The ES module build is shipped with TypeScript declaration files, which provides type safety if your project uses TypeScript, and autocompletion in TypeScript and JavaScript projects in supported text editors such as Visual Studio Code.

See [the section below](#establishing-a-connection-to-torx-design-analyze) for usage.

### Establishing a connection to Torx Design-Analyze

A single function, [`initialize`](https://torx-software.github.io/txda-webframe-helper/docs/modules/index.html#initialize), is provided to initiate a connection with Torx Design-Analyze:

- IIFE build: available as `window.txdaWebframeHelper.initialize`
- ES module build: importable with `import { initialize } from txda-webframe-helper/esm`

[`initialize`](https://torx-software.github.io/txda-webframe-helper/docs/modules/index.html#initialize) returns a `Promise` that resolves to a [`TXDAConnection`](https://torx-software.github.io/txda-webframe-helper/docs/interfaces/types.TXDAConnection.html) object. [`TXDAConnection`](https://torx-software.github.io/txda-webframe-helper/docs/interfaces/types.TXDAConnection.html) can be used to set up event listeners for incoming data, and call methods to send requests to Torx Design-Analyze. Full details of supported listeners and methods are available in the [documentation](https://torx-software.github.io/txda-webframe-helper/docs/interfaces/types.TXDAConnection.html). See the [example demonstration page](https://github.com/torx-software/txda-webframe-helper/blob/master/demo/index.html) for a worked example.

### Embedding in Torx Design-Analyze

To configure your application to be embedded in an `iframe` in Torx Design-Analyze, add a `webframe` plugin configuration in the Control Panel with the following configuration:

```json
{
  "url": "https://your-service.com",
  "messagingEnabled": true
}
```

#### Required security practices when embedding

- Services embedded in Torx Design-Analyze must be served over HTTPS, as this is a browser requirement to prevent loading [mixed active content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content). Depending on the browser, `localhost` may be an exception during development.
- Pages embedded in Torx Design-Analyze should have a [`frame-ancestors`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) Content Security Policy (CSP) header set to only allow embedding in the desired Torx Design-Analyze install. This header ensures that the page cannot be embedded in another page impersonating a Torx Design-Analyze install.

## Demo

A publicly available example page is available to show an example of integration. The source code for this example page is available [on GitHub](https://github.com/torx-software/txda-webframe-helper/blob/master/demo/index.html). No data are transferred outside of the example page, neverless use of this demonstration integration is not recommended or supported in use with production data and no security assumptions should be made when using it.

To configure in Torx Design-Analyze, add a `webframe` plugin configuration in the Control Panel with the following configuration:

```json
{
  "url": "https://torx-software.github.io/txda-webframe-helper",
  "messagingEnabled": true
}
```

## Documentation

Full TypeScript documentation for this helper library is available on [GitHub pages](https://torx-software.github.io/txda-webframe-helper/docs/).

## Notices

Copyright © 2021 Torx Software Ltd

# Torx Design-Analyze Webframe Helper

## Outline

Web pages and applications can be embedded within Torx Design-Analyze through a configurable `webframe` plugin.
Embedded applications can exchange data with Torx Design-Analyze through a secure messaging channel within the browser.
This helper library is designed to make it easy to connect an application embedded within a Torx Design-Analyze `webframe` to
the parent Torx Design-Analyze application, and exchange data between the applications.

## Usage

### Library

There are two builds of the library available:

- IIFE (in `dist`): for use in the browser in `script` tags
- ES module (in `esm`): when integrating with a bundled application using ES6+

### Embedded pages

To configure in Torx Design-Analyze, add a `webframe` plugin configuration in the Control Panel with the following configuration:

```json
{
  "url": "https://your-service.com",
  "enableMessaging": true
}
```

#### Required security practices when embedding

- Services embedded in Torx Design-Analyze must be served over HTTPS, as this is a browser requirement to prevent loading [mixed active content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content). Depending on the browser, `localhost` may be an exception during development.
- Pages embedded in Torx Design-Analyze should have a [`frame-ancestors`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) Content Security Policy (CSP) header set to only allow embedding in the desired Torx Design-Analyze install. This header ensures that the page cannot be embedded in another page impersonating a Torx Design-Analyze install.

## Demo

A publicly available example page is available to show an example of integration. The source code for this example page is available [on GitHub](https://github.com/torx-software/txda-webframe-helper/blob/master/demo/index.html). No data are transferred outside of the example page, neverless it is not recommended to be to used with production data.

To configure in Torx Design-Analyze, add a `webframe` plugin configuration in the Control Panel with the following configuration:

```json
{
  "url": "https://torx-software.github.io/txda-webframe-helper",
  "enableMessaging": true
}
```

## Documentation

Full TypeScript documentation for this helper library is available on [GitHub pages](https://torx-software.github.io/txda-webframe-helper/docs/).

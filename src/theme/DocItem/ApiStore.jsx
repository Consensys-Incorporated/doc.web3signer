import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { ungzip } from "pako";
import { createStoreWithState } from "@theme/ApiItem/store";

function decodeApi(api) {
  const binary = atob(api);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(ungzip(bytes)));
}

// The generated pages render theme components that read this store. ApiItem is
// the only thing that normally creates it, and using ApiItem as the doc layout
// drops the copy page button, so the store is created here instead.
function createApiStore(api) {
  let operation = api;
  if (typeof api === "string") {
    try {
      operation = decodeApi(api);
    } catch {
      operation = undefined;
    }
  }

  const responses = operation?.responses ?? {};
  const accept = Object.entries(responses)
    .filter(([code]) => /^2\d\d$/.test(code))
    .flatMap(([, content]) => Object.keys(content.content ?? {}));
  const contentTypes = Object.keys(operation?.requestBody?.content ?? {});

  return createStoreWithState(
    {
      accept: { value: accept[0], options: accept },
      contentType: { value: contentTypes[0], options: contentTypes },
      server: { value: undefined, options: operation?.servers ?? [] },
      response: { value: undefined },
      body: { type: "empty" },
      params: { path: [], query: [], header: [], cookie: [] },
      auth: { data: {}, options: {}, selected: undefined },
      schemaSelection: { selections: {} },
      encodingSelection: {},
    },
    [],
  );
}

export default function ApiStore({ api, children }) {
  const store = useMemo(() => createApiStore(api), [api]);
  return <Provider store={store}>{children}</Provider>;
}

import React, { useMemo } from "react";
import { Provider } from "react-redux";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { ungzip } from "pako";
import { createStoreWithState } from "@theme/ApiItem/store";
import RequestSamples, {
  paramsFromOperation,
  rawBody,
  requestExamples,
} from "./RequestSamples";
import ResponseSamples from "./ResponseSamples";

function decodeApi(api) {
  const binary = atob(api);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(ungzip(bytes)));
}

// The generated pages render theme components that read this store. ApiItem is
// the only thing that normally creates it, and using ApiItem as the doc layout
// drops the copy page button, so the store is created here instead.
function decodeOperation(api) {
  if (typeof api !== "string") {
    return api;
  }
  try {
    return decodeApi(api);
  } catch {
    return undefined;
  }
}

// Default Web3Signer listen address. The first spec server is an empty URL so
// the operation heading stays a path. Code samples use this host instead.
const SAMPLE_SERVER = "http://localhost:9000";

function sampleServer(servers) {
  const match = servers.find(
    (entry) => entry?.url?.replace(/\/$/, "") === SAMPLE_SERVER,
  );
  return match ? { ...match, url: SAMPLE_SERVER } : { url: SAMPLE_SERVER };
}

function createApiStore(operation, server) {
  const responses = operation?.responses ?? {};
  const accept = Object.entries(responses)
    .filter(([code]) => /^2\d\d$/.test(code))
    .flatMap(([, content]) => Object.keys(content.content ?? {}));
  const contentTypes = Object.keys(operation?.requestBody?.content ?? {});
  const servers = operation?.servers ?? [];

  return createStoreWithState(
    {
      accept: { value: accept[0], options: accept },
      contentType: { value: contentTypes[0], options: contentTypes },
      server: { value: server ?? servers[0], options: servers },
      response: { value: undefined },
      body: rawBody(requestExamples(operation)[0]?.text),
      params: paramsFromOperation(operation),
      auth: { data: {}, options: {}, selected: undefined },
      schemaSelection: { selections: {} },
      encodingSelection: {},
    },
    [],
  );
}

export default function ApiStore({ api, children }) {
  const operation = useMemo(() => decodeOperation(api), [api]);
  const store = useMemo(() => createApiStore(operation), [operation]);
  const sampleStore = useMemo(
    () => createApiStore(operation, sampleServer(operation?.servers ?? [])),
    [operation],
  );
  return (
    <Provider store={store}>
      <div className="row theme-api-markdown">
        <div className="col col--7 openapi-left-panel__container">
          {children}
        </div>
        <div className="col col--5 openapi-right-panel__container">
          <BrowserOnly>
            {() => (
              <Provider store={sampleStore}>
                <RequestSamples operation={operation} />
              </Provider>
            )}
          </BrowserOnly>
          <ResponseSamples responses={operation?.responses} />
        </div>
      </div>
    </Provider>
  );
}

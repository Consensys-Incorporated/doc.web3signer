import React, { useState } from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Heading from "@theme/Heading";
import CodeSnippets from "@theme/ApiExplorer/CodeSnippets";
import { setStringRawBody } from "@theme/ApiExplorer/Body/slice";
import { useTypedDispatch } from "@theme/ApiItem/hooks";
import { sampleFromSchema } from "docusaurus-plugin-openapi-docs/lib/openapi/createSchemaExample";
import * as sdk from "postman-collection";

function toJson(value) {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

function paramValue(param) {
  const named =
    param.examples && typeof param.examples === "object"
      ? Object.values(param.examples)[0]?.value
      : undefined;
  return (
    param.schema?.default ?? param.example ?? param.schema?.example ?? named
  );
}

export function paramsFromOperation(operation) {
  const params = { path: [], query: [], header: [], cookie: [] };
  for (const param of operation?.parameters ?? []) {
    const bucket = params[param.in];
    if (!bucket) {
      continue;
    }
    const value = paramValue(param);
    bucket.push(value === undefined ? param : { ...param, value });
  }
  return params;
}

// Named examples from the request body, then a single example, then a sample
// built from the schema. The code sample uses these; the request schema does not.
export function requestExamples(operation) {
  const content = operation?.requestBody?.content ?? {};
  const media = content[Object.keys(content)[0]];
  if (!media) {
    return [];
  }
  if (media.examples) {
    return Object.entries(media.examples).flatMap(([label, example]) => {
      const text = toJson(example?.value ?? example);
      return text ? [{ label, text }] : [];
    });
  }
  if (media.example !== undefined) {
    const text = toJson(media.example);
    return text ? [{ label: "Example", text }] : [];
  }
  if (!media.schema) {
    return [];
  }
  try {
    const sample = sampleFromSchema(media.schema, { type: "request" });
    const text = toJson(sample);
    return text ? [{ label: "Example", text }] : [];
  } catch {
    return [];
  }
}

export function rawBody(text) {
  if (!text) {
    return { type: "empty" };
  }
  return { type: "raw", content: { type: "string", value: text } };
}

function toPostmanRequest(postman) {
  if (!postman) {
    return new sdk.Request({});
  }
  if (sdk.Request.isRequest(postman)) {
    return new sdk.Request(postman.toJSON());
  }
  return new sdk.Request(postman);
}

export default function RequestSamples({ operation }) {
  const { frontMatter } = useDoc();
  const dispatch = useTypedDispatch();
  const examples = requestExamples(operation);
  const [label, setLabel] = useState(examples[0]?.label);

  if (!operation || operation.method === "event") {
    return null;
  }

  const snippets = (
    <CodeSnippets
      postman={toPostmanRequest(operation.postman)}
      codeSamples={operation["x-codeSamples"] ?? []}
      maskCredentials={frontMatter.mask_credentials}
      requestBody={operation.requestBody}
    />
  );

  const samples =
    examples.length < 2 ? (
      snippets
    ) : (
      <div className="openapi-request-samples">
        <label className="openapi-request-example">
          <span>Example</span>
          <select
            value={label}
            onChange={(event) => {
              const next = examples.find(
                (example) => example.label === event.target.value,
              );
              setLabel(event.target.value);
              if (next) {
                dispatch(setStringRawBody(next.text));
              }
            }}>
            {examples.map((example) => (
              <option key={example.label} value={example.label}>
                {example.label}
              </option>
            ))}
          </select>
        </label>
        {snippets}
      </div>
    );

  return (
    <div>
      <Heading
        as="h2"
        id="request-example"
        className="openapi-tabs__heading openapi-request-example-heading">
        Request example
      </Heading>
      {samples}
    </div>
  );
}

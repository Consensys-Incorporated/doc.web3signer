import React, { useState } from "react";
import ApiTabs from "@theme/ApiTabs";
import TabItem from "@theme/TabItem";
import ApiCodeBlock from "@theme/ApiExplorer/ApiCodeBlock";
import { sampleResponseFromSchema } from "docusaurus-plugin-openapi-docs/lib/openapi/createResponseExample";
import { useResponseCodeGroup } from "../responseCodeGroup";

function exampleFromMedia(media) {
  if (!media) {
    return undefined;
  }
  if (media.example !== undefined) {
    return media.example;
  }
  if (media.examples) {
    const first = Object.values(media.examples)[0];
    if (first && typeof first === "object" && "value" in first) {
      return first.value;
    }
    return first;
  }
  if (media.schema) {
    try {
      return sampleResponseFromSchema(media.schema);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function toText(value) {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value, null, 2);
}

function languageFor(mimeType) {
  if (mimeType.includes("json")) {
    return "json";
  }
  if (mimeType.includes("xml")) {
    return "xml";
  }
  return "text";
}

function samplesFor(response) {
  return Object.entries(response?.content ?? {}).flatMap(
    ([mimeType, media]) => {
      const text = toText(exampleFromMedia(media));
      if (!text) {
        return [];
      }
      return [{ mimeType, text, language: languageFor(mimeType) }];
    },
  );
}

function ResponseSample({ samples }) {
  const [mimeType, setMimeType] = useState(samples[0].mimeType);
  const sample =
    samples.find((item) => item.mimeType === mimeType) ?? samples[0];

  return (
    <div className="openapi-tabs__code-container">
      {samples.length > 1 && (
        <label className="openapi-response-content-type">
          <span>Content type</span>
          <select
            value={sample.mimeType}
            onChange={(event) => setMimeType(event.target.value)}>
            {samples.map((item) => (
              <option key={item.mimeType} value={item.mimeType}>
                {item.mimeType}
              </option>
            ))}
          </select>
        </label>
      )}
      <ApiCodeBlock
        language={sample.language}
        className="openapi-explorer__code-block"
        showLineNumbers>
        {sample.text}
      </ApiCodeBlock>
    </div>
  );
}

export default function ResponseSamples({ responses }) {
  const responseCodeGroup = useResponseCodeGroup();
  const codes = Object.entries(responses ?? {}).flatMap(([code, response]) => {
    const samples = samplesFor(response);
    return samples.length > 0 ? [{ code, samples }] : [];
  });

  if (codes.length === 0) {
    return null;
  }

  return (
    <ApiTabs
      label="Response example"
      id="response-samples"
      groupId={responseCodeGroup}>
      {codes.map(({ code, samples }) => (
        <TabItem key={code} label={code} value={code}>
          <ResponseSample samples={samples} />
        </TabItem>
      ))}
    </ApiTabs>
  );
}

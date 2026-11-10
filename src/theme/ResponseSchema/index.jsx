import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { translate } from "@docusaurus/Translate";
import Details from "@theme/Details";
import Markdown from "@theme/Markdown";
import MimeTabs from "@theme/MimeTabs";
import SchemaNode from "@theme/Schema";
import SchemaExpansionControl from "@theme/SchemaExpansion";
import SkeletonLoader from "@theme/SkeletonLoader";
import TabItem from "@theme/TabItem";

// Schema only. Response examples render in the right-hand panel instead of as
// a second tab here, so a response is not described twice.
function ResponseSchemaComponent({ title, body, style }) {
  if (
    body === undefined ||
    body.content === undefined ||
    Object.keys(body).length === 0 ||
    Object.keys(body.content).length === 0
  ) {
    return null;
  }

  const mimeTypes = Object.keys(body.content);
  if (!mimeTypes.length) {
    return null;
  }

  return (
    <MimeTabs className="openapi-tabs__mime" schemaType="response">
      {mimeTypes.map((mimeType) => {
        const firstBody = body.content?.[mimeType]?.schema;
        if (
          !firstBody ||
          (firstBody.properties &&
            Object.keys(firstBody.properties).length === 0)
        ) {
          return (
            <TabItem key={mimeType} label={mimeType} value={mimeType}>
              <div>
                {translate({
                  id: "theme.openapi.schema.noSchema",
                  message: "No schema",
                })}
              </div>
            </TabItem>
          );
        }

        return (
          <TabItem key={mimeType} label={mimeType} value={mimeType}>
            <Details
              className="openapi-markdown__details response"
              data-collapsed={false}
              open={true}
              style={style}
              summary={
                <summary className="openapi-markdown__details-summary--with-control">
                  <strong className="openapi-markdown__details-summary-response">
                    {title}
                    {body.required === true && (
                      <span className="openapi-schema__required">
                        {translate({
                          id: "theme.openapi.schemaItem.required",
                          message: "required",
                        })}
                      </span>
                    )}
                  </strong>
                  <SchemaExpansionControl />
                </summary>
              }>
              <div style={{ textAlign: "left", marginLeft: "1rem" }}>
                {body.description && (
                  <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <Markdown>{body.description}</Markdown>
                  </div>
                )}
              </div>
              <ul style={{ marginLeft: "1rem" }}>
                <SchemaNode schema={firstBody} schemaType="response" />
              </ul>
            </Details>
          </TabItem>
        );
      })}
    </MimeTabs>
  );
}

export default function ResponseSchema(props) {
  return (
    <BrowserOnly fallback={<SkeletonLoader size="md" />}>
      {() => <ResponseSchemaComponent {...props} />}
    </BrowserOnly>
  );
}

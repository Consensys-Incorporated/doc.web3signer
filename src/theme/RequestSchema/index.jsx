import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { translate } from "@docusaurus/Translate";
import Details from "@theme/Details";
import Heading from "@theme/Heading";
import Markdown from "@theme/Markdown";
import MimeTabs from "@theme/MimeTabs";
import SchemaNode from "@theme/Schema";
import SchemaExpansionControl from "@theme/SchemaExpansion";
import SkeletonLoader from "@theme/SkeletonLoader";
import TabItem from "@theme/TabItem";

function isJson(mimeType) {
  return (
    mimeType === "application/json" ||
    mimeType.startsWith("application/json;") ||
    mimeType.endsWith("+json")
  );
}

function RequestBody({ title, body, schema, style }) {
  return (
    <Details
      className="openapi-markdown__details mime"
      data-collapsed={false}
      open={true}
      style={style}
      summary={
        <summary className="openapi-markdown__details-summary--with-control">
          <Heading
            as="h3"
            className="openapi-markdown__details-summary-header-body">
            {title}
            {schema.type === "array" && (
              <span style={{ opacity: "0.6" }}> array</span>
            )}
            {body.required && (
              <strong className="openapi-schema__required">
                {translate({
                  id: "theme.openapi.schemaItem.required",
                  message: "required",
                })}
              </strong>
            )}
          </Heading>
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
        <SchemaNode
          schema={schema}
          schemaType="request"
          schemaPath="requestBody"
        />
      </ul>
    </Details>
  );
}

function RequestSchemaComponent({ title, body, style }) {
  if (!body?.content || Object.keys(body.content).length === 0) {
    return null;
  }

  const mimeTypes = Object.keys(body.content);
  if (mimeTypes.length === 1 && isJson(mimeTypes[0])) {
    const mimeType = mimeTypes[0];
    const media = body.content[mimeType];
    if (!media?.schema) {
      return null;
    }
    return (
      <RequestBody
        title={title}
        body={body}
        schema={media.schema}
        style={style}
      />
    );
  }

  return (
    <MimeTabs className="openapi-tabs__mime" schemaType="request" lazy>
      {mimeTypes.map((mimeType) => {
        const media = body.content[mimeType];
        const schema = media?.schema;
        if (
          !schema ||
          (schema.properties && Object.keys(schema.properties).length === 0)
        ) {
          return null;
        }
        return (
          <TabItem key={mimeType} label={mimeType} value={mimeType}>
            <div style={{ marginTop: "1rem" }}>
              <RequestBody
                title={title}
                body={body}
                schema={schema}
                style={style}
              />
            </div>
          </TabItem>
        );
      })}
    </MimeTabs>
  );
}

export default function RequestSchema(props) {
  return (
    <BrowserOnly fallback={<SkeletonLoader size="sm" />}>
      {() => <RequestSchemaComponent {...props} />}
    </BrowserOnly>
  );
}

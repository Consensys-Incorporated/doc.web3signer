/**
 * Copyright (c) Palo Alto Networks
 *
 * Swizzled from docusaurus-theme-openapi-docs StatusCodes.
 * Adds the shared response-code tab group. See responseCodeGroup.js.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { translate } from "@docusaurus/Translate";
import ApiTabs from "@theme/ApiTabs";
import Details from "@theme/Details";
import Markdown from "@theme/Markdown";
import ResponseHeaders from "@theme/ResponseHeaders";
import ResponseSchema from "@theme/ResponseSchema";
import TabItem from "@theme/TabItem";
import { useResponseCodeGroup } from "../responseCodeGroup";

export default function StatusCodes({ label, id, responses }) {
  const responseCodeGroup = useResponseCodeGroup();
  if (!responses) {
    return null;
  }

  const codes = Object.keys(responses);
  if (codes.length === 0) {
    return null;
  }

  return (
    <ApiTabs label={label} id={id} groupId={responseCodeGroup}>
      {codes.map((code) => {
        const response = responses[code];
        const responseHeaders = response.headers;

        return (
          <TabItem key={code} label={code} value={code}>
            <div>
              {response.description && (
                <div style={{ marginTop: ".5rem", marginBottom: ".5rem" }}>
                  <Markdown>{response.description}</Markdown>
                </div>
              )}
            </div>
            {responseHeaders && (
              <Details
                className="openapi-markdown__details"
                data-collapsed={true}
                open={false}
                style={{ textAlign: "left", marginBottom: "1rem" }}
                summary={
                  <summary>
                    <strong>
                      {translate({
                        id: "theme.openapi.statusCodes.responseHeaders",
                        message: "Response Headers",
                      })}
                    </strong>
                  </summary>
                }>
                <ResponseHeaders responseHeaders={responseHeaders} />
              </Details>
            )}
            <ResponseSchema
              title={translate({
                id: "theme.openapi.statusCodes.schemaTitle",
                message: "Schema",
              })}
              body={{ content: response.content }}
            />
          </TabItem>
        );
      })}
    </ApiTabs>
  );
}

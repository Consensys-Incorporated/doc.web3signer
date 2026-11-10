import React, { createContext, useContext } from "react";

// Fallback when a response tab renders outside an operation page.
const DEFAULT_RESPONSE_CODE_GROUP = "response-code";

const ResponseCodeGroupContext = createContext(DEFAULT_RESPONSE_CODE_GROUP);

// One group per operation, shared by the Responses list and the Response
// example panel. A different operation gets its own group, so the choice
// does not carry over.
export function ResponseCodeGroupProvider({ operationId, children }) {
  const groupId = operationId
    ? `response-code-${operationId}`
    : DEFAULT_RESPONSE_CODE_GROUP;
  return (
    <ResponseCodeGroupContext.Provider value={groupId}>
      {children}
    </ResponseCodeGroupContext.Provider>
  );
}

export function useResponseCodeGroup() {
  return useContext(ResponseCodeGroupContext);
}

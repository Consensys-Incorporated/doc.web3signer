#!/usr/bin/env node
/**
 * Render one generated OpenAPI operation as Markdown.
 *
 * The page source stores the operation as a compressed blob in the `api`
 * frontmatter. This reads that blob. It does not render the MDX component shell.
 */

const zlib = require("zlib");

const AGENT_DIRECTIVE =
  "> For AI agents: a documentation index is available at " +
  "[/llms.txt](/llms.txt). " +
  "Append `.md` to any documentation URL to get the markdown source.\n\n";

function decodeOperation(apiValue) {
  const bytes = Buffer.from(apiValue, "base64");
  let decoded;
  try {
    decoded = zlib.inflateSync(bytes);
  } catch {
    decoded = zlib.gunzipSync(bytes);
  }
  return JSON.parse(decoded.toString("utf8"));
}

function frontMatterBlock(content) {
  if (!(content.startsWith("---\n") || content.startsWith("---\r\n"))) {
    return "";
  }
  const closing = content.indexOf("\n---\n", 3);
  if (closing === -1) {
    return "";
  }
  return content.slice(0, closing);
}

function frontMatterValue(content, key) {
  const block = frontMatterBlock(content);
  const match = block.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
  if (!match) {
    return undefined;
  }
  return match[1].trim().replace(/^["']|["']$/g, "");
}

function readOperationFile(content) {
  const apiValue = frontMatterValue(content, "api");
  if (!apiValue) {
    return undefined;
  }
  return {
    id: frontMatterValue(content, "id"),
    title: frontMatterValue(content, "title"),
    description: frontMatterValue(content, "description"),
    operation: decodeOperation(apiValue),
  };
}

function oneLine(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function jsonText(value) {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

function fence(language, value) {
  const text = typeof value === "string" ? value : jsonText(value);
  return `\`\`\`${language}\n${text.replace(/\n$/, "")}\n\`\`\``;
}

function languageFor(mimeType, value) {
  if (
    mimeType.includes("json") ||
    (value !== null && typeof value === "object")
  ) {
    return "json";
  }
  if (mimeType.includes("xml")) {
    return "xml";
  }
  return "text";
}

function paramExample(param) {
  const named =
    param.examples && typeof param.examples === "object"
      ? Object.values(param.examples)[0]?.value
      : undefined;
  return (
    param.schema?.default ?? param.example ?? param.schema?.example ?? named
  );
}

function typeLabel(schema) {
  if (!schema) {
    return "value";
  }
  if (Array.isArray(schema.enum)) {
    return schema.enum.map(String).join(" \\| ");
  }
  if (schema.type === "array") {
    const item = schema.items?.properties ? "object" : typeLabel(schema.items);
    return `array of ${item}`;
  }
  if (schema.type) {
    return schema.format ? `${schema.type} (${schema.format})` : schema.type;
  }
  if (schema.oneOf || schema.discriminator || schema.allOf) {
    return "object";
  }
  return "value";
}

function exampleFromSchema(schema) {
  if (!schema || typeof schema !== "object") {
    return undefined;
  }
  if (schema.example !== undefined) {
    return schema.example;
  }
  if (Array.isArray(schema.examples) && schema.examples.length > 0) {
    return schema.examples[0];
  }
  if (schema.properties) {
    const result = {};
    for (const [name, property] of Object.entries(schema.properties)) {
      const value = exampleFromSchema(property);
      if (value !== undefined) {
        result[name] = value;
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }
  return undefined;
}

function nestedSchema(property) {
  if (!property || typeof property !== "object") {
    return undefined;
  }
  if (property.properties || property.allOf || property.oneOf) {
    return property;
  }
  const items = property.type === "array" ? property.items : undefined;
  if (items && (items.properties || items.allOf || items.oneOf)) {
    return items;
  }
  return undefined;
}

function schemaLines(schema, depth) {
  if (!schema || depth > 12) {
    return [];
  }
  const lines = [];
  if (schema.properties) {
    const required = new Set(schema.required ?? []);
    lines.push(
      ...Object.entries(schema.properties).flatMap(([name, property]) => {
        const flags = required.has(name) ? ", required" : "";
        const description = property.description
          ? `: ${oneLine(property.description)}`
          : "";
        const example =
          property.example !== undefined
            ? ` Example: \`${oneLine(jsonText(property.example))}\`.`
            : "";
        const line = `- \`${name}\` (${typeLabel(property)}${flags})${description}${example}`;
        const nested = nestedSchema(property);
        const nestedLines = nested
          ? schemaLines(nested, depth + 1).map((item) => `  ${item}`)
          : [];
        return [line, ...nestedLines];
      }),
    );
  }
  if (Array.isArray(schema.allOf)) {
    lines.push(...schema.allOf.flatMap((part) => schemaLines(part, depth)));
  }
  if (Array.isArray(schema.oneOf)) {
    const selector = schema.discriminator?.propertyName;
    if (lines.length === 0) {
      lines.push(
        selector
          ? `One of the following, selected by \`${selector}\`:`
          : "One of the following:",
      );
    }
    for (const item of schema.oneOf) {
      const title = item.title || "Variant";
      const description = item.description
        ? `: ${oneLine(item.description)}`
        : "";
      lines.push(`- **${title}**${description}`);
      lines.push(...schemaLines(item, depth + 1).map((field) => `  ${field}`));
    }
  }
  return lines;
}

function mediaExample(media) {
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
  return exampleFromSchema(media.schema);
}

function namedExamples(media) {
  if (media?.examples) {
    return Object.entries(media.examples).flatMap(([label, example]) => {
      const value = example?.value ?? example;
      return value === undefined ? [] : [{ label, value }];
    });
  }
  const value = mediaExample(media);
  return value === undefined ? [] : [{ label: "Example", value }];
}

function renderParameters(parameters) {
  const groups = [
    ["path", "Path parameters"],
    ["query", "Query parameters"],
    ["header", "Header parameters"],
    ["cookie", "Cookie parameters"],
  ];
  const sections = [];
  for (const [location, heading] of groups) {
    const params = (parameters ?? []).filter((param) => param.in === location);
    if (params.length === 0) {
      continue;
    }
    const lines = params.map((param) => {
      const required = param.required ? ", required" : "";
      const description = param.description
        ? `: ${oneLine(param.description)}`
        : "";
      const exampleValue = paramExample(param);
      const example =
        exampleValue !== undefined
          ? ` Example: \`${oneLine(jsonText(exampleValue))}\`.`
          : "";
      return `- \`${param.name}\` (${typeLabel(param.schema)}${required})${description}${example}`;
    });
    sections.push(`### ${heading}\n\n${lines.join("\n")}`);
  }
  return sections.length === 0
    ? ""
    : `## Parameters\n\n${sections.join("\n\n")}\n`;
}

function renderRequest(requestBody) {
  const content = requestBody?.content ?? {};
  const types = Object.keys(content);
  if (types.length === 0) {
    return "";
  }
  const blocks = ["## Request\n"];
  if (requestBody.description) {
    blocks.push(requestBody.description.trim());
  }
  if (requestBody.required) {
    blocks.push("Required.");
  }
  for (const mimeType of types) {
    const media = content[mimeType];
    blocks.push(`Content type: \`${mimeType}\``);
    const fields = schemaLines(media.schema, 0);
    if (fields.length > 0) {
      blocks.push(`### Schema\n\n${fields.join("\n")}`);
    }
    const examples = namedExamples(media);
    if (examples.length > 0) {
      const rendered = examples
        .map(
          (example) =>
            `### ${example.label}\n\n${fence(languageFor(mimeType, example.value), jsonText(example.value))}`,
        )
        .join("\n\n");
      blocks.push(rendered);
    }
  }
  return `${blocks.join("\n\n")}\n`;
}

function renderResponses(responses) {
  const entries = Object.entries(responses ?? {});
  if (entries.length === 0) {
    return "";
  }
  const blocks = ["## Responses\n"];
  for (const [code, response] of entries) {
    const parts = [`### ${code}\n`];
    if (response.description) {
      parts.push(oneLine(response.description));
    }
    for (const [mimeType, media] of Object.entries(response.content ?? {})) {
      const fields = schemaLines(media.schema, 0);
      const sample = mediaExample(media);
      parts.push(`#### ${mimeType}`);
      if (fields.length > 0) {
        parts.push(fields.join("\n"));
      }
      if (sample !== undefined) {
        parts.push(fence(languageFor(mimeType, sample), jsonText(sample)));
      }
    }
    blocks.push(parts.join("\n\n"));
  }
  return `${blocks.join("\n\n")}\n`;
}

function renderOperationMarkdown({ title, description, operation }) {
  const method = String(operation.method ?? "").toUpperCase();
  const path = operation.path ?? "";
  const sections = [`# ${title || operation.operationId || path}\n`];
  // The page summary in frontmatter is truncated. The operation description is the full text.
  const summary = (operation.description || description || "").trim();
  if (summary) {
    sections.push(summary);
  }
  sections.push(`\`${method} ${path}\``);
  const server = (operation.servers ?? []).find(
    (entry) => entry?.url?.replace(/\/$/, "") === "http://localhost:9000",
  );
  if (server) {
    sections.push(`Default server: \`${server.url.replace(/\/$/, "")}\``);
  }
  const parameters = renderParameters(operation.parameters);
  if (parameters) {
    sections.push(parameters.trimEnd());
  }
  const request = renderRequest(operation.requestBody);
  if (request) {
    sections.push(request.trimEnd());
  }
  const responses = renderResponses(operation.responses);
  if (responses) {
    sections.push(responses.trimEnd());
  }
  return `${AGENT_DIRECTIVE}${sections
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}

module.exports = {
  AGENT_DIRECTIVE,
  readOperationFile,
  renderOperationMarkdown,
};

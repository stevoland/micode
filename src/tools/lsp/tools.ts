import { tool } from "@opencode-ai/plugin/tool";
import { withLspClient } from "./client";

interface Location {
  uri: string;
  range: { start: { line: number; character: number }; end: { line: number; character: number } };
}

interface LocationLink {
  targetUri: string;
  targetRange: { start: { line: number; character: number }; end: { line: number; character: number } };
}

interface HoverResult {
  contents: string | { kind: string; value: string } | Array<string | { kind: string; value: string }>;
}

interface DocumentSymbol {
  name: string;
  kind: number;
  range: { start: { line: number }; end: { line: number } };
  children?: DocumentSymbol[];
}

const SYMBOL_KINDS: Record<number, string> = {
  1: "File", 2: "Module", 3: "Namespace", 4: "Package", 5: "Class",
  6: "Method", 7: "Property", 8: "Field", 9: "Constructor", 10: "Enum",
  11: "Interface", 12: "Function", 13: "Variable", 14: "Constant", 15: "String",
  16: "Number", 17: "Boolean", 18: "Array", 19: "Object", 20: "Key",
  21: "Null", 22: "EnumMember", 23: "Struct", 24: "Event", 25: "Operator",
  26: "TypeParameter",
};

function formatLocation(loc: Location | LocationLink): string {
  const uri = "uri" in loc ? loc.uri : loc.targetUri;
  const range = "range" in loc ? loc.range : loc.targetRange;
  const path = uri.replace("file://", "");
  return `${path}:${range.start.line + 1}:${range.start.character}`;
}

function formatHover(result: HoverResult | null): string {
  if (!result) return "No hover info";

  const contents = result.contents;
  if (typeof contents === "string") return contents;
  if (Array.isArray(contents)) {
    return contents
      .map((c) => (typeof c === "string" ? c : c.value))
      .join("\n\n");
  }
  return contents.value;
}

function formatSymbol(sym: DocumentSymbol, indent = 0): string {
  const kind = SYMBOL_KINDS[sym.kind] || "Unknown";
  const prefix = "  ".repeat(indent);
  const line = `${prefix}${sym.name} (${kind}) - line ${sym.range.start.line + 1}`;
  const children = sym.children?.map((c) => formatSymbol(c, indent + 1)).join("\n") || "";
  return children ? `${line}\n${children}` : line;
}

export const lsp_hover = tool({
  description: "Get type info and docs for a symbol at position",
  args: {
    filePath: tool.schema.string(),
    line: tool.schema.number().min(1).describe("1-based line number"),
    character: tool.schema.number().min(0).describe("0-based column"),
  },
  execute: async (args, ctx) => {
    try {
      const result = await withLspClient(args.filePath, process.cwd(), async (client) => {
        return (await client.hover(args.filePath, args.line, args.character)) as HoverResult | null;
      });
      return formatHover(result);
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

export const lsp_goto_definition = tool({
  description: "Find where a symbol is defined",
  args: {
    filePath: tool.schema.string(),
    line: tool.schema.number().min(1).describe("1-based line number"),
    character: tool.schema.number().min(0).describe("0-based column"),
  },
  execute: async (args, ctx) => {
    try {
      const result = await withLspClient(args.filePath, process.cwd(), async (client) => {
        return (await client.definition(args.filePath, args.line, args.character)) as
          | Location
          | Location[]
          | LocationLink[]
          | null;
      });

      if (!result) return "No definition found";
      const locations = Array.isArray(result) ? result : [result];
      if (locations.length === 0) return "No definition found";
      return locations.map(formatLocation).join("\n");
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

export const lsp_find_references = tool({
  description: "Find all usages of a symbol",
  args: {
    filePath: tool.schema.string(),
    line: tool.schema.number().min(1).describe("1-based line number"),
    character: tool.schema.number().min(0).describe("0-based column"),
  },
  execute: async (args, ctx) => {
    try {
      const result = await withLspClient(args.filePath, process.cwd(), async (client) => {
        return (await client.references(args.filePath, args.line, args.character)) as Location[] | null;
      });

      if (!result || result.length === 0) return "No references found";

      const MAX = 50;
      const truncated = result.length > MAX;
      const lines = result.slice(0, MAX).map(formatLocation);
      if (truncated) lines.unshift(`Found ${result.length} references (showing first ${MAX}):`);
      return lines.join("\n");
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

export const lsp_document_symbols = tool({
  description: "Get all symbols in a file (outline)",
  args: {
    filePath: tool.schema.string(),
  },
  execute: async (args, ctx) => {
    try {
      const result = await withLspClient(args.filePath, process.cwd(), async (client) => {
        return (await client.documentSymbols(args.filePath)) as DocumentSymbol[] | null;
      });

      if (!result || result.length === 0) return "No symbols found";
      return result.map((s) => formatSymbol(s)).join("\n");
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

export const lsp_workspace_symbols = tool({
  description: "Search for symbols by name across workspace",
  args: {
    filePath: tool.schema.string().describe("Any file in workspace (for LSP context)"),
    query: tool.schema.string().describe("Symbol name to search"),
  },
  execute: async (args, ctx) => {
    try {
      const result = await withLspClient(args.filePath, process.cwd(), async (client) => {
        return (await client.workspaceSymbols(args.query)) as Array<{
          name: string;
          kind: number;
          location: Location;
        }> | null;
      });

      if (!result || result.length === 0) return "No symbols found";

      const MAX = 50;
      const truncated = result.length > MAX;
      const lines = result.slice(0, MAX).map((s) => {
        const kind = SYMBOL_KINDS[s.kind] || "Unknown";
        return `${s.name} (${kind}) - ${formatLocation(s.location)}`;
      });
      if (truncated) lines.unshift(`Found ${result.length} symbols (showing first ${MAX}):`);
      return lines.join("\n");
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

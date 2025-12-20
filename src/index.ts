import type { Plugin } from "@opencode-ai/plugin";
import type { McpLocalConfig } from "@opencode-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// Agents
import { agents } from "./agents";

// Tools
import {
  lsp_hover,
  lsp_goto_definition,
  lsp_find_references,
  lsp_document_symbols,
  lsp_workspace_symbols,
} from "./tools/lsp";
import { ast_grep_search, ast_grep_replace } from "./tools/ast-grep";

// Hooks
import { createAutoCompactHook } from "./hooks/auto-compact";

// Parse markdown frontmatter
function parseFrontmatter(content: string): { metadata: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, body: content };
  }

  const [, frontmatter, body] = match;
  const metadata: Record<string, unknown> = {};

  for (const line of frontmatter.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value: unknown = line.slice(colonIndex + 1).trim();

      // Parse simple YAML values
      if (value === "true") value = true;
      else if (value === "false") value = false;
      else if (/^\d+$/.test(value as string)) value = parseInt(value as string, 10);

      metadata[key] = value;
    }
  }

  return { metadata, body };
}

// Command config type
type CommandConfig = {
  template: string;
  description?: string;
};

// Load commands from command/ directory
function loadCommands(pluginDir: string): Record<string, CommandConfig> {
  const commandsDir = path.join(pluginDir, "command");
  const commands: Record<string, CommandConfig> = {};

  if (!fs.existsSync(commandsDir)) return commands;

  for (const file of fs.readdirSync(commandsDir)) {
    if (!file.endsWith(".md")) continue;

    const content = fs.readFileSync(path.join(commandsDir, file), "utf-8");
    const { metadata, body } = parseFrontmatter(content);

    const name = file.replace(".md", "");
    commands[name] = {
      description: (metadata.description as string) || `Command: /${name}`,
      template: body.trim(),
    };
  }

  return commands;
}

// Think mode: detect keywords and enable extended thinking
const THINK_KEYWORDS = [
  /\bthink\s*(hard|deeply|carefully|through)\b/i,
  /\bthink\b.*\b(about|on|through)\b/i,
  /\b(deeply|carefully)\s*think\b/i,
  /\blet('s|s)?\s*think\b/i,
];

function detectThinkKeyword(text: string): boolean {
  return THINK_KEYWORDS.some((pattern) => pattern.test(text));
}

// MCP server configurations
const MCP_SERVERS: Record<string, McpLocalConfig> = {
  context7: {
    type: "local",
    command: ["npx", "-y", "@upstash/context7-mcp@latest"],
  },
  "websearch-exa": {
    type: "local",
    command: ["npx", "-y", "exa-mcp-server"],
    environment: {
      EXA_API_KEY: process.env.EXA_API_KEY || "",
    },
  },
};

const OpenCodeConfigPlugin: Plugin = async (ctx) => {
  const pluginDir = path.dirname(new URL(import.meta.url).pathname).replace("/dist", "").replace("/src", "");

  const commands = loadCommands(pluginDir);

  // Think mode state per session
  const thinkModeState = new Map<string, boolean>();

  // Auto-compact hook
  const autoCompactHook = createAutoCompactHook(ctx);

  return {
    // Tools
    tool: {
      lsp_hover,
      lsp_goto_definition,
      lsp_find_references,
      lsp_document_symbols,
      lsp_workspace_symbols,
      ast_grep_search,
      ast_grep_replace,
    },

    config: async (config) => {
      // Add agents
      config.agent = {
        ...agents,
        ...config.agent,
      };

      // Add commands
      config.command = {
        ...commands,
        ...config.command,
      };

      // Add MCP servers
      config.mcp = {
        ...MCP_SERVERS,
        ...config.mcp,
      };
    },

    "chat.message": async (input, output) => {
      // Extract text from user message
      const text = output.parts
        .filter((p) => p.type === "text" && "text" in p)
        .map((p) => (p as { text: string }).text)
        .join(" ");

      // Track if think mode was requested
      thinkModeState.set(input.sessionID, detectThinkKeyword(text));
    },

    "chat.params": async (input, output) => {
      // If think mode was requested, increase thinking budget
      if (thinkModeState.get(input.sessionID)) {
        output.options = {
          ...output.options,
          thinking: {
            type: "enabled",
            budget_tokens: 32000,
          },
        };
      }
    },

    event: async ({ event }) => {
      // Think mode cleanup
      if (event.type === "session.deleted") {
        const props = event.properties as { info?: { id?: string } } | undefined;
        if (props?.info?.id) {
          thinkModeState.delete(props.info.id);
        }
      }

      // Auto-compact hook
      await autoCompactHook.event({ event });
    },
  };
};

export default OpenCodeConfigPlugin;

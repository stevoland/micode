import type { AgentConfig } from "@opencode-ai/sdk";
import { brainstormerAgent } from "./brainstormer";
import { codebaseLocatorAgent } from "./codebase-locator";
import { codebaseAnalyzerAgent } from "./codebase-analyzer";
import { patternFinderAgent } from "./pattern-finder";
import { implementerAgent } from "./implementer";
import { reviewerAgent } from "./reviewer";

export const agents: Record<string, AgentConfig> = {
  brainstormer: brainstormerAgent,
  "codebase-locator": codebaseLocatorAgent,
  "codebase-analyzer": codebaseAnalyzerAgent,
  "pattern-finder": patternFinderAgent,
  implementer: implementerAgent,
  reviewer: reviewerAgent,
};

export {
  brainstormerAgent,
  codebaseLocatorAgent,
  codebaseAnalyzerAgent,
  patternFinderAgent,
  implementerAgent,
  reviewerAgent,
};

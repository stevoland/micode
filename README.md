# .opencode

Minimal OpenCode plugin with Research-Plan-Implement workflow.

## Installation

```bash
# Clone the repo
git clone git@github.com:vtemian/.opencode.git ~/.opencode

# Run install script
cd ~/.opencode
chmod +x install.sh
./install.sh
```

The install script will:
1. Install dependencies with bun
2. Build the TypeScript plugin
3. Configure OpenCode to use the plugin

### Manual Configuration

If you already have a config, add to your `~/.config/opencode/config.json`:

```json
{
  "plugin": {
    "@vtemian/opencode-config": "/path/to/.opencode/dist/index.js"
  }
}
```

## Features

### Research-Plan-Implement Workflow

| Command | Description |
|---------|-------------|
| `/research` | Investigate codebase with parallel sub-agents |
| `/plan` | Create detailed implementation plan |
| `/implement` | Execute plan with parallel implementer + reviewer |
| `/create-handoff` | Save session state for continuity |
| `/resume-handoff` | Resume from previous session |

### Sub-Agents

| Agent | Purpose |
|-------|---------|
| `codebase-locator` | Finds WHERE files live (no content analysis) |
| `codebase-analyzer` | Explains HOW code works (with file:line refs) |
| `pattern-finder` | Shows existing patterns to model after |
| `implementer` | Executes implementation tasks |
| `reviewer` | Reviews implementation for correctness |

### Think Mode

Use these keywords in your prompt to enable extended thinking (32k tokens):
- "think hard"
- "think deeply"
- "think carefully"
- "let's think"

### MCP Servers

Pre-configured MCP servers:
- **context7** - Documentation lookup
- **websearch-exa** - Web search (requires `EXA_API_KEY` env var)

## Structure

```
.opencode/
├── agents/           # Sub-agent definitions (markdown)
├── command/          # Slash commands (markdown)
├── src/              # Plugin source
├── dist/             # Built plugin
└── thoughts/         # Local artifacts (gitignored)
    └── shared/
        ├── research/   # Research documents
        ├── plans/      # Implementation plans
        └── handoffs/   # Session handoffs
```

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Type check
bun run typecheck
```

## Philosophy

This is a minimal implementation inspired by:
- [HumanLayer's ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)
- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)

Key principles:
1. **Research before implementing** - Understand the codebase first
2. **Plan with human buy-in** - Get approval before coding
3. **Parallel verification** - Implementer and reviewer work together
4. **Context preservation** - Handoffs maintain session state

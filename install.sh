#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Installing @vtemian/opencode-config...${NC}"

# Check for bun
if ! command -v bun &> /dev/null; then
    echo -e "${RED}Error: bun is required but not installed.${NC}"
    echo "Install bun: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
cd "$SCRIPT_DIR"
bun install

# Build the plugin
echo -e "${YELLOW}Building plugin...${NC}"
bun run build

# Get OpenCode config directory
if [[ "$OSTYPE" == "darwin"* ]]; then
    OPENCODE_CONFIG="$HOME/Library/Application Support/opencode"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OPENCODE_CONFIG="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
else
    echo -e "${RED}Unsupported OS: $OSTYPE${NC}"
    exit 1
fi

# Create config directory if it doesn't exist
mkdir -p "$OPENCODE_CONFIG"

# Check if config.json exists
CONFIG_FILE="$OPENCODE_CONFIG/config.json"
if [[ -f "$CONFIG_FILE" ]]; then
    echo -e "${YELLOW}Found existing config at $CONFIG_FILE${NC}"

    # Check if plugin is already configured
    if grep -q "@vtemian/opencode-config" "$CONFIG_FILE" 2>/dev/null; then
        echo -e "${GREEN}Plugin already configured in config.json${NC}"
    else
        echo -e "${YELLOW}Add this to your $CONFIG_FILE:${NC}"
        echo ""
        echo '  "plugin": {'
        echo "    \"@vtemian/opencode-config\": \"$SCRIPT_DIR/dist/index.js\""
        echo '  }'
        echo ""
    fi
else
    echo -e "${YELLOW}Creating $CONFIG_FILE...${NC}"
    cat > "$CONFIG_FILE" << EOF
{
  "plugin": {
    "@vtemian/opencode-config": "$SCRIPT_DIR/dist/index.js"
  }
}
EOF
    echo -e "${GREEN}Created config.json with plugin reference${NC}"
fi

# Create thoughts directory structure
echo -e "${YELLOW}Creating thoughts directory structure...${NC}"
mkdir -p "$SCRIPT_DIR/thoughts/shared/research"
mkdir -p "$SCRIPT_DIR/thoughts/shared/plans"
mkdir -p "$SCRIPT_DIR/thoughts/shared/handoffs"

echo ""
echo -e "${GREEN}Installation complete!${NC}"
echo ""
echo "Available commands:"
echo "  /research        - Research codebase"
echo "  /plan            - Create implementation plan"
echo "  /implement       - Execute plan"
echo "  /create-handoff  - Save session state"
echo "  /resume-handoff  - Resume from handoff"
echo ""
echo "Available agents:"
echo "  codebase-locator    - Find file locations"
echo "  codebase-analyzer   - Explain code behavior"
echo "  pattern-finder      - Find existing patterns"
echo "  implementer         - Execute tasks"
echo "  reviewer            - Review implementation"
echo ""
echo "Think mode: Use 'think hard' or 'think deeply' in your prompt for extended thinking."

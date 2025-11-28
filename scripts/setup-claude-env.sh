#!/usr/bin/env bash

set -euo pipefail

DEFAULT_BASE_URL="https://api.z.ai/api/anthropic"
CLAUDE_DIR="${HOME}/.claude"
CLAUDE_SETTINGS="${CLAUDE_DIR}/settings.json"

mkdir -p "${CLAUDE_DIR}"

echo "Claude Code + Z.AI setup (macOS/Linux)"
read -rsp "Enter your Z.AI API key: " ZAI_KEY
echo
read -rp "Anthropic-compatible base URL [${DEFAULT_BASE_URL}]: " BASE_URL_INPUT
BASE_URL="${BASE_URL_INPUT:-$DEFAULT_BASE_URL}"

if [[ -z "${ZAI_KEY}" ]]; then
  echo "API key cannot be empty."
  exit 1
fi

export CLAUDE_SETTINGS
export ZAI_KEY
export BASE_URL

node <<'NODE'
const fs = require('fs');
const path = process.env.CLAUDE_SETTINGS;
const apiKey = process.env.ZAI_KEY;
const baseUrl = process.env.BASE_URL;

let payload = {};
if (fs.existsSync(path)) {
  try {
    payload = JSON.parse(fs.readFileSync(path, 'utf8') || '{}');
  } catch (error) {
    console.error(`Unable to parse existing ${path}:`, error.message);
    process.exit(1);
  }
}

if (typeof payload !== 'object' || Array.isArray(payload)) {
  payload = {};
}

if (!payload.env || typeof payload.env !== 'object' || Array.isArray(payload.env)) {
  payload.env = {};
}

payload.env.ANTHROPIC_AUTH_TOKEN = apiKey;
payload.env.ANTHROPIC_BASE_URL = baseUrl;

const json = JSON.stringify(payload, null, 2);
fs.writeFileSync(path, `${json}\n`, 'utf8');

console.log(`Updated ${path}`);
NODE

echo "Claude Code environment values saved. Open a new terminal session before running claude."


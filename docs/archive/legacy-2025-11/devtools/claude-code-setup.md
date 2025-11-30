# Claude Code + Z.AI Configuration

This guide captures the exact Claude Code setup required for `megamek-web`, based on the official Z.AI manual configuration workflow. Follow it whenever you refresh your environment so BattleTech construction work stays aligned with the canonical rules stored in `docs/battletech/agents/00-INDEX.md`, `docs/battletech/agents/01-construction-rules.md`, and `constants/BattleTechConstructionRules.ts`.

## Prerequisites
- Node.js 18+
- Access to the project root (`E:\Projects\megamek-web`)
- A Z.AI account with an API key

## Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
cd E:\Projects\megamek-web
```

## Manual Configuration (All Platforms)
1. Locate (or create) `~/.claude/settings.json`.
2. Insert the required environment section (replace the placeholder with your key):
   ```json
   {
     "env": {
       "ANTHROPIC_AUTH_TOKEN": "your_zai_api_key",
       "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic"
     }
   }
   ```
3. Save the file and open a new terminal so Claude picks up the changes.

## Windows-Specific Environment Variables
If you need system-level variables (Windows 11):
```cmd
setx ANTHROPIC_AUTH_TOKEN your_zai_api_key
setx ANTHROPIC_BASE_URL https://api.z.ai/api/anthropic
```

For PowerShell:
```powershell
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN','your_zai_api_key','User')
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL','https://api.z.ai/api/anthropic','User')
```

## Helper Scripts in This Repo
To reduce manual editing errors, run one of the helper scripts from the project root:

| Script | Platform | Action |
| --- | --- | --- |
| `scripts/setup-claude-env.sh` | macOS/Linux | Prompts for the API key, updates `~/.claude/settings.json`, and preserves existing settings that are not part of the Claude env block. |
| `scripts/setup-claude-env.ps1` | Windows PowerShell | Collects the API key, updates the same config file, and can optionally export Windows user-level environment variables. |

> These scripts never store the API key in the repository; they only modify the local config file in your user profile.

## Launch & Verify
1. Open a fresh terminal, `cd E:\Projects\megamek-web`.
2. Run `claude` and grant folder access when prompted.
3. Use `/status` to ensure the default mappings point to GLM-4.6 for Sonnet/Opus and GLM-4.5-Air for Haiku (per the latest Z.AI defaults). Remove any old model overrides if `/status` shows legacy GLM-4.5 entries.
4. Keep construction changes tied to `ConstructionRulesValidator` and `constants/BattleTechConstructionRules.ts` so every automation session respects the TechManual.

## Maintenance Notes
- If manual edits do not take effect, close all Claude terminals, reopen one, or delete `~/.claude/settings.json` and rerun the helper script.
- When Z.AI updates their defaults, delete custom model mappings so Claude adopts the new values automatically.
- Re-run the helper scripts after rotating API keys.

Source: [Z.AI Claude Code Manual Configuration](https://docs.z.ai/scenario-example/develop-tools/claude#manual-configuration-windows-macos-linux)


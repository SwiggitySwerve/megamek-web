# OpenSpec Scripts

Utility scripts for maintaining and validating OpenSpec specifications.

## Terminology Validator

**Script**: `validate-terminology.js`

Validates all specification files against canonical terminology standards defined in `TERMINOLOGY_GLOSSARY.md`.

### Usage

```bash
# Basic validation (read-only)
node openspec/scripts/validate-terminology.js

# Check for violations and exit with error code
npm run validate-terminology
```

### What It Checks

#### 1. Deprecated Terms
- ❌ "crit slots" → ✅ "critical slots"
- ❌ "component mass" → ✅ "component weight"
- ❌ "Tournament" (rules level) → ✅ "Advanced"
- ❌ "internal heat sinks" → ✅ "engine-integrated heat sinks"
- ❌ "tech level" → ✅ "rules level"
- And 20+ more deprecated terms

#### 2. Property Naming
- ❌ `tons: number` → ✅ `weight: number`
- ❌ `mass: number` → ✅ `weight: number`
- ❌ `slots: number` → ✅ `criticalSlots: number`
- ❌ `introYear:` → ✅ `introductionYear:`
- ❌ `faction:` → ✅ `techBase:`

#### 3. Capitalization
- ❌ "Battlemech" → ✅ "BattleMech"
- ❌ "Battle Mech" → ✅ "BattleMech"
- ❌ "inner sphere" → ✅ "Inner Sphere"
- ❌ "centre torso" → ✅ "Center Torso"
- ❌ "armour" → ✅ "armor"

### Output

The validator provides:
- **File-by-file violation reports** with line numbers
- **Severity levels**: ERROR (must fix) and WARN (should fix)
- **Canonical replacements** for each violation
- **Summary statistics**

### Exit Codes

- `0` - No violations found or warnings only
- `1` - Errors found (blocks CI/CD if configured)

### Example Output

```
OpenSpec Terminology Validator

Scanning specs directory: E:\Projects\megamek-web\openspec\specs

Found 21 specification files

ERROR specs/phase-2-construction/gyro-system/spec.md:923
  Found: "slots: 4,"
  Should be: "criticalSlots: 4,"
  Context: property definition
  Line:   slots: 4,

Summary:
  Files scanned: 21
  Files with violations: 1
  Errors: 4
  Warnings: 0
  Total violations: 4
```

### Integration

#### package.json Script

Add to your `package.json`:

```json
{
  "scripts": {
    "validate-terminology": "node openspec/scripts/validate-terminology.js"
  }
}
```

#### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
node openspec/scripts/validate-terminology.js
if [ $? -ne 0 ]; then
  echo "❌ Terminology validation failed. Please fix violations before committing."
  exit 1
fi
```

#### CI/CD

Add to GitHub Actions workflow:

```yaml
- name: Validate Terminology
  run: node openspec/scripts/validate-terminology.js
```

### Limitations

- **No auto-fix**: Manual updates required (automated fixes may be added in future)
- **Context-sensitive terms**: Some warnings may be false positives in specific contexts
- **Code blocks only**: Property naming validation only applies within code blocks

### Maintenance

When updating `TERMINOLOGY_GLOSSARY.md`:
1. Add new deprecated terms to `DEPRECATED_TERMS` array
2. Add new property violations to `PROPERTY_VIOLATIONS` array
3. Add new capitalization rules to `CAPITALIZATION_ISSUES` array
4. Test validator against known violations

### Related Documentation

- `../TERMINOLOGY_GLOSSARY.md` - Canonical terminology reference
- `../specs/README.md` - Specification index
- `../templates/spec-template.md` - Specification template

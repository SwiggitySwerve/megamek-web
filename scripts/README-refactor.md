# Component Name Refactor Scripts

This directory contains scripts to automate the refactor from name-based matching to ID-based matching for all components and equipment in the codebase.

## Overview

The refactor moves from:
- **Before**: Using display names (e.g., `"Endo Steel Structure"`) for logic and matching
- **After**: Using internal IDs (e.g., `"endo_steel"`) for logic, and display names only for UI

## Scripts

### 1. `backup-before-refactor.js`
Creates a backup of all TypeScript/JavaScript files before running the refactor.

**Usage:**
```bash
node scripts/backup-before-refactor.js
```

### 2. `refactor-component-names.js`
Main refactor script that processes all files and replaces name-based logic with ID-based logic.

**Usage:**
```bash
node scripts/refactor-component-names.js
```

## Complete Refactor Process

### Step 1: Create Backup
```bash
node scripts/backup-before-refactor.js
```

### Step 2: Run Refactor
```bash
node scripts/refactor-component-names.js
```

### Step 3: Review Changes
The script will output a summary of all changes made. Review the modified files to ensure the refactor was applied correctly.

### Step 4: Run Tests
```bash
npm test
```

### Step 5: Manual Review
Some changes may require manual review, especially:
- Complex logic that couldn't be automatically refactored
- Custom component definitions
- Database schemas
- Configuration files

## What the Script Does

### 1. Creates Utility Files
- `utils/componentNameUtils.ts` - Mapping utility for ID ↔ display name
- `__tests__/utils/componentNameTestHelpers.ts` - Test helpers
- `docs/component-name-refactor.md` - Documentation

### 2. Replaces Logic Patterns
- `equipment.name === 'Endo Steel'` → `equipment.id === 'endo_steel'`
- `equipment.name.includes('Ferro-Fibrous')` → `equipment.id === 'ferro_fibrous'`
- And many other patterns...

### 3. Updates UI Display
- `{equipment.id}` → `{equipment.name}` (in JSX/TSX files)

### 4. Component Mappings
The script handles these component mappings:

| Display Name | Internal ID |
|--------------|-------------|
| `Endo Steel` | `endo_steel` |
| `Ferro-Fibrous` | `ferro_fibrous` |
| `Endo Steel (Clan)` | `endo_steel_clan` |
| `Ferro-Fibrous (Clan)` | `ferro_fibrous_clan` |
| And many more... | ... |

## Safety Features

1. **Backup Creation**: Always creates a backup before making changes
2. **Dry Run Option**: Can be modified to show changes without applying them
3. **Detailed Logging**: Shows exactly what changes are made
4. **File Exclusion**: Excludes node_modules, .git, and other non-source directories

## Rollback

If something goes wrong, you can restore from the backup:
```bash
# The backup directory will be named like: backup-before-refactor-2024-01-15T10-30-45-123Z
# Copy files back from the backup directory
cp -r backup-before-refactor-*/utils/ ./utils/
cp -r backup-before-refactor-*/components/ ./components/
# ... etc for other directories
```

## Manual Steps After Refactor

1. **Update Component Definitions**: Ensure all component definitions have both `id` and `name` fields
2. **Update Database Schemas**: If you have a database, update schemas to use IDs
3. **Update Configuration Files**: Any config files that reference component names
4. **Update Documentation**: Update any documentation that references the old naming
5. **Test Thoroughly**: Run all tests and manual testing

## Troubleshooting

### Script Fails
- Check that you have Node.js installed
- Ensure you're running from the project root directory
- Check file permissions

### Tests Fail After Refactor
- Some tests may need manual updates
- Check the test helper functions in `__tests__/utils/componentNameTestHelpers.ts`
- Update any tests that were missed by the automated refactor

### UI Issues
- Ensure all UI components use `.name` for display
- Check that the mapping utility is working correctly
- Verify that component definitions have correct `id` and `name` fields

## Support

If you encounter issues:
1. Check the generated documentation in `docs/component-name-refactor.md`
2. Review the backup to see what changed
3. Use the test helpers to verify component mappings
4. Check the console output for any error messages

## Files Created/Modified

### Created
- `utils/componentNameUtils.ts`
- `__tests__/utils/componentNameTestHelpers.ts`
- `docs/component-name-refactor.md`

### Modified
- All TypeScript/JavaScript files with component logic
- React components that display component names
- Test files that check component names

## Example Before/After

### Before
```typescript
// Logic
if (equipment.name.includes('Endo Steel')) {
  // handle endo steel
}

// UI
<span>{equipment.id}</span>

// Test
expect(equipment.name).toContain('Endo Steel');
```

### After
```typescript
// Logic
if (equipment.id === 'endo_steel') {
  // handle endo steel
}

// UI
<span>{equipment.name}</span>

// Test
expect(equipment.id).toBe('endo_steel');
``` 
#!/usr/bin/env node

/**
 * Component Name Refactor Script
 * 
 * This script automates the refactor from name-based matching to ID-based matching
 * for all components and equipment in the codebase.
 * 
 * Usage: node scripts/refactor-component-names.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  // File patterns to process
  filePatterns: [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx'
  ],
  
  // Directories to exclude
  excludeDirs: [
    'node_modules',
    '.git',
    'coverage',
    'dist',
    'build',
    'playwright-report',
    '__mocks__'
  ],
  
  // Component mappings: display name -> internal ID
  componentMappings: {
    // Structure components
    'Endo Steel': 'endo_steel',
    'Endo Steel Structure': 'endo_steel',
    'Endo Steel (Clan)': 'endo_steel_clan',
    'Endo Steel (Clan) Structure': 'endo_steel_clan',
    'Composite': 'composite',
    'Composite Structure': 'composite',
    'Reinforced': 'reinforced',
    'Reinforced Structure': 'reinforced',
    'Industrial': 'industrial',
    'Industrial Structure': 'industrial',
    
    // Armor components
    'Ferro-Fibrous': 'ferro_fibrous',
    'Ferro-Fibrous Armor': 'ferro_fibrous',
    'Ferro-Fibrous (Clan)': 'ferro_fibrous_clan',
    'Ferro-Fibrous (Clan) Armor': 'ferro_fibrous_clan',
    'Light Ferro-Fibrous': 'light_ferro_fibrous',
    'Light Ferro-Fibrous Armor': 'light_ferro_fibrous',
    'Heavy Ferro-Fibrous': 'heavy_ferro_fibrous',
    'Heavy Ferro-Fibrous Armor': 'heavy_ferro_fibrous',
    'Stealth': 'stealth_armor',
    'Stealth Armor': 'stealth_armor',
    'Reactive': 'reactive_armor',
    'Reactive Armor': 'reactive_armor',
    'Reflective': 'reflective_armor',
    'Reflective Armor': 'reflective_armor',
    'Hardened': 'hardened_armor',
    'Hardened Armor': 'hardened_armor',
    
    // Heat sinks
    'Single Heat Sink': 'single_heat_sink',
    'Double Heat Sink': 'double_heat_sink',
    'Double Heat Sink (Clan)': 'double_heat_sink_clan',
    'Compact Heat Sink': 'compact_heat_sink',
    'Laser Heat Sink': 'laser_heat_sink',
    
    // Jump jets
    'Standard Jump Jet': 'standard_jump_jet',
    'Improved Jump Jet': 'improved_jump_jet',
    'Partial Wing': 'partial_wing',
    
    // Engine types
    'Standard Engine': 'standard_engine',
    'XL Engine': 'xl_engine',
    'Light Engine': 'light_engine',
    'XXL Engine': 'xxl_engine',
    'Compact Engine': 'compact_engine',
    
    // Gyro types
    'Standard Gyro': 'standard_gyro',
    'XL Gyro': 'xl_gyro',
    'Compact Gyro': 'compact_gyro'
  },
  
  // Patterns to replace in logic (name-based -> ID-based)
  logicReplacements: [
    // Direct name comparisons
    {
      pattern: /\b(\w+)\.name\s*===\s*['"]([^'"]+)['"]/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id === '${id}'` : match;
      }
    },
    {
      pattern: /\b(\w+)\.name\s*==\s*['"]([^'"]+)['"]/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id === '${id}'` : match;
      }
    },
    {
      pattern: /\b(\w+)\.name\s*!==\s*['"]([^'"]+)['"]/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id !== '${id}'` : match;
      }
    },
    {
      pattern: /\b(\w+)\.name\s*!=\s*['"]([^'"]+)['"]/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id !== '${id}'` : match;
      }
    },
    
    // includes() patterns
    {
      pattern: /\b(\w+)\.name\.includes\(['"]([^'"]+)['"]\)/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id === '${id}'` : match;
      }
    },
    
    // indexOf patterns
    {
      pattern: /\b(\w+)\.name\.indexOf\(['"]([^'"]+)['"]\)/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id === '${id}'` : match;
      }
    },
    
    // startsWith patterns
    {
      pattern: /\b(\w+)\.name\.startsWith\(['"]([^'"]+)['"]\)/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id === '${id}'` : match;
      }
    },
    
    // endsWith patterns
    {
      pattern: /\b(\w+)\.name\.endsWith\(['"]([^'"]+)['"]\)/g,
      replacement: (match, variable, name) => {
        const id = CONFIG.componentMappings[name];
        return id ? `${variable}.id === '${id}'` : match;
      }
    }
  ],
  
  // Patterns to replace in UI (ID -> name for display)
  uiReplacements: [
    // Replace .id with .name in JSX/TSX for display
    {
      pattern: /\{(\w+)\.id\}/g,
      replacement: '{$1.name}'
    },
    {
      pattern: /\{(\w+)\.id\s*\|\|\s*['"][^'"]*['"]\}/g,
      replacement: '{$1.name || \'\'}'
    }
  ]
};

// Utility functions
function shouldExcludeFile(filePath) {
  return CONFIG.excludeDirs.some(dir => filePath.includes(dir));
}

function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

function isProcessableFile(filePath) {
  const ext = getFileExtension(filePath);
  return ['.ts', '.tsx', '.js', '.jsx'].includes(ext) && !shouldExcludeFile(filePath);
}

function findFiles(dir, patterns) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeFile(fullPath)) {
          walk(fullPath);
        }
      } else if (stat.isFile() && isProcessableFile(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let changes = 0;
  
  // Apply logic replacements
  for (const replacement of CONFIG.logicReplacements) {
    const newContent = content.replace(replacement.pattern, replacement.replacement);
    if (newContent !== content) {
      changes++;
      content = newContent;
    }
  }
  
  // Apply UI replacements (only for React components)
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    for (const replacement of CONFIG.uiReplacements) {
      const newContent = content.replace(replacement.pattern, replacement.replacement);
      if (newContent !== content) {
        changes++;
        content = newContent;
      }
    }
  }
  
  // Write changes if any were made
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Made ${changes} changes`);
    return { filePath, changes };
  }
  
  return null;
}

function createMappingUtility() {
  const utilityContent = `/**
 * Component Name Mapping Utility
 * 
 * This utility provides functions to map between internal IDs and display names
 * for components and equipment.
 */

// Component definitions with internal IDs and display names
export const COMPONENT_DEFINITIONS = {
${Object.entries(CONFIG.componentMappings).map(([name, id]) => `  '${id}': '${name}'`).join(',\n')}
};

/**
 * Get display name for a component ID
 */
export function getComponentDisplayName(id: string): string {
  return COMPONENT_DEFINITIONS[id] || id;
}

/**
 * Get component ID from display name
 */
export function getComponentIdByName(name: string): string | undefined {
  for (const [componentId, displayName] of Object.entries(COMPONENT_DEFINITIONS)) {
    if (displayName === name) {
      return componentId;
    }
  }
  return undefined;
}

/**
 * Check if a component ID is a special component
 */
export function isSpecialComponent(id: string): boolean {
  const specialComponentIds = [
    'endo_steel', 'endo_steel_clan', 'composite', 'reinforced', 'industrial',
    'ferro_fibrous', 'ferro_fibrous_clan', 'light_ferro_fibrous', 'heavy_ferro_fibrous',
    'stealth_armor', 'reactive_armor', 'reflective_armor', 'hardened_armor'
  ];
  return specialComponentIds.includes(id);
}

/**
 * Check if a component ID is a structure component
 */
export function isStructureComponent(id: string): boolean {
  const structureComponentIds = [
    'endo_steel', 'endo_steel_clan', 'composite', 'reinforced', 'industrial'
  ];
  return structureComponentIds.includes(id);
}

/**
 * Check if a component ID is an armor component
 */
export function isArmorComponent(id: string): boolean {
  const armorComponentIds = [
    'ferro_fibrous', 'ferro_fibrous_clan', 'light_ferro_fibrous', 'heavy_ferro_fibrous',
    'stealth_armor', 'reactive_armor', 'reflective_armor', 'hardened_armor'
  ];
  return armorComponentIds.includes(id);
}

/**
 * Migrate old display names to new IDs (for legacy data)
 */
export function migrateOldNameToId(name: string): string {
  const mappings = {
    'Endo Steel Structure': 'endo_steel',
    'Endo Steel (Clan) Structure': 'endo_steel_clan',
    'Composite Structure': 'composite',
    'Reinforced Structure': 'reinforced',
    'Industrial Structure': 'industrial',
    'Ferro-Fibrous Armor': 'ferro_fibrous',
    'Ferro-Fibrous (Clan) Armor': 'ferro_fibrous_clan',
    'Light Ferro-Fibrous Armor': 'light_ferro_fibrous',
    'Heavy Ferro-Fibrous Armor': 'heavy_ferro_fibrous',
    'Stealth Armor': 'stealth_armor',
    'Reactive Armor': 'reactive_armor',
    'Reflective Armor': 'reflective_armor',
    'Hardened Armor': 'hardened_armor'
  };
  
  return mappings[name] || name;
}
`;

  const utilityPath = path.join(process.cwd(), 'utils', 'componentNameUtils.ts');
  
  // Ensure utils directory exists
  const utilsDir = path.dirname(utilityPath);
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  fs.writeFileSync(utilityPath, utilityContent, 'utf8');
  console.log(`Created mapping utility: ${utilityPath}`);
}

function createTestHelper() {
  const testHelperContent = `/**
 * Test Helper for Component Name Refactor
 * 
 * This helper provides utilities for testing component name mappings
 */

import { getComponentDisplayName, getComponentIdByName, isSpecialComponent } from '../utils/componentNameUtils';

/**
 * Test helper to verify component ID mapping
 */
export function expectComponentId(actualId: string, expectedId: string) {
  expect(actualId).toBe(expectedId);
}

/**
 * Test helper to verify component display name
 */
export function expectComponentDisplayName(actualName: string, expectedName: string) {
  expect(actualName).toBe(expectedName);
}

/**
 * Test helper to verify special component detection
 */
export function expectSpecialComponent(id: string, expected: boolean = true) {
  expect(isSpecialComponent(id)).toBe(expected);
}

/**
 * Test helper to verify component mapping functions
 */
export function expectComponentMapping(id: string, expectedDisplayName: string) {
  expect(getComponentDisplayName(id)).toBe(expectedDisplayName);
  expect(getComponentIdByName(expectedDisplayName)).toBe(id);
}
`;

  const testHelperPath = path.join(process.cwd(), '__tests__', 'utils', 'componentNameTestHelpers.ts');
  
  // Ensure test utils directory exists
  const testUtilsDir = path.dirname(testHelperPath);
  if (!fs.existsSync(testUtilsDir)) {
    fs.mkdirSync(testUtilsDir, { recursive: true });
  }
  
  fs.writeFileSync(testHelperPath, testHelperContent, 'utf8');
  console.log(`Created test helper: ${testHelperPath}`);
}

function createDocumentation() {
  const docContent = `# Component Name Refactor Documentation

## Overview

This document describes the refactor from name-based matching to ID-based matching for all components and equipment in the codebase.

## Key Changes

### 1. Internal IDs vs Display Names

- **Internal IDs**: Used for all logic, matching, serialization (e.g., \`"endo_steel"\`, \`"ferro_fibrous"\`)
- **Display Names**: Used for UI rendering only (e.g., \`"Endo Steel"\`, \`"Ferro-Fibrous"\`)

### 2. Component Mappings

| Internal ID | Display Name |
|-------------|--------------|
| \`endo_steel\` | \`Endo Steel\` |
| \`ferro_fibrous\` | \`Ferro-Fibrous\` |
| \`endo_steel_clan\` | \`Endo Steel (Clan)\` |
| \`ferro_fibrous_clan\` | \`Ferro-Fibrous (Clan)\` |
| ... | ... |

### 3. Usage Guidelines

#### Logic Layer
\`\`\`typescript
// ✅ Correct - Use ID for logic
if (equipment.id === 'endo_steel') { ... }

// ❌ Wrong - Don't use display name for logic
if (equipment.id === 'endo_steel') { ... }
\`\`\`

#### UI Layer
\`\`\`typescript
// ✅ Correct - Use display name for UI
<span>{equipment.name}</span>

// ❌ Wrong - Don't use ID for display
<span>{equipment.id}</span>
\`\`\`

#### Tests
\`\`\`typescript
// ✅ Correct - Test logic with ID
expect(equipment.id).toBe('endo_steel');

// ✅ Correct - Test UI with display name
expect(equipment.name).toBe('Endo Steel');
\`\`\`

### 4. Migration

For legacy data that uses display names, use the migration utility:

\`\`\`typescript
import { migrateOldNameToId } from '../utils/componentNameUtils';

const newId = migrateOldNameToId('Endo Steel Structure'); // Returns 'endo_steel'
\`\`\`

### 5. Utility Functions

- \`getComponentDisplayName(id)\`: Get display name from ID
- \`getComponentIdByName(name)\`: Get ID from display name
- \`isSpecialComponent(id)\`: Check if component is special
- \`isStructureComponent(id)\`: Check if component is structure
- \`isArmorComponent(id)\`: Check if component is armor

## Files Modified

This refactor affects:
- All TypeScript/JavaScript files with component logic
- Component definitions and databases
- Tests
- UI components
- Serialization/deserialization logic

## Breaking Changes

- Component matching logic now uses IDs instead of names
- Display names no longer include "Structure" or "Armor" suffixes for Endo Steel and Ferro-Fibrous
- Serialized data now stores IDs instead of display names

## Migration Steps

1. Update component definitions with ID and name fields
2. Replace name-based logic with ID-based logic
3. Update UI to use display names
4. Update tests to match on IDs for logic
5. Migrate legacy data using migration utility
6. Update serialization to use IDs
`;

  const docPath = path.join(process.cwd(), 'docs', 'component-name-refactor.md');
  
  // Ensure docs directory exists
  const docsDir = path.dirname(docPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  fs.writeFileSync(docPath, docContent, 'utf8');
  console.log(`Created documentation: ${docPath}`);
}

// Main execution
function main() {
  console.log('🚀 Starting Component Name Refactor...\n');
  
  const startTime = Date.now();
  const cwd = process.cwd();
  
  console.log('📁 Finding files to process...');
  const files = findFiles(cwd, CONFIG.filePatterns);
  console.log(`Found ${files.length} files to process\n`);
  
  console.log('🔧 Creating utility files...');
  createMappingUtility();
  createTestHelper();
  createDocumentation();
  console.log('');
  
  console.log('🔄 Processing files...');
  const results = [];
  let totalChanges = 0;
  
  for (const file of files) {
    const result = processFile(file);
    if (result) {
      results.push(result);
      totalChanges += result.changes;
    }
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('\n📊 Summary:');
  console.log(`  Files processed: ${files.length}`);
  console.log(`  Files modified: ${results.length}`);
  console.log(`  Total changes: ${totalChanges}`);
  console.log(`  Duration: ${duration.toFixed(2)}s`);
  
  if (results.length > 0) {
    console.log('\n📝 Modified files:');
    results.forEach(result => {
      console.log(`  ${result.filePath} (${result.changes} changes)`);
    });
  }
  
  console.log('\n✅ Refactor complete!');
  console.log('\n📋 Next steps:');
  console.log('  1. Review the changes in modified files');
  console.log('  2. Run tests to ensure everything works');
  console.log('  3. Update any remaining manual references');
  console.log('  4. Commit the changes');
  console.log('\n📚 See docs/component-name-refactor.md for more information');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { CONFIG, processFile, findFiles }; 
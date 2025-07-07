#!/usr/bin/env node

/**
 * Dry Run Component Name Refactor Script
 * 
 * This script shows what changes would be made by the refactor script
 * without actually applying them.
 * 
 * Usage: node scripts/dry-run-refactor.js
 */

const fs = require('fs');
const path = require('path');

// Import the main refactor script configuration
const { CONFIG } = require('./refactor-component-names.js');

// Utility functions (copied from main script)
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

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const changes = [];
  
  // Analyze logic replacements
  for (const replacement of CONFIG.logicReplacements) {
    const matches = content.match(replacement.pattern);
    if (matches) {
      changes.push({
        type: 'logic',
        pattern: replacement.pattern.toString(),
        matches: matches.length,
        examples: matches.slice(0, 3) // Show first 3 examples
      });
    }
  }
  
  // Analyze UI replacements (only for React components)
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    for (const replacement of CONFIG.uiReplacements) {
      const matches = content.match(replacement.pattern);
      if (matches) {
        changes.push({
          type: 'ui',
          pattern: replacement.pattern.toString(),
          matches: matches.length,
          examples: matches.slice(0, 3) // Show first 3 examples
        });
      }
    }
  }
  
  return changes.length > 0 ? { filePath, changes } : null;
}

function main() {
  console.log('🔍 Dry Run: Component Name Refactor Analysis\n');
  
  const startTime = Date.now();
  const cwd = process.cwd();
  
  console.log('📁 Finding files to analyze...');
  const files = findFiles(cwd, CONFIG.filePatterns);
  console.log(`Found ${files.length} files to analyze\n`);
  
  console.log('🔍 Analyzing files for potential changes...');
  const results = [];
  let totalPotentialChanges = 0;
  
  for (const file of files) {
    const result = analyzeFile(file);
    if (result) {
      results.push(result);
      totalPotentialChanges += result.changes.reduce((sum, change) => sum + change.matches, 0);
    }
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('\n📊 Analysis Summary:');
  console.log(`  Files analyzed: ${files.length}`);
  console.log(`  Files with potential changes: ${results.length}`);
  console.log(`  Total potential changes: ${totalPotentialChanges}`);
  console.log(`  Duration: ${duration.toFixed(2)}s`);
  
  if (results.length > 0) {
    console.log('\n📝 Files with potential changes:');
    results.forEach(result => {
      console.log(`\n  ${result.filePath}:`);
      result.changes.forEach(change => {
        console.log(`    ${change.type.toUpperCase()}: ${change.matches} matches`);
        if (change.examples.length > 0) {
          console.log(`      Examples: ${change.examples.join(', ')}`);
        }
      });
    });
  }
  
  console.log('\n🔧 Component Mappings that would be applied:');
  console.log('  Display Name → Internal ID');
  Object.entries(CONFIG.componentMappings).forEach(([name, id]) => {
    console.log(`  "${name}" → "${id}"`);
  });
  
  console.log('\n⚠️  This is a DRY RUN - no changes were made');
  console.log('\n📋 To apply the changes:');
  console.log('  1. Run: node scripts/backup-before-refactor.js');
  console.log('  2. Run: node scripts/refactor-component-names.js');
  console.log('  3. Review the changes');
  console.log('  4. Run tests');
}

// Run the dry run
if (require.main === module) {
  main();
}

module.exports = { analyzeFile, findFiles }; 
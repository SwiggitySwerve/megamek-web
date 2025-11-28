#!/usr/bin/env node

/**
 * OpenSpec Terminology Validator
 *
 * Validates all specification files against canonical terminology standards
 * defined in TERMINOLOGY_GLOSSARY.md
 *
 * Usage: node validate-terminology.js [--fix]
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Configuration
const SPECS_DIR = path.join(__dirname, '..', 'specs');
const FIX_MODE = process.argv.includes('--fix');

// Deprecated terms that should never appear (case-insensitive)
const DEPRECATED_TERMS = [
  // Critical Slots
  { deprecated: /\bcrit slots\b/gi, canonical: 'critical slots', severity: 'error' },
  { deprecated: /\bcritical spaces\b/gi, canonical: 'critical slots', severity: 'error' },
  { deprecated: /\bequipment slots\b/gi, canonical: 'critical slots', severity: 'warning' },

  // Weight/Mass
  { deprecated: /\bcomponent mass\b/gi, canonical: 'component weight', severity: 'error' },
  { deprecated: /\bequipment mass\b/gi, canonical: 'equipment weight', severity: 'error' },
  { deprecated: /\bweapon mass\b/gi, canonical: 'weapon weight', severity: 'error' },

  // Tech Base
  { deprecated: /\btechnology base\b/gi, canonical: 'tech base', severity: 'warning' },

  // Rules Level
  { deprecated: /\bTournament\b/g, canonical: 'Advanced', severity: 'error', context: 'rules level' },
  { deprecated: /\btech level\b/gi, canonical: 'rules level', severity: 'error' },
  { deprecated: /\bcomplexity level\b/gi, canonical: 'rules level', severity: 'warning' },

  // Location terminology
  { deprecated: /\bsection\b/gi, canonical: 'location', severity: 'warning', context: 'mech body part' },
  { deprecated: /\bbody part\b/gi, canonical: 'location', severity: 'warning' },
  { deprecated: /\bcentre torso\b/gi, canonical: 'Center Torso', severity: 'error' },
  { deprecated: /\barmour\b/gi, canonical: 'armor', severity: 'error' },

  // Engine heat sinks
  { deprecated: /\binternal heat sinks\b/gi, canonical: 'engine-integrated heat sinks', severity: 'error' },
  { deprecated: /\badditional heat sinks\b/gi, canonical: 'external heat sinks', severity: 'warning' },
  { deprecated: /\bintegrated heat sink capacity\b/gi, canonical: 'engine integration capacity', severity: 'error' },

  // Other
  { deprecated: /\bgyroscope\b/gi, canonical: 'gyro', severity: 'warning' },
  { deprecated: /\bheatsink\b/gi, canonical: 'heat sink', severity: 'error' },
  { deprecated: /\bverif(y|ication)\b/gi, canonical: 'validate/validation', severity: 'warning', context: 'validation context' },
  { deprecated: /\bchecking\b/gi, canonical: 'validation', severity: 'warning', context: 'validation context' },
];

// Property naming violations (must be exact matches in code blocks)
const PROPERTY_VIOLATIONS = [
  { pattern: /^\s*(?:readonly\s+)?tons:\s*number/gm, canonical: 'weight: number', severity: 'error' },
  { pattern: /^\s*(?:readonly\s+)?mass:\s*number/gm, canonical: 'weight: number', severity: 'error' },
  { pattern: /^\s*(?:readonly\s+)?slots:\s*number/gm, canonical: 'criticalSlots: number', severity: 'error', context: 'property definition (not "slots" alone in prose)' },
  { pattern: /^\s*(?:readonly\s+)?critSlots:\s*number/gm, canonical: 'criticalSlots: number', severity: 'error' },
  { pattern: /^\s*(?:readonly\s+)?introYear:/gm, canonical: 'introductionYear:', severity: 'error' },
  { pattern: /^\s*(?:readonly\s+)?faction:/gm, canonical: 'techBase:', severity: 'error' },
];

// Capitalization issues
const CAPITALIZATION_ISSUES = [
  { pattern: /\bBattlemech\b/g, canonical: 'BattleMech', severity: 'error' },
  { pattern: /\bBattle Mech\b/g, canonical: 'BattleMech', severity: 'error' },
  { pattern: /\bbattle mech\b/g, canonical: 'BattleMech or mech', severity: 'warning' },
  { pattern: /\binner sphere\b/g, canonical: 'Inner Sphere', severity: 'error', context: 'when referring to faction (not "inner sphere technology")' },
];

// Stats
let stats = {
  filesScanned: 0,
  violations: {
    error: 0,
    warning: 0,
  },
  byFile: {},
};

/**
 * Find all spec.md files recursively
 */
function findSpecFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name === 'spec.md') {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Check a file for terminology violations
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  // Check each line
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check deprecated terms
    DEPRECATED_TERMS.forEach(({ deprecated, canonical, severity, context }) => {
      const matches = line.match(deprecated);
      if (matches) {
        // Skip if in a code comment explaining what NOT to use
        if (line.includes('❌') || line.includes('Deprecated') || line.includes('Do not use')) {
          return;
        }

        matches.forEach(match => {
          violations.push({
            line: lineNumber,
            type: 'deprecated-term',
            severity,
            found: match,
            canonical,
            context,
            text: line.trim(),
          });
        });
      }
    });

    // Check property naming violations (only in code blocks)
    const inCodeBlock = content.slice(0, content.split('\n').slice(0, index).join('\n').length).split('```').length % 2 === 0;

    if (inCodeBlock) {
      PROPERTY_VIOLATIONS.forEach(({ pattern, canonical, severity, context }) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            violations.push({
              line: lineNumber,
              type: 'property-naming',
              severity,
              found: match.trim(),
              canonical,
              context,
              text: line.trim(),
            });
          });
        }
      });
    }

    // Check capitalization
    CAPITALIZATION_ISSUES.forEach(({ pattern, canonical, severity, context }) => {
      const matches = line.match(pattern);
      if (matches) {
        // Skip if in a code comment or deprecated section
        if (line.includes('❌') || line.includes('Deprecated')) {
          return;
        }

        matches.forEach(match => {
          violations.push({
            line: lineNumber,
            type: 'capitalization',
            severity,
            found: match,
            canonical,
            context,
            text: line.trim(),
          });
        });
      }
    });
  });

  return violations;
}

/**
 * Format violation for display
 */
function formatViolation(violation, filePath) {
  const severityColor = violation.severity === 'error' ? colors.red : colors.yellow;
  const severityLabel = violation.severity === 'error' ? 'ERROR' : 'WARN';
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  let message = `${severityColor}${severityLabel}${colors.reset} `;
  message += `${colors.cyan}${relativePath}:${violation.line}${colors.reset}\n`;
  message += `  ${colors.bold}Found:${colors.reset} "${violation.found}"\n`;
  message += `  ${colors.bold}Should be:${colors.reset} "${violation.canonical}"`;

  if (violation.context) {
    message += `\n  ${colors.bold}Context:${colors.reset} ${violation.context}`;
  }

  message += `\n  ${colors.bold}Line:${colors.reset} ${violation.text}\n`;

  return message;
}

/**
 * Main validation function
 */
function validate() {
  console.log(`${colors.bold}${colors.blue}OpenSpec Terminology Validator${colors.reset}\n`);
  console.log(`Scanning specs directory: ${SPECS_DIR}\n`);

  if (FIX_MODE) {
    console.log(`${colors.yellow}⚠️  FIX MODE: Automatic fixes are NOT implemented yet${colors.reset}\n`);
  }

  const specFiles = findSpecFiles(SPECS_DIR);
  console.log(`Found ${specFiles.length} specification files\n`);

  const allViolations = [];

  // Check each file
  specFiles.forEach(filePath => {
    stats.filesScanned++;
    const violations = checkFile(filePath);

    if (violations.length > 0) {
      const relativePath = path.relative(path.join(__dirname, '..'), filePath);
      stats.byFile[relativePath] = violations.length;

      violations.forEach(v => {
        stats.violations[v.severity]++;
        allViolations.push({ filePath, ...v });
      });
    }
  });

  // Display violations
  if (allViolations.length === 0) {
    console.log(`${colors.green}${colors.bold}✓ No terminology violations found!${colors.reset}\n`);
    console.log(`All ${stats.filesScanned} specifications are compliant with TERMINOLOGY_GLOSSARY.md\n`);
    return 0;
  }

  console.log(`${colors.red}${colors.bold}Found ${allViolations.length} violation(s) in ${Object.keys(stats.byFile).length} file(s)${colors.reset}\n`);

  // Group by file
  const byFile = {};
  allViolations.forEach(v => {
    const key = v.filePath;
    if (!byFile[key]) byFile[key] = [];
    byFile[key].push(v);
  });

  // Display violations by file
  Object.entries(byFile).forEach(([filePath, violations]) => {
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    console.log(`${colors.bold}${relativePath}${colors.reset} (${violations.length} violation${violations.length !== 1 ? 's' : ''})\n`);

    violations.forEach(v => {
      console.log(formatViolation(v, filePath));
    });
  });

  // Summary
  console.log(`${colors.bold}Summary:${colors.reset}`);
  console.log(`  Files scanned: ${stats.filesScanned}`);
  console.log(`  Files with violations: ${Object.keys(stats.byFile).length}`);
  console.log(`  ${colors.red}Errors: ${stats.violations.error}${colors.reset}`);
  console.log(`  ${colors.yellow}Warnings: ${stats.violations.warning}${colors.reset}`);
  console.log(`  Total violations: ${allViolations.length}\n`);

  // Recommendations
  console.log(`${colors.bold}Next Steps:${colors.reset}`);
  console.log(`  1. Review violations above`);
  console.log(`  2. Update specs to use canonical terminology from TERMINOLOGY_GLOSSARY.md`);
  console.log(`  3. Run validator again to verify fixes\n`);

  return stats.violations.error > 0 ? 1 : 0;
}

// Run validator
const exitCode = validate();
process.exit(exitCode);

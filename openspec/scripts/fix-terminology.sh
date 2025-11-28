#!/bin/bash

# Script to fix terminology violations in OpenSpec files
# Based on TERMINOLOGY_GLOSSARY.md canonical standards

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SPECS_DIR="E:/Projects/megamek-web/openspec/specs"
LOG_FILE="E:/Projects/megamek-web/openspec/scripts/terminology-fixes.log"

echo "Terminology Violation Fixes" > "$LOG_FILE"
echo "============================" >> "$LOG_FILE"
echo "Date: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

total_files=0
total_changes=0

# Function to fix a file
fix_file() {
    local file="$1"
    local filename=$(basename "$file")
    local dir=$(dirname "$file" | sed "s|$SPECS_DIR/||")

    echo -e "${BLUE}Processing:${NC} $dir/$(basename $file)"
    echo "File: $dir/$(basename $file)" >> "$LOG_FILE"

    local changes=0

    # Create backup
    cp "$file" "$file.bak"

    # Fix 1: "technology base" → "tech base" (case-insensitive, preserve case)
    # First handle "Technology base" (capital T)
    if grep -qi "Technology base" "$file"; then
        sed -i 's/Technology base/Tech base/g' "$file"
        local count=$(grep -c "Tech base" "$file" || true)
        changes=$((changes + count))
        echo "  - Fixed: Technology base → Tech base ($count instances)" >> "$LOG_FILE"
    fi

    # Then handle "technology base" (lowercase t)
    if grep -q "technology base" "$file"; then
        sed -i 's/technology base/tech base/g' "$file"
        local count=$(grep -c "tech base" "$file" || true)
        changes=$((changes + count))
        echo "  - Fixed: technology base → tech base ($count instances)" >> "$LOG_FILE"
    fi

    # Fix 2: "complexity level" → "rules level"
    if grep -qi "complexity level" "$file"; then
        # Preserve capitalization
        sed -i 's/Complexity level/Rules level/g' "$file"
        sed -i 's/complexity level/rules level/g' "$file"
        local count=$(grep -c "rules level" "$file" || true)
        changes=$((changes + count))
        echo "  - Fixed: complexity level → rules level ($count instances)" >> "$LOG_FILE"
    fi

    # Fix 3: "Tournament" → "Advanced" (rules level context only)
    # This is tricky - need to preserve "tournament-legal" and "tournament legality"
    # Only replace "Tournament Legality" in specific contexts
    if grep -q "Tournament Legality" "$file"; then
        sed -i 's/Tournament Legality/Advanced Rules Legality/g' "$file"
        changes=$((changes + 1))
        echo "  - Fixed: Tournament Legality → Advanced Rules Legality" >> "$LOG_FILE"
    fi

    # Fix "VAL-RULES-002: Tournament Legality" heading
    if grep -q "VAL-RULES-002: Tournament Legality" "$file"; then
        sed -i 's/VAL-RULES-002: Tournament Legality/VAL-RULES-002: Advanced Rules Legality/g' "$file"
        changes=$((changes + 1))
        echo "  - Fixed: VAL-RULES-002 heading" >> "$LOG_FILE"
    fi

    # Fix 4: Property name "slots:" → "criticalSlots:" in code blocks
    if grep -q "^\s*slots:" "$file"; then
        sed -i 's/^\(\s*\)slots:/\1criticalSlots:/g' "$file"
        local count=$(grep -c "criticalSlots:" "$file" || true)
        changes=$((changes + 1))
        echo "  - Fixed: property 'slots:' → 'criticalSlots:' ($count total instances)" >> "$LOG_FILE"
    fi

    # Fix 5: "Gyroscope" → "gyro" in tech-base-rules-matrix
    if [[ "$file" == *"tech-base-rules-matrix"* ]]; then
        if grep -q "Gyroscope specifications" "$file"; then
            sed -i 's/Gyroscope specifications/Gyro specifications/g' "$file"
            changes=$((changes + 1))
            echo "  - Fixed: Gyroscope specifications → Gyro specifications" >> "$LOG_FILE"
        fi
    fi

    # Fix 6: "Additional Heat Sinks" → "External Heat Sinks" in validation-rules-master
    if [[ "$file" == *"validation-rules-master"* ]]; then
        if grep -q "Additional Heat Sinks" "$file"; then
            sed -i 's/Additional Heat Sinks/External Heat Sinks/g' "$file"
            local count=$(grep -c "External Heat Sinks" "$file" || true)
            changes=$((changes + count))
            echo "  - Fixed: Additional Heat Sinks → External Heat Sinks ($count instances)" >> "$LOG_FILE"
        fi

        # Fix "Verify" → "Validate"
        if grep -q "Verify era classification" "$file"; then
            sed -i 's/Verify era classification/Validate era classification/g' "$file"
            changes=$((changes + 1))
            echo "  - Fixed: Verify era classification → Validate era classification" >> "$LOG_FILE"
        fi
    fi

    if [ $changes -gt 0 ]; then
        echo -e "${GREEN}  ✓${NC} Fixed $changes violations"
        echo "  Total changes in file: $changes" >> "$LOG_FILE"
        total_changes=$((total_changes + changes))
    else
        echo -e "${YELLOW}  -${NC} No violations found"
        echo "  No changes needed" >> "$LOG_FILE"
        # Restore from backup since no changes
        mv "$file.bak" "$file"
    fi

    echo "" >> "$LOG_FILE"
    total_files=$((total_files + 1))
}

# Find and fix all spec.md files
echo -e "${BLUE}Fixing terminology violations in OpenSpec files...${NC}\n"

while IFS= read -r file; do
    fix_file "$file"
done < <(find "$SPECS_DIR" -name "spec.md" | sort)

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}Summary:${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "Files processed: ${BLUE}$total_files${NC}"
echo -e "Total violations fixed: ${GREEN}$total_changes${NC}"
echo -e "Log file: ${BLUE}$LOG_FILE${NC}"
echo ""
echo "Summary:" >> "$LOG_FILE"
echo "========" >> "$LOG_FILE"
echo "Files processed: $total_files" >> "$LOG_FILE"
echo "Total violations fixed: $total_changes" >> "$LOG_FILE"

echo -e "${YELLOW}Note: Backup files (.bak) created for changed files${NC}"
echo -e "${YELLOW}Review changes before committing${NC}"

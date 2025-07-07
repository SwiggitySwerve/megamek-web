#!/usr/bin/env node

/**
 * Backup Script for Component Name Refactor
 * 
 * This script creates a backup of the codebase before running the refactor
 * to ensure we can rollback if needed.
 * 
 * Usage: node scripts/backup-before-refactor.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function createBackup() {
  console.log('🔄 Creating backup before refactor...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `backup-before-refactor-${timestamp}`;
  
  try {
    // Create backup directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Copy all TypeScript/JavaScript files
    const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    const excludeDirs = ['node_modules', '.git', 'coverage', 'dist', 'build', 'playwright-report', '__mocks__', backupDir];
    
    function shouldExcludeFile(filePath) {
      return excludeDirs.some(dir => filePath.includes(dir));
    }
    
    function copyFilesRecursively(srcDir, destDir) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      const items = fs.readdirSync(srcDir);
      
      for (const item of items) {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          if (!shouldExcludeFile(srcPath)) {
            copyFilesRecursively(srcPath, destPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(srcPath).toLowerCase();
          if (fileExtensions.includes(ext) && !shouldExcludeFile(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }
    }
    
    copyFilesRecursively('.', backupDir);
    
    console.log(`✅ Backup created: ${backupDir}`);
    console.log('📝 Backup includes all TypeScript/JavaScript files');
    console.log('🔄 You can now safely run the refactor script');
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

// Run the backup
if (require.main === module) {
  createBackup();
}

module.exports = { createBackup }; 
#!/usr/bin/env node
/**
 * Test Build Script
 * 
 * Mimics the CI build process locally to test electron-builder configuration
 * without waiting for CI. This helps iterate faster on build issues.
 * 
 * Usage:
 *   node scripts/test-build.js [platform]
 *   npm run test:build [platform]
 * 
 * Platforms: win, mac, linux (defaults to current platform)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PLATFORM = process.argv[2] || process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'mac' : 'linux';

console.log('🧪 Testing Electron build locally...\n');
console.log(`Platform: ${PLATFORM}\n`);

const desktopDir = path.join(__dirname, '..');
const rootDir = path.join(desktopDir, '..');

// Step 1: Build Next.js application
console.log('📦 Step 1: Building Next.js application...');
try {
  execSync('npm run build', { 
    cwd: rootDir, 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Next.js build complete\n');
} catch (error) {
  console.error('❌ Next.js build failed');
  process.exit(1);
}

// Step 2: Build Electron TypeScript
console.log('🔨 Step 2: Building Electron TypeScript...');
try {
  execSync('npm run build', { 
    cwd: desktopDir, 
    stdio: 'inherit' 
  });
  console.log('✅ Electron TypeScript build complete\n');
} catch (error) {
  console.error('❌ Electron TypeScript build failed');
  process.exit(1);
}

// Step 3: Verify build outputs exist
console.log('🔍 Step 3: Verifying build outputs...');
const mainJsPath = path.join(desktopDir, 'dist', 'electron', 'main.js');
if (!fs.existsSync(mainJsPath)) {
  console.error(`❌ Main entry file not found: ${mainJsPath}`);
  process.exit(1);
}
console.log('✅ Build outputs verified\n');

// Step 4: Test electron-builder (dry run or actual build)
console.log(`🚀 Step 4: Testing electron-builder for ${PLATFORM}...`);
const distCommand = `npm run dist:${PLATFORM}`;

try {
  // Use --dir flag for faster testing (doesn't create installer, just unpacks)
  const testCommand = distCommand.replace('dist:', 'pack');
  console.log(`Running: ${testCommand} (pack mode for faster testing)\n`);
  
  execSync(testCommand, { 
    cwd: desktopDir, 
    stdio: 'inherit',
    env: { 
      ...process.env,
      // Prevent publishing during test
      CI: 'false',
      // Use test tag to avoid conflicts
      ELECTRON_BUILDER_CACHE: path.join(desktopDir, '.electron-cache')
    }
  });
  
  console.log('\n✅ Build test complete!');
  console.log(`\n📁 Output location: ${path.join(desktopDir, 'release')}`);
  console.log('\n💡 To create a full installer, run:');
  console.log(`   cd desktop && npm run dist:${PLATFORM}`);
  
} catch (error) {
  console.error('\n❌ electron-builder test failed');
  console.error('\nCommon issues:');
  console.error('  - Missing LICENSE file (should be at ../LICENSE)');
  console.error('  - Icon files missing (currently optional)');
  console.error('  - Path configuration issues in electron-builder.yml');
  process.exit(1);
}

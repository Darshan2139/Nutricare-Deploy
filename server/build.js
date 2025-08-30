import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 Building server for deployment...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy all files to dist
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      // Skip TypeScript files, we'll compile them
      if (!file.endsWith('.ts')) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Copy non-TypeScript files
copyDirectory('.', 'dist');

// Compile TypeScript files
try {
  execSync('npx tsc --project tsconfig.json --outDir dist', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.error('❌ TypeScript compilation failed:', error.message);
  process.exit(1);
}

// Copy package.json to dist
fs.copyFileSync('package.json', 'dist/package.json');

console.log('✅ Server build complete!');
console.log('📁 Build output: dist/');

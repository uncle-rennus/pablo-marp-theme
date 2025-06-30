#!/usr/bin/env node

const sass = require('sass');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  inputDir: './themes',
  outputDir: './themes',
  sourceMap: false,
  style: 'compressed'
};

// Theme files to build
const themeFiles = [
  'card-theme.scss',
  'light-theme.scss',
  'custom-theme.scss'
];

// Build function
function buildTheme(inputFile) {
  const outputFile = inputFile.replace('.scss', '.css');
  const inputPath = path.join(config.inputDir, inputFile);
  const outputPath = path.join(config.outputDir, outputFile);
  
  try {
    console.log(`🔄 Compiling ${inputFile}...`);
    
    const result = sass.compile(inputPath, {
      style: config.style,
      sourceMap: config.sourceMap,
      loadPaths: [config.inputDir]
    });
    
    fs.writeFileSync(outputPath, result.css);
    
    if (result.sourceMap) {
      fs.writeFileSync(outputPath + '.map', JSON.stringify(result.sourceMap));
    }
    
    console.log(`✅ ${inputFile} compiled successfully!`);
    console.log(`📁 Output: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Compilation failed for ${inputFile}:`, error.message);
    return false;
  }
  
  return true;
}

// Build all themes
function buildAllThemes() {
  console.log('🎨 Building all themes...\n');
  
  let successCount = 0;
  let totalCount = themeFiles.length;
  
  themeFiles.forEach(themeFile => {
    if (fs.existsSync(path.join(config.inputDir, themeFile))) {
      if (buildTheme(themeFile)) {
        successCount++;
      }
    } else {
      console.log(`⚠️  Skipping ${themeFile} (file not found)`);
    }
  });
  
  console.log(`\n📊 Build Summary: ${successCount}/${totalCount} themes compiled successfully`);
  
  if (successCount < totalCount) {
    process.exit(1);
  }
}

// Watch function for development
function watchTheme() {
  console.log('👀 Watching for changes...');
  
  fs.watch(config.inputDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.scss')) {
      console.log(`🔄 File changed: ${filename}`);
      
      // Build the specific file that changed
      if (fs.existsSync(path.join(config.inputDir, filename))) {
        buildTheme(filename);
      }
    }
  });
}

// CLI handling
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'watch':
  case '--watch':
  case '-w':
    buildAllThemes();
    watchTheme();
    break;
    
  case 'build':
  case '--build':
  case '-b':
  default:
    buildAllThemes();
    break;
    
  case 'help':
  case '--help':
  case '-h':
    console.log(`
Theme Builder for Marpit Card Theme

Usage:
  node build-theme.js [command]

Commands:
  build, -b     Build all themes once (default)
  watch, -w     Build all themes and watch for changes
  help, -h      Show this help

Themes to build:
${themeFiles.map(file => `  - ${file}`).join('\n')}

Examples:
  node build-theme.js
  node build-theme.js watch
  node build-theme.js --help
    `);
    break;
} 
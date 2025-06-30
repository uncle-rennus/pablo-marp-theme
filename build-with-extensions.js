#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Marpit } = require('@marp-team/marpit');
const { createMarpitWithExtensions } = require('./marpit-extensions');

// Configuration
const config = {
  inputFile: './zappts-AI-as-a-service.md',
  outputFile: './zappts-AI-as-a-service.html',
  theme: 'card-theme'
};

// Create Marpit instance with custom extensions
const marpit = createMarpitWithExtensions();

// Load theme
const themePath = path.join(__dirname, 'themes', `${config.theme}.css`);
if (fs.existsSync(themePath)) {
  const theme = fs.readFileSync(themePath, 'utf8');
  marpit.themeSet.add(theme);
}

// Build function
function buildPresentation() {
  try {
    console.log('🔄 Building presentation with custom extensions...');
    
    // Read markdown file
    const markdown = fs.readFileSync(config.inputFile, 'utf8');
    
    // Render with extensions
    const result = marpit.render(markdown);
    
    // Write HTML file
    fs.writeFileSync(config.outputFile, result.html);
    
    console.log('✅ Presentation built successfully!');
    console.log(`📁 Output: ${config.outputFile}`);
    console.log(`🌐 View at: http://localhost:3000/${path.basename(config.outputFile)}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Watch function
function watchPresentation() {
  console.log('👀 Watching for changes...');
  
  fs.watch('.', { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.md') || filename.endsWith('.scss'))) {
      console.log(`🔄 File changed: ${filename}`);
      
      if (filename.endsWith('.md')) {
        buildPresentation();
      } else if (filename.endsWith('.scss')) {
        // Rebuild themes first
        require('./build-theme.js');
        buildPresentation();
      }
    }
  });
}

// CLI handling
const command = process.argv[2];

switch (command) {
  case 'watch':
  case '-w':
    watchPresentation();
    break;
    
  case 'help':
  case '-h':
    console.log(`
Usage: node build-with-extensions.js [command]

Commands:
  build, -b     Build presentation once (default)
  watch, -w     Build and watch for changes
  help, -h      Show this help
    `);
    break;
    
  default:
    buildPresentation();
} 
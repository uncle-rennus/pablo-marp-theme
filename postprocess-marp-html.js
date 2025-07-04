#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

process.stdout.setEncoding('utf8');

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    input: null,
    output: null,
    help: false,
    noBackup: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      config.help = true;
    } else if (arg === '--input' || arg === '-i') {
      config.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      config.output = args[++i];
    } else if (arg === '--no-backup') {
      config.noBackup = true;
    } else if (!arg.startsWith('-')) {
      // First positional argument is input file
      if (!config.input) {
        config.input = arg;
      } else if (!config.output) {
        config.output = arg;
      }
    }
  }

  return config;
}

// Show help text
function showHelp() {
  console.log(`
Post-process Marp HTML for markdown-in-divs support

Usage: node postprocess-marp-html.js [options] [input] [output]

Options:
  -i, --input <file>    Input HTML file to process
  -o, --output <file>   Output HTML file (defaults to input file)
  --no-backup          Skip backup creation (not recommended)
  -h, --help           Show this help

Examples:
  node postprocess-marp-html.js presentation.html
  node postprocess-marp-html.js -i input.html -o output.html
  node postprocess-marp-html.js input.html processed.html

If no arguments are provided, defaults to: output/zappts-AI-as-a-service.html

Safety Features:
  - Creates backup of original file before processing
  - Uses atomic file operations to prevent corruption
  - Validates processed content before saving
  - Restores from backup on failure
  `);
}

// Validate file paths and permissions
function validateInput(inputFile) {
  try {
    // Check if file exists
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    // Check if file is readable
    fs.accessSync(inputFile, fs.constants.R_OK);
    
    // Check file extension
    if (!inputFile.toLowerCase().endsWith('.html')) {
      console.warn(`⚠️  Warning: Input file doesn't have .html extension: ${inputFile}`);
    }

    // Check file size (warn if very large)
    const stats = fs.statSync(inputFile);
    const sizeInMB = stats.size / (1024 * 1024);
    if (sizeInMB > 10) {
      console.warn(`⚠️  Warning: Large file detected (${sizeInMB.toFixed(1)}MB): ${inputFile}`);
    }

    return true;
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new Error(`Permission denied: Cannot read ${inputFile}`);
    }
    throw error;
  }
}

// Validate output directory and permissions
function validateOutput(outputFile) {
  try {
    const outputDir = path.dirname(outputFile);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }

    // Check if we can write to the output directory
    fs.accessSync(outputDir, fs.constants.W_OK);
    
    return true;
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new Error(`Permission denied: Cannot write to ${path.dirname(outputFile)}`);
    }
    throw error;
  }
}

// Create backup of original file
function createBackup(filePath, noBackup = false) {
  if (noBackup) {
    console.log('⚠️  Skipping backup creation (--no-backup flag used)');
    return null;
  }

  try {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`💾 Created backup: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.warn(`⚠️  Failed to create backup: ${error.message}`);
    return null;
  }
}

// Validate processed HTML content
function validateProcessedContent(html, originalHtml) {
  try {
    // Basic validation: ensure we have some content
    if (!html || html.trim().length === 0) {
      throw new Error('Processed content is empty');
    }

    // Check if HTML structure is still intact
    if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
      console.warn('⚠️  Warning: Processed content may not be valid HTML');
    }

    // Check if content length is reasonable (not too short or too long)
    const originalLength = originalHtml.length;
    const processedLength = html.length;
    const ratio = processedLength / originalLength;

    if (ratio < 0.5) {
      throw new Error(`Processed content is too short (${Math.round(ratio * 100)}% of original)`);
    }

    if (ratio > 3) {
      console.warn(`⚠️  Warning: Processed content is much larger (${Math.round(ratio * 100)}% of original)`);
    }

    return true;
  } catch (error) {
    throw new Error(`Content validation failed: ${error.message}`);
  }
}

// Atomic file write operation
function atomicWrite(filePath, content) {
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  
  try {
    // Write to temporary file first
    fs.writeFileSync(tempPath, content, 'utf8');
    
    // Validate the temporary file
    const writtenContent = fs.readFileSync(tempPath, 'utf8');
    if (writtenContent !== content) {
      throw new Error('Content verification failed after write');
    }
    
    // Atomically replace the original file
    fs.renameSync(tempPath, filePath);
    
    return true;
  } catch (error) {
    // Clean up temporary file on error
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (cleanupError) {
      console.warn(`⚠️  Failed to clean up temporary file: ${cleanupError.message}`);
    }
    throw error;
  }
}

// Restore from backup
function restoreFromBackup(backupPath, targetPath) {
  if (!backupPath || !fs.existsSync(backupPath)) {
    console.error('❌ No valid backup available for restoration');
    return false;
  }

  try {
    fs.copyFileSync(backupPath, targetPath);
    console.log(`🔄 Restored from backup: ${backupPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to restore from backup: ${error.message}`);
    return false;
  }
}

// Clean up backup files (optional)
function cleanupBackup(backupPath, keepBackup = false) {
  if (!backupPath || keepBackup) {
    return;
  }

  try {
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      console.log(`🧹 Cleaned up backup: ${backupPath}`);
    }
  } catch (error) {
    console.warn(`⚠️  Failed to clean up backup: ${error.message}`);
  }
}

// Main processing function with atomic operations
function processHtmlFile(inputFile, outputFile, options = {}) {
  let backupPath = null;
  let tempPath = null;

  try {
    console.log(`📝 Processing: ${inputFile}`);
    
    // Step 1: Validate input
    validateInput(inputFile);
    
    // Step 2: Validate output
    validateOutput(outputFile);
    
    // Step 3: Create backup (unless disabled)
    backupPath = createBackup(inputFile, options.noBackup);
    
    // Step 4: Read original content
    const originalHtml = fs.readFileSync(inputFile, 'utf8');
    
    // Step 5: Process content
    const md = new MarkdownIt({ html: true, linkify: true });
    let processedHtml = originalHtml;

    // Process <div class="sources">...</div>
    processedHtml = processedHtml.replace(/<div class="sources">([\s\S]*?)<\/div>/g, (match, content) => {
      // Remove leading/trailing whitespace
      const inner = content.trim();
      // Render markdown
      const rendered = md.render(inner);
      // Return the rendered HTML within the sources div
      return `<div class="sources">${rendered}</div>`;
    });

    // Process <table>...</table> (if table markdown is present as raw text)
    // If you want to support markdown tables inside <table>...</table>,
    // you can add a similar block here. For now, we assume tables are already HTML.

    // Step 6: Validate processed content
    validateProcessedContent(processedHtml, originalHtml);
    
    // Step 7: Atomic write operation
    if (inputFile === outputFile) {
      // In-place editing: use atomic write
      atomicWrite(outputFile, processedHtml);
    } else {
      // Different output file: write directly
      fs.writeFileSync(outputFile, processedHtml, 'utf8');
    }

    // Step 8: Success message
    if (inputFile === outputFile) {
      console.log(`✅ Post-processed Marp HTML for markdown-in-divs: ${outputFile}`);
    } else {
      console.log(`✅ Post-processed Marp HTML saved to: ${outputFile}`);
    }
    
    // Step 9: Clean up backup (optional)
    cleanupBackup(backupPath, options.keepBackup);
    
  } catch (error) {
    console.error(`❌ Error processing file: ${error.message}`);
    
    // Attempt to restore from backup
    if (backupPath && inputFile === outputFile) {
      console.log('🔄 Attempting to restore from backup...');
      if (restoreFromBackup(backupPath, inputFile)) {
        console.log('✅ File restored successfully');
      } else {
        console.error('❌ Failed to restore file - manual intervention may be required');
      }
    }
    
    // Clean up temporary files
    if (tempPath && fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.warn(`⚠️  Failed to clean up temporary file: ${cleanupError.message}`);
      }
    }
    
    process.exit(1);
  }
}

// Main execution
function main() {
  const config = parseArgs();

  if (config.help) {
    showHelp();
    process.exit(0);
  }

  // Set defaults for backward compatibility
  const inputFile = config.input || path.join(__dirname, 'output', 'zappts-AI-as-a-service.html');
  const outputFile = config.output || inputFile;

  const options = {
    noBackup: config.noBackup,
    keepBackup: false // Could be made configurable in the future
  };

  processHtmlFile(inputFile, outputFile, options);
}

main();
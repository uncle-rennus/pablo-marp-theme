#!/usr/bin/env node

import fs from 'fs/promises';
import { PabloEnhancedPreprocessor } from './core/preprocessor.js';
import { ConfigManager } from './core/config-manager.js';

const args = process.argv.slice(2);

if (!args[0] || args.includes('--help')) {
  console.log(`📊 Pablo Pro - Enhanced Preprocessor

Usage: pablo-pro <input.md> [options]

Modes:
  --mode=smart    All features (default)
  --mode=table    Focus on tables
  --mode=cards    Focus on cards

Options:
  --output=FILE   Output file
  --max-rows=N    Max table rows per slide (6)
  --max-cols=N    Max table columns per slide (4)
  --max-lines=N   Max lines per card (20)
  --verbose, -v   Verbose output

Examples:
  pablo-pro input.md
  pablo-pro input.md --mode=table --max-rows=4
  pablo-pro input.md --output=result.md --verbose
`);
  process.exit(0);
}

const options = {
  input: args[0],
  output: args[0].replace(/\.md$/, '_processed.md'),
  mode: 'smart',
  verbose: false
};

for (const arg of args.slice(1)) {
  if (arg.startsWith('--output=')) options.output = arg.split('=')[1];
  else if (arg.startsWith('--mode=')) options.mode = arg.split('=')[1];
  else if (arg.startsWith('--max-rows=')) options.maxRows = parseInt(arg.split('=')[1]);
  else if (arg.startsWith('--max-cols=')) options.maxCols = parseInt(arg.split('=')[1]);
  else if (arg.startsWith('--max-lines=')) options.maxLines = parseInt(arg.split('=')[1]);
  else if (arg === '--verbose' || arg === '-v') options.verbose = true;
}

try {
  console.log(`🚀 Processing: ${options.input}`);
  
  // Build config from CLI options
  let config = {};
  if (options.maxRows) config.tables = { maxRowsPerSlide: options.maxRows };
  if (options.maxCols) config.tables = { ...config.tables, maxColumnsPerSlide: options.maxCols };
  if (options.maxLines) config.slides = { maxLinesPerCard: options.maxLines };
  
  config = ConfigManager.getConfigForMode(config, options.mode);
  
  const markdown = await fs.readFile(options.input, 'utf8');
  if (options.verbose) console.log(`✅ Read ${markdown.length} characters`);
  
  const preprocessor = new PabloEnhancedPreprocessor({ ...config, mode: options.mode });
  const processed = preprocessor.processMarkdown(markdown);
  
  await fs.writeFile(options.output, processed);
  console.log(`✅ Saved to ${options.output}`);
  
  if (options.verbose) {
    const stats = preprocessor.getStats();
    console.log('📊 Stats:', JSON.stringify(stats.processors, null, 2));
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  if (options.verbose) console.error(error.stack);
  process.exit(1);
}

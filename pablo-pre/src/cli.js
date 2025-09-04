#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { PabloSlideGenerator } from './slide-generator.js';

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('📊 Pablo Markdown Preprocessor');
  console.log('');
  console.log('Usage: node pablo-pre/src/cli.js <input.md> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output=FILE        Output file (default: input_processed.md)');
  console.log('  --config=FILE        Configuration file (default: pablo-pre.config.js)');
  console.log('');
  console.log('Examples:');
  console.log('  node pablo-pre/src/cli.js input.md');
  console.log('  node pablo-pre/src/cli.js input.md --output=processed.md');
  process.exit(1);
}

const inputFile = args[0];

const options = {
  output: inputFile.replace(/\.md$/, '_processed.md'),
  config: 'pablo-pre.config.js'
};

args.slice(1).forEach(arg => {
  if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1];
  } else if (arg.startsWith('--config=')) {
    options.config = arg.split('=')[1];
  }
});

async function run() {
  try {
    console.log('🚀 Starting Pablo preprocessing...');
    console.log(`📖 Input: ${inputFile}`);
    console.log(`📝 Output: ${options.output}`);

    let config = {};
    try {
      const configModule = await import(path.resolve(options.config));
      config = configModule.config;
      console.log(`⚙️  Using config file: ${options.config}`);
    } catch (e) {
      console.warn(`⚠️  Could not load config file: ${options.config}. Using default settings.`);
    }

    const markdown = await fs.readFile(inputFile, 'utf8');
    console.log(`✅ Read ${markdown.length} characters`);

    const generator = new PabloSlideGenerator(config);
    const processed = generator.processMarkdown(markdown);

    await fs.writeFile(options.output, processed);
    console.log(`✅ Processed markdown saved to ${options.output}`);

    console.log('\n🎉 Processing completed successfully!');

  } catch (error) {
    console.error('❌ Error during processing:', error.message);
    process.exit(1);
  }
}

run();

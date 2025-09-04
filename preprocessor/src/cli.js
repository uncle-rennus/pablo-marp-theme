#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { MarkdownPreprocessor } from './index.js';

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('📊 Unified Table Preprocessor for Markdown Presentations');
  console.log('');
  console.log('Usage: node unified-table-preprocessor.js <input.md> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output=FILE        Output file (default: input_processed.md)');
  console.log('  --pdf                Generate PDF after processing');
  console.log('  --html               Generate HTML after processing');
  console.log('  --theme=FILE         CSS theme file for PDF/HTML generation');
  console.log('  --max-rows=N         Max table rows per slide');
  console.log('  --max-cols=N         Max table columns per slide');
  console.log('  --min-font=N         Minimum font size');
  console.log('  --max-font=N         Maximum font size');
  console.log('  --mode=MODE          Processing mode: intelligent (default) or aggressive');
  console.log('  --no-optimize        Disable content optimization');
  console.log('  --no-css-classes     Disable CSS class generation');
  console.log('');
  console.log('Examples:');
  console.log('  node unified-table-preprocessor.js input.md');
  console.log('  node unified-table-preprocessor.js input.md --pdf --theme=theme.css');
  console.log('  node unified-table-preprocessor.js input.md --mode=aggressive');
  process.exit(1);
}

const inputFile = args[0];

const options = {
  output: inputFile.replace(/\.md$/, '_processed.md'),
  generatePdf: false,
  generateHtml: false,
  theme: 'responsive-table-theme.css',
  maxRowsPerSlide: undefined,
  maxColumnsPerSlide: undefined,
  minFontSize: undefined,
  maxFontSize: undefined,
  optimizeContent: true,
  addCSSClasses: true,
  mode: 'intelligent'
};

args.slice(1).forEach(arg => {
  if (arg.startsWith('--output=')) options.output = arg.split('=')[1];
  else if (arg === '--pdf') options.generatePdf = true;
  else if (arg === '--html') options.generateHtml = true;
  else if (arg.startsWith('--theme=')) options.theme = arg.split('=')[1];
  else if (arg.startsWith('--max-rows=')) options.maxRowsPerSlide = parseInt(arg.split('=')[1]);
  else if (arg.startsWith('--max-cols=')) options.maxColumnsPerSlide = parseInt(arg.split('=')[1]);
  else if (arg.startsWith('--min-font=')) options.minFontSize = parseInt(arg.split('=')[1]);
  else if (arg.startsWith('--max-font=')) options.maxFontSize = parseInt(arg.split('=')[1]);
  else if (arg === '--no-optimize') options.optimizeContent = false;
  else if (arg === '--no-css-classes') options.addCSSClasses = false;
  else if (arg.startsWith('--mode=')) options.mode = arg.split('=')[1];
});

async function run() {
  try {
    console.log('🚀 Starting unified table preprocessing...');
    console.log(`📖 Input: ${inputFile}`);
    console.log(`📝 Output: ${options.output}`);
    
    const markdown = await fs.readFile(inputFile, 'utf8');
    console.log(`✅ Read ${markdown.length} characters`);
    
    const preprocessor = new MarkdownPreprocessor(options);
    const processed = preprocessor.processMarkdown(markdown);
    
    await fs.writeFile(options.output, processed);
    console.log(`✅ Processed markdown saved to ${options.output}`);
    
    if (options.generatePdf || options.generateHtml) {
      console.log('🎨 Generating presentation files...');
      
      const outputDir = path.dirname(options.output);
      const baseName = path.basename(options.output, '.md');
      
      const themePath = path.join(outputDir, 'theme.css');
      try {
        await fs.access(options.theme);
        await fs.copyFile(options.theme, themePath);
        console.log(`📝 Theme copied: ${themePath}`);
      } catch (e) {
        // theme file does not exist
      }
      
      if (options.generatePdf) {
        const pdfFile = path.join(outputDir, `${baseName}.pdf`);
        const marpCmd = `npx marp "${options.output}" --theme "${themePath}" --pdf --output "${pdfFile}"`;
        console.log('📄 Generating PDF...');
        exec(marpCmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`✅ PDF created: ${pdfFile}`);
        });
      }
      
      if (options.generateHtml) {
        const htmlFile = path.join(outputDir, `${baseName}.html`);
        const marpCmd = `npx marp "${options.output}" --theme "${themePath}" --html --output "${htmlFile}"`;
        console.log('🌐 Generating HTML...');
        exec(marpCmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`✅ HTML created: ${htmlFile}`);
        });
      }
    }
    
    console.log('\n🎉 Processing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during processing:', error.message);
    process.exit(1);
  }
}

run();
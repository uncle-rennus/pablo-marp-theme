#!/usr/bin/env node

/**
 * Enhanced Build Script for Pablo Presentations
 * Demonstrates integration with the new pablo-pro preprocessor
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

const projectRoot = process.cwd();

// Configuration for enhanced build
const buildConfig = {
  preprocessor: {
    enabled: true,
    mode: 'smart', // smart, table, cards, legacy-table, simple-card
    options: {
      maxRows: 6,
      maxCols: 4,
      maxLines: 20,
      optimizeContent: true
    }
  },
  theme: {
    source: 'themes/zappts-theme.scss',
    output: 'output/themes/zappts-theme.css'
  },
  assets: {
    source: 'themes/assets',
    output: 'output/assets'
  },
  marp: {
    options: ['--html', '--allow-local-files'],
    theme: 'output/themes/zappts-theme.css'
  }
};

/**
 * Enhanced build pipeline
 */
class EnhancedPabloBuilder {
  constructor(config = buildConfig) {
    this.config = config;
  }

  async build(inputFile, options = {}) {
    console.log('🚀 Enhanced Pablo Build Pipeline Starting...');
    console.log(`📖 Input: ${inputFile}`);

    const steps = [
      'buildTheme',
      'copyAssets', 
      'preprocessMarkdown',
      'generatePresentation'
    ];

    for (const step of steps) {
      try {
        await this[step](inputFile, options);
      } catch (error) {
        console.error(`❌ Build step '${step}' failed:`, error.message);
        throw error;
      }
    }

    console.log('🎉 Enhanced build completed successfully!');
  }

  async buildTheme() {
    console.log('🎨 Building theme...');
    
    const sassCommand = [
      'npx', 'sass',
      this.config.theme.source,
      this.config.theme.output,
      '--no-source-map'
    ];

    await this.runCommand(sassCommand);
    console.log(`✅ Theme built: ${this.config.theme.output}`);
  }

  async copyAssets() {
    console.log('📁 Copying assets...');
    
    try {
      await fs.access(this.config.assets.source);
      
      // Ensure output directory exists
      await fs.mkdir(this.config.assets.output, { recursive: true });
      
      // Copy assets (simple implementation - in practice, use a proper copy utility)
      const copyCommand = process.platform === 'win32' 
        ? ['xcopy', this.config.assets.source, this.config.assets.output, '/E', '/I', '/Y']
        : ['cp', '-r', this.config.assets.source + '/.', this.config.assets.output];
      
      await this.runCommand(copyCommand);
      console.log(`✅ Assets copied to: ${this.config.assets.output}`);
    } catch (error) {
      console.warn('⚠️  Assets directory not found, skipping asset copy');
    }
  }

  async preprocessMarkdown(inputFile, options) {
    if (!this.config.preprocessor.enabled) {
      console.log('⏭️  Preprocessing disabled, skipping...');
      return inputFile;
    }

    console.log('📝 Preprocessing markdown with enhanced preprocessor...');
    
    const outputFile = inputFile.replace(/\.md$/, '.processed.md');
    const { mode, options: preprocessorOptions } = this.config.preprocessor;

    // Build pablo-pro command
    const preprocessCommand = [
      'node', './pablo-pro/src/cli.js',
      inputFile,
      `--mode=${mode}`,
      `--output=${outputFile}`,
      `--theme=${this.config.marp.theme}`
    ];

    // Add options
    if (preprocessorOptions.maxRows) {
      preprocessCommand.push(`--max-rows=${preprocessorOptions.maxRows}`);
    }
    if (preprocessorOptions.maxCols) {
      preprocessCommand.push(`--max-cols=${preprocessorOptions.maxCols}`);
    }
    if (preprocessorOptions.maxLines) {
      preprocessCommand.push(`--max-lines=${preprocessorOptions.maxLines}`);
    }
    if (preprocessorOptions.optimizeContent) {
      preprocessCommand.push('--optimize-content');
    }

    await this.runCommand(preprocessCommand);
    console.log(`✅ Markdown preprocessed: ${outputFile}`);
    return outputFile;
  }

  async generatePresentation(inputFile, options = {}) {
    const processedFile = await this.preprocessMarkdown(inputFile, options);
    const outputFile = processedFile.replace(/\.md$/, '.html');

    console.log('🎬 Generating presentation...');

    const marpCommand = [
      'npx', '@marp-team/marp-cli',
      processedFile,
      `--theme=${this.config.marp.theme}`,
      `--output=${outputFile}`,
      ...this.config.marp.options
    ];

    // Add format-specific options
    if (options.pdf) {
      marpCommand.push('--pdf');
      const pdfFile = outputFile.replace(/\.html$/, '.pdf');
      marpCommand[marpCommand.length - 1] = `--output=${pdfFile}`;
      console.log(`📄 Generating PDF: ${pdfFile}`);
    } else {
      console.log(`🌐 Generating HTML: ${outputFile}`);
    }

    await this.runCommand(marpCommand);
    console.log('✅ Presentation generated successfully!');

    return options.pdf ? outputFile.replace(/\.html$/, '.pdf') : outputFile;
  }

  async serve(inputFile, port = 8080) {
    console.log(`🚀 Starting enhanced development server on port ${port}...`);
    
    // First, do a quick build
    await this.buildTheme();
    await this.copyAssets();
    
    // Preprocess the file
    const processedFile = await this.preprocessMarkdown(inputFile);
    
    // Start Marp server
    const serverCommand = [
      'npx', '@marp-team/marp-cli',
      processedFile,
      `--theme=${this.config.marp.theme}`,
      '--server',
      `--port=${port}`,
      ...this.config.marp.options
    ];

    console.log(`   Access at: http://localhost:${port}`);
    await this.runCommand(serverCommand, { detached: true });
  }

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command;
      const proc = spawn(cmd, args, { 
        stdio: options.detached ? 'ignore' : 'inherit',
        shell: true,
        ...options
      });

      if (options.detached) {
        proc.unref();
        resolve();
        return;
      }

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}: ${command.join(' ')}`));
        }
      });

      proc.on('error', reject);
    });
  }
}

// CLI interface for the enhanced builder
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📊 Enhanced Pablo Build System

Usage:
  node build-enhanced.js <input.md> [options]

Options:
  --mode=MODE          Preprocessing mode (smart, table, cards)
  --pdf               Generate PDF instead of HTML
  --serve             Start development server
  --port=PORT         Server port (default: 8080)
  --theme-only        Build theme only
  --no-preprocess     Skip preprocessing step

Examples:
  node build-enhanced.js presentation.md
  node build-enhanced.js presentation.md --pdf --mode=smart
  node build-enhanced.js presentation.md --serve --port=3000
  node build-enhanced.js --theme-only
`);
    return;
  }

  const inputFile = args[0];
  const options = {
    mode: 'smart',
    pdf: false,
    serve: false,
    port: 8080,
    themeOnly: false,
    noPreprocess: false
  };

  // Parse command line arguments
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--mode=')) {
      options.mode = arg.split('=')[1];
    } else if (arg === '--pdf') {
      options.pdf = true;
    } else if (arg === '--serve') {
      options.serve = true;
    } else if (arg.startsWith('--port=')) {
      options.port = parseInt(arg.split('=')[1]);
    } else if (arg === '--theme-only') {
      options.themeOnly = true;
    } else if (arg === '--no-preprocess') {
      options.noPreprocess = true;
    }
  }

  const builder = new EnhancedPabloBuilder({
    ...buildConfig,
    preprocessor: {
      ...buildConfig.preprocessor,
      enabled: !options.noPreprocess,
      mode: options.mode
    }
  });

  try {
    if (options.themeOnly) {
      await builder.buildTheme();
      await builder.copyAssets();
    } else if (options.serve) {
      await builder.serve(inputFile, options.port);
    } else {
      await builder.build(inputFile, options);
    }
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Handle when this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { EnhancedPabloBuilder };

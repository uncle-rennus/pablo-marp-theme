/**
 * File Watcher - Development mode with file watching
 */
import chokidar from 'chokidar';
import { PabloEnhancedPreprocessor } from '../core/preprocessor.js';
import { ConfigManager } from '../core/config-manager.js';
import fs from 'fs/promises';

export class FileWatcher {
  constructor(options = {}) {
    this.options = options;
    this.watcher = null;
    this.isProcessing = false;
  }

  async watch(inputFile, outputFile, config) {
    console.log(`👀 Watching ${inputFile} for changes...`);
    console.log(`📝 Will save to ${outputFile}`);
    
    this.watcher = chokidar.watch(inputFile, {
      ignoreInitial: false,
      persistent: true
    });

    this.watcher.on('change', async () => {
      if (this.isProcessing) return;
      
      this.isProcessing = true;
      try {
        console.log(`📁 File changed, reprocessing...`);
        await this.processFile(inputFile, outputFile, config);
        console.log(`✅ Updated ${outputFile}`);
      } catch (error) {
        console.error('❌ Error during reprocessing:', error.message);
      } finally {
        this.isProcessing = false;
      }
    });

    // Initial processing
    await this.processFile(inputFile, outputFile, config);
  }

  async processFile(inputFile, outputFile, config) {
    const markdown = await fs.readFile(inputFile, 'utf8');
    const preprocessor = new PabloEnhancedPreprocessor(config);
    const processed = preprocessor.processMarkdown(markdown);
    await fs.writeFile(outputFile, processed);
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('🛑 Stopped watching files');
    }
  }
}

/**
 * Batch Processor - Process multiple files at once
 */
import fs from 'fs/promises';
import path from 'path';
import { PabloEnhancedPreprocessor } from '../core/preprocessor.js';

export class BatchProcessor {
  constructor(config = {}) {
    this.config = config;
  }

  async processFiles(inputFiles, outputDir = './processed') {
    console.log(`📦 Batch processing ${inputFiles.length} files...`);
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    const results = [];
    const preprocessor = new PabloEnhancedPreprocessor(this.config);
    
    for (const inputFile of inputFiles) {
      try {
        console.log(`🚀 Processing: ${inputFile}`);
        
        const markdown = await fs.readFile(inputFile, 'utf8');
        const processed = preprocessor.processMarkdown(markdown);
        
        const fileName = path.basename(inputFile, '.md');
        const outputFile = path.join(outputDir, `${fileName}_processed.md`);
        
        await fs.writeFile(outputFile, processed);
        
        results.push({ inputFile, outputFile, success: true });
        console.log(`✅ Saved: ${outputFile}`);
        
      } catch (error) {
        results.push({ inputFile, error: error.message, success: false });
        console.error(`❌ Failed: ${inputFile} - ${error.message}`);
      }
    }
    
    console.log(`📊 Batch complete: ${results.filter(r => r.success).length}/${results.length} succeeded`);
    return results;
  }

  async findMarkdownFiles(directory = '.', pattern = '*.md') {
    const files = [];
    
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const subFiles = await this.findMarkdownFiles(fullPath, pattern);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read directory ${directory}: ${error.message}`);
    }
    
    return files;
  }
}

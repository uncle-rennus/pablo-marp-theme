/**
 * Enhanced Pablo Preprocessor - Main Controller
 * Combines card-based slide generation with intelligent table processing
 */

import { ContentOptimizer } from '../processors/content-optimizer.js';
import { IntelligentTableProcessor } from '../processors/table-processor.js';
import { SlideGenerator } from '../processors/slide-generator.js';
import { ConfigManager } from './config-manager.js';

export class PabloEnhancedPreprocessor {
  constructor(options = {}) {
    this.config = ConfigManager.createConfig(options);
    this.mode = options.mode || 'smart';
    
    // Initialize processors based on configuration
    this.contentOptimizer = new ContentOptimizer(this.config.contentOptimization);
    this.tableProcessor = new IntelligentTableProcessor(this.config.tables);
    this.slideGenerator = new SlideGenerator(this.config.slides);
  }

  /**
   * Main processing pipeline
   * @param {string} markdown - Input markdown content
   * @returns {string} - Processed markdown ready for Marp
   */
  processMarkdown(markdown) {
    console.log(`🚀 Processing with mode: ${this.mode}`);
    
    let processed = markdown;

    // Stage 1: Content Optimization
    if (this.config.contentOptimization.enabled) {
      console.log('📝 Optimizing content...');
      processed = this.contentOptimizer.optimize(processed);
    }

    // Stage 2: Table Processing (based on mode)
    if (this.shouldProcessTables()) {
      console.log('📊 Processing tables...');
      processed = this.tableProcessor.processMarkdown(processed);
    }

    // Stage 3: Slide Generation (based on mode)  
    if (this.shouldGenerateCards()) {
      console.log('🃏 Generating card-based slides...');
      processed = this.slideGenerator.processMarkdown(processed);
    }

    return processed;
  }

  /**
   * Determine if table processing should be applied
   */
  shouldProcessTables() {
    return ['smart', 'table'].includes(this.mode);
  }

  /**
   * Determine if card-based slide generation should be applied
   */
  shouldGenerateCards() {
    return ['smart', 'cards'].includes(this.mode);
  }

  /**
   * Get processing statistics
   */
  getStats() {
    return {
      mode: this.mode,
      processors: {
        contentOptimization: this.config.contentOptimization.enabled,
        tableProcessing: this.shouldProcessTables(),
        slideGeneration: this.shouldGenerateCards()
      },
      config: this.config
    };
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(newOptions) {
    this.config = ConfigManager.mergeConfig(this.config, newOptions);
    
    // Reinitialize processors with new config
    this.contentOptimizer = new ContentOptimizer(this.config.contentOptimization);
    this.tableProcessor = new IntelligentTableProcessor(this.config.tables);
    this.slideGenerator = new SlideGenerator(this.config.slides);
  }
}

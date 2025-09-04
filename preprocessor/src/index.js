import { TableSplitter } from './strategies/intelligent-splitter.js';
import { AdaptiveTableProcessor } from './strategies/aggressive-processor.js';

export class MarkdownPreprocessor {
  constructor(options = {}) {
    this.mode = options.mode || 'intelligent';
    this.options = options;
    this.intelligent = new TableSplitter(options);
    this.aggressive = new AdaptiveTableProcessor(options);
  }

  processMarkdown(markdown) {
    if (this.mode === 'aggressive') {
      return this.aggressive.processMarkdown(markdown);
    } else {
      return this.intelligent.processMarkdown(markdown);
    }
  }
}

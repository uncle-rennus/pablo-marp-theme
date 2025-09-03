export class ConfigManager {
  static defaultConfig = {
    slides: { maxLinesPerCard: 20, autoSplitting: true },
    tables: { maxRowsPerSlide: 6, maxColumnsPerSlide: 4, preserveHeaders: true },
    contentOptimization: {
      enabled: true,
      rules: [
        { from: /HYPERFLOW SOLUCOES TECNOLOGICAS LTDA/g, to: 'HYPERFLOW' },
        { from: /Approximately USD/g, to: 'USD' },
        { from: /WITHIN APPROVED BUDGET/g, to: 'WITHIN BUDGET' },
        { from: /EXCEEDS APPROVED BUDGET/g, to: 'EXCEEDS BUDGET' }
      ]
    }
  };

  static createConfig(userOptions = {}) {
    return this.mergeConfig(this.defaultConfig, userOptions);
  }

  static mergeConfig(baseConfig, overrides) {
    const merged = JSON.parse(JSON.stringify(baseConfig));
    for (const [key, value] of Object.entries(overrides)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        merged[key] = this.mergeConfig(merged[key] || {}, value);
      } else {
        merged[key] = value;
      }
    }
    return merged;
  }

  /**
   * Get configuration for a specific mode
   */
  static getConfigForMode(baseConfig, mode) {
    const modeConfigs = {
      'smart': {
        // Use all features with balanced settings - best for most presentations
        tables: { ...baseConfig.tables, strategy: 'intelligent' },
        slides: { ...baseConfig.slides, autoSplitting: true },
        contentOptimization: { ...baseConfig.contentOptimization, enabled: true }
      },
      
      'table': {
        // Focus on advanced table processing with minimal card splitting
        tables: { ...baseConfig.tables, strategy: 'intelligent' },
        slides: { ...baseConfig.slides, autoSplitting: false, maxLinesPerCard: 1000 },
        contentOptimization: { ...baseConfig.contentOptimization, enabled: true }
      },
      
      'cards': {
        // Focus on card-based slide generation with basic table handling
        tables: { ...baseConfig.tables, strategy: 'intelligent', maxRowsPerSlide: 15 }, // More permissive table splitting
        slides: { ...baseConfig.slides, autoSplitting: true },
        contentOptimization: { ...baseConfig.contentOptimization, enabled: true }
      }
    };

    const modeConfig = modeConfigs[mode];
    if (modeConfig) {
      return this.mergeConfig(baseConfig, modeConfig);
    }

    return baseConfig;
  }

  /**
   * Export configuration to a file format
   */
  static exportConfig(config, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(config, null, 2);
      case 'js':
        return `export const config = ${JSON.stringify(config, null, 2)};`;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}

/**
 * Simple test runner for Pablo Pro
 */
import { PabloEnhancedPreprocessor, ConfigManager } from '../src/index.js';

const testMarkdown = `# Test Presentation

## Introduction
This is a test slide with some content.

## Table Test
| Name | Age | City |
|------|-----|------|
| John | 25 | NYC |
| Jane | 30 | LA |
| Bob | 35 | Chicago |

This slide has too much content for a single card. It should be split automatically when using card mode. Let me add more content to trigger the splitting behavior. This is line 1 of extra content. This is line 2 of extra content. This is line 3 of extra content. This is line 4 of extra content. This is line 5 of extra content. This is line 6 of extra content. This is line 7 of extra content. This is line 8 of extra content. This is line 9 of extra content. This is line 10 of extra content.

## Summary
Final slide.`;

async function runTests() {
  console.log('🧪 Running Pablo Pro Tests...\n');
  
  // Test 1: Smart mode
  console.log('Test 1: Smart mode');
  const config1 = ConfigManager.getConfigForMode({}, 'smart');
  const processor1 = new PabloEnhancedPreprocessor({ ...config1, mode: 'smart' });
  const result1 = processor1.processMarkdown(testMarkdown);
  console.log('✅ Smart mode completed');
  console.log(`📊 Output length: ${result1.length} chars\n`);
  
  // Test 2: Table mode
  console.log('Test 2: Table mode');
  const config2 = ConfigManager.getConfigForMode({}, 'table');
  const processor2 = new PabloEnhancedPreprocessor({ ...config2, mode: 'table' });
  const result2 = processor2.processMarkdown(testMarkdown);
  console.log('✅ Table mode completed');
  console.log(`📊 Output length: ${result2.length} chars\n`);
  
  // Test 3: Cards mode
  console.log('Test 3: Cards mode');
  const config3 = ConfigManager.getConfigForMode({}, 'cards');
  const processor3 = new PabloEnhancedPreprocessor({ ...config3, mode: 'cards' });
  const result3 = processor3.processMarkdown(testMarkdown);
  console.log('✅ Cards mode completed');
  console.log(`📊 Output length: ${result3.length} chars\n`);
  
  // Test 4: Config merging
  console.log('Test 4: Custom config');
  const customConfig = ConfigManager.createConfig({
    slides: { maxLinesPerCard: 5 },
    tables: { maxRowsPerSlide: 2 }
  });
  const processor4 = new PabloEnhancedPreprocessor(customConfig);
  const result4 = processor4.processMarkdown(testMarkdown);
  console.log('✅ Custom config completed');
  console.log(`📊 Output length: ${result4.length} chars\n`);
  
  console.log('🎉 All tests passed!');
}

runTests().catch(console.error);

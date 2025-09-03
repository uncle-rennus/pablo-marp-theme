# Preprocessor Systems Guide

## Overview

Pablo includes multiple preprocessor systems for different use cases:

1. **Current System** (`src/preprocessor/`) - Production system used by main build
2. **Enhanced System** (`pablo-pro/`) - Next-generation preprocessor with advanced features

## Current Preprocessor System

### Architecture

The current system uses a three-stage pipeline:

```
Source (.source.md) → Preprocessor → Marp → Post-processor → Final (.html)
       ↓                ↓             ↓            ↓
   Semantic        Chunked       Themed      Markdown-in-HTML
   Blocks          Slides        HTML        Processed
```

### Core Components

**PabloSlideGenerator** (`src/preprocessor/slide-generator.js`):
- Parses semantic blocks (headings, content sections, HTML elements)
- Chunks content into slides based on estimated height
- Extracts sources sections into HTML blocks
- Applies card classes for styling

**Configuration** (`pablo.config.js`):
```javascript
export const config = {
  maxLinesPerCard: 20,        // Slide height limit
  maxColumnsPerSlide: 4,      // Grid layout limits
  maxRowsPerSlide: 10,
  charsPerLine: 80,           // Height calculation basis
};
```

### Usage

```bash
# Full pipeline (recommended)
npm run build:presentation

# Individual stages
node build-presentation.js  # Preprocessing
npx marp processed.md       # Marp build
node postprocess-marp-html.js output.html  # Post-processing
```

## Enhanced Preprocessor System (pablo-pro)

### Architecture

The enhanced system provides a unified, modular architecture:

```
Input → Content Optimization → Table Processing → Slide Generation → Output
```

### Core Components

**Main Controller** (`pablo-pro/src/core/preprocessor.js`):
- Orchestrates all preprocessing stages
- Manages configuration and processing modes
- Provides unified API

**Processors**:
- **ContentOptimizer**: Text replacement and cleanup rules
- **IntelligentTableProcessor**: Smart table splitting and optimization
- **SlideGenerator**: Enhanced card-based slide generation

### Processing Modes

#### Smart Mode (Default)
- All features enabled with balanced settings
- Best for most presentations
- Combines table processing + slide generation + content optimization

#### Table Mode
- Focus on advanced table processing
- Minimal card splitting
- Optimizes tables for presentation display

#### Cards Mode  
- Focus on card-based slide generation
- Basic table handling
- Emphasizes content flow and readability

### Configuration

```javascript
// Enhanced config structure
{
  slides: { maxLinesPerCard: 20, autoSplitting: true },
  tables: { maxRowsPerSlide: 6, maxColumnsPerSlide: 4 },
  contentOptimization: {
    enabled: true,
    rules: [
      { from: /LONG_COMPANY_NAME/g, to: 'SHORT_NAME' }
    ]
  }
}
```

### Usage

```bash
# Smart processing (default)
pablo-pro input.md

# Table-focused processing
pablo-pro input.md --mode=table --max-rows=4

# Card-focused processing
pablo-pro input.md --mode=cards --max-lines=15

# Custom output with verbose stats
pablo-pro input.md --output=result.md --verbose
```

### Advanced Features

**File Watching**:
```bash
# Development mode with file watching
pablo-pro input.md --watch
```

**Batch Processing**:
```bash
# Process multiple files
pablo-pro *.md --batch --output-dir=./processed
```

## Migration Guide

### From Current to Enhanced System

The enhanced system is designed as a modern replacement for the current system:

1. **Similar API**: Basic usage remains the same
2. **Enhanced Features**: Better table handling, content optimization
3. **Modular Design**: Easy to extend and customize
4. **Performance**: Streamlined and efficient processing

### Integration Options

**Option 1: Gradual Migration**
- Use enhanced system for new presentations
- Keep current system for existing workflows
- Both systems can coexist

**Option 2: Full Migration**
- Replace build scripts to use pablo-pro
- Update package.json scripts
- Test thoroughly with existing content

## Best Practices

### Content Preparation
1. Use semantic markdown structure (proper heading hierarchy)
2. Keep slide content focused (avoid overly long slides)
3. Use HTML divs for special styling when needed
4. Include sources sections for references

### Table Optimization
1. Keep tables simple and focused
2. Use appropriate column/row limits for readability
3. Consider splitting large tables across multiple slides
4. Test table rendering on different screen sizes

### Theme Integration
1. Choose appropriate slide classes for content type
2. Test with target themes during development
3. Use consistent styling patterns across presentations
4. Leverage theme-specific features (proposal slides, emphasis blocks)

## Troubleshooting

### Common Issues

**Slide Breaks Not Working**:
- Check content length vs. maxLinesPerCard setting
- Verify heading hierarchy is correct
- Ensure proper markdown formatting

**Table Display Issues**:
- Verify table markdown syntax
- Check if tables exceed column/row limits
- Test with different processing modes

**Theme Styling Problems**:
- Ensure theme is properly compiled
- Check that slide classes are being applied
- Verify theme compatibility with content structure

### Debug Mode

```bash
# Enable verbose output for troubleshooting
pablo-pro input.md --verbose

# Check processing statistics
pablo-pro input.md --mode=smart --verbose
```

This will show detailed information about:
- Content optimization applied
- Table processing decisions
- Slide generation statistics
- Processing mode configuration

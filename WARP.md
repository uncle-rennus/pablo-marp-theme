# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This is a sophisticated Marpit-based presentation system with a three-stage processing pipeline that supports intelligent slide generation, markdown-in-HTML rendering, and automated content processing. The system transforms semantic markdown into professional presentations with multiple theme options and advanced layout capabilities.

## Build Pipeline

The presentation generation follows a three-stage pipeline:

### Primary Command
```bash
npm run build:presentation
```
This orchestrates all three stages automatically for the main presentation.

### Pipeline Stages
1. **Preprocess**: `node build-presentation.js` (runs `PabloSlideGenerator`)
   - Parses semantic blocks (headings, content sections, HTML elements)
   - Chunks content into slides based on estimated height
   - Extracts sources sections into HTML blocks
   - Applies card classes for styling

2. **Marp Build**: Marp converts processed markdown to HTML
   ```bash
   npx marp processed.md --output output/presentation.html --config-file marp.config.js --html --allow-local-files
   ```

3. **Post-process**: `node postprocess-marp-html.js output/presentation.html`
   - Processes markdown content within HTML elements using markdown-it
   - Creates backups and uses atomic file operations
   - Specifically targets `<div class="sources">` elements

## Architecture Overview

```
Source (.source.md) → Preprocessor → Marp → Post-processor → Final (.html)
       ↓                ↓             ↓            ↓
   Semantic        Chunked       Themed      Markdown-in-HTML
   Blocks          Slides        HTML        Processed
```

### Core Components

- **Preprocessor** (`src/preprocessor/slide-generator.js`): 
  - `PabloSlideGenerator` class handles semantic parsing
  - Configurable via `pablo.config.js` (maxLinesPerCard, charsPerLine)
  - Height estimation algorithm for optimal slide breaks

- **Theme System** (`themes/*.scss` + `build-theme.js`):
  - SCSS compilation to CSS
  - Multiple themes: `card-theme`, `zappts-dark-theme`, `hyperflow-dark-theme`
  - Compiled themes stored in `output/themes/`

- **Post-processor** (`postprocess-marp-html.js`):
  - CLI with backup/restore functionality
  - Markdown-it based HTML processing
  - Atomic file operations with validation

## Development Workflow

### Start Development Server
```bash
npm run serve        # Node.js server (auto-detects port from 1234)
npm run start        # Same as serve
npm run dev          # Build themes and start server
npm run live         # Live-reload server on port 1234
```

### Build Commands
```bash
# Theme building
npm run build                 # Compile all SCSS themes
npm run watch                 # Watch themes for changes

# Presentation building  
npm run build:presentation    # Full pipeline (recommended)

# Development workflow
npm run dev                   # Build themes and start server
```

### File Naming Convention
- Source files: `*.source.md` (original content)
- Processed files: `*.md` (preprocessor output)  
- Final output: `output/*.html`
- Backups: `*.backup.timestamp`
- Temp files: `*.tmp.timestamp`

Example flow: `zappts-AI-as-a-service.source.md` → `zappts-AI-as-a-service.md` → `output/zappts-AI-as-a-service.html`

## Configuration Files

### `pablo.config.js` - Preprocessor Configuration
```javascript
export const config = {
  maxLinesPerCard: 20,        // Slide height limit
  maxColumnsPerSlide: 4,      // Grid layout limits
  maxRowsPerSlide: 10,
  charsPerLine: 80,           // Height calculation basis
  themes: ['card-theme', 'zappts-dark-theme', ...]
};
```

### `marp.config.js` - Marp Configuration
```javascript
module.exports = {
  markdown: {
    breaks: true, html: true, linkify: true,
    typographer: true, gfm: true
  },
  themeSet: './output/themes'
};
```

### `build-presentation.js` - Build Orchestrator
- Handles the full three-stage pipeline
- File existence validation
- Cache clearing and cleanup
- Error handling with process exits

## Theme System

### Available Themes
- `zappts-dark-theme`: Corporate dark theme with blue branding
- `hyperflow-dark-theme`: Modern technical presentation theme  
- `card-theme`: Card-based layout with Catppuccin colors
- `light-theme`: Minimal light color scheme
- `custom-theme`: Configurable base theme

### Theme Development
1. Edit SCSS files in `themes/` directory
2. Run `npm run build` to compile
3. Themes output to `output/themes/*.css`
4. Use in frontmatter: `theme: theme-name`

### Creating New Themes

To create a custom theme from scratch:

1. **Create Theme File**: Add a new `.scss` file in the `themes/` directory
   ```scss
   /*! 
    * @theme your-theme-name
    * @auto-scaling true
    * @size 16:9 1280px 720px
    */
   
   // Define your color palette
   $primary-brand: #FF6B35;
   $secondary-brand: #004E89;
   $background-dark: #1A1A1D;
   ```

2. **Add to Build Configuration**: Edit `build-theme.js` and include your theme file:
   ```javascript
   const themeFiles = [
     'card-theme.scss',
     'your-theme-name.scss'  // Add here
   ];
   ```

3. **Compile Theme**: Build the CSS output
   ```bash
   node build-theme.js
   ```

4. **Test Theme**: Create a markdown file using your theme
   ```yaml
   ---
   marp: true
   theme: your-theme-name
   class: title
   ---
   ```

5. **Build Presentation**: Generate final output
   ```bash
   npx @marp-team/marp-cli presentation.md --theme-set output/themes --output presentation.html
   ```

### Theme Structure Guidelines

**Required Elements for Marpit Compatibility:**
- CSS custom properties in `:root` for color variables
- Base `section` styles with proper dimensions (1280x720px)
- Title slide styles for `section.title`
- Content slide styles for `section.card-single`, `section.card-start`, etc.

**Recommended Theme Features:**
- Hierarchical heading styles (h1, h2, h3) with distinct colors
- Typography settings (font-family, sizes, line-height)
- Table styling with borders and background colors
- Code block styling with syntax-appropriate backgrounds
- Blockquote styling with accent borders
- List styling with custom markers
- Layout variables (padding, margins, border-radius)

**Example Theme Template:**
See `themes/example-new-theme.scss` for a complete template showing:
- Color palette definition with SCSS variables
- CSS custom property exports
- Complete slide class styling
- Professional typography hierarchy
- Visual elements (gradients, accent bars, shadows)

### Theme Builder (`build-theme.js`)
```bash
node build-theme.js          # Build all themes
node build-theme.js watch    # Build and watch for changes
node build-theme.js help     # Show detailed usage information
```

## Key Architectural Concepts

### Semantic Block Parsing
The preprocessor identifies content types:
- `title-content`: H1 headings (become title slides)
- `h2-section`/`h3-section`: Section headings  
- `paragraph`: Regular content
- `html-block`: HTML placeholders (`__HTML_BLOCK_N__`)

### Slide Chunking Algorithm
- Estimates content height based on line count, tables, lists
- Splits content when `estimatedHeight > maxLinesPerCard`
- Preserves semantic boundaries (doesn't split mid-heading)
- Applies card classes: `card-single`, `card-start`, `card-middle`, `card-end`

### Sources Section Processing
Automatically detects and formats source citations:
- Patterns: `**Sources:**`, `**Fontes:**`, `## Sources`
- Converts to `<div class="left-notes"><div class="sources">` HTML blocks
- Maintains markdown formatting within sources

### Markdown-in-HTML Processing
- Post-processor targets specific HTML elements
- Uses markdown-it for reliable conversion
- Preserves Marp/Bespoke.js functionality
- Safety features: backups, validation, atomic writes

## Development Tips

### Debugging Pipeline Stages
Test individual stages:
```bash
# Test preprocessor only
node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); console.log(new PabloSlideGenerator().processMarkdown(fs.readFileSync('file.source.md', 'utf8')))"

# Test preprocessor with debugging enabled
node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); const generator = new PabloSlideGenerator({debug: true}); console.log(generator.processMarkdown(fs.readFileSync('file.source.md', 'utf8')));"

# Test preprocessor validation
node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); const generator = new PabloSlideGenerator(); const processed = generator.processMarkdown(fs.readFileSync('file.source.md', 'utf8')); const warnings = generator.validateSlides(processed.split('---').slice(2)); console.log('Validation warnings:', warnings);"

# Test Marp only  
npx marp file.md --output test.html --theme ./output/themes/zappts-dark-theme.css

# Test post-processor only
node postprocess-marp-html.js test.html --help
```

### Recent Improvements
**Preprocessing Enhancements:**
- **Enhanced height estimation**: Better support for code blocks, tables, images, and lists
- **Added error handling**: Input validation and comprehensive error messages  
- **Improved frontmatter**: Proper YAML formatting with special character handling
- **Added debugging**: Use `new PabloSlideGenerator({debug: true})` for verbose output
- **Added validation**: `validateSlides()` method checks for common issues

**Theme System Modernization:**
- **Modernized Sass syntax**: Converted deprecated `@import` to modern `@use` syntax
- **Eliminated deprecation warnings**: Fully compatible with Dart Sass 3.0.0+
- **Improved build performance**: Cleaner theme compilation process

### Common Issues
- **PowerShell execution**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Theme not found**: Ensure `npm run build` completed successfully
- **HTML processing fails**: Check markdown syntax in `<div class="sources">` elements
- **Port conflicts**: Dev server auto-detects available ports starting from 1234
- **Preprocessing errors**: Use debug mode to troubleshoot slide generation issues

### Project Structure Understanding
```
pablo/
├── src/preprocessor/           # Core slide generation logic
├── themes/                     # SCSS theme sources
├── output/                     # Generated HTML and compiled CSS
├── *.source.md                 # Original presentation content
├── *.md                        # Preprocessed intermediate files
├── build-presentation.js       # Main build orchestrator
├── postprocess-marp-html.js    # HTML post-processing CLI
└── pablo.config.js             # Preprocessor configuration
```

This system is designed for creating professional presentations with intelligent content organization, multiple visual themes, and robust processing pipelines.

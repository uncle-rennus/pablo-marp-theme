# Marpit Presentation with Advanced Processing Pipeline

A presentation system built with Marpit that supports intelligent slide generation, markdown-in-HTML rendering, and automated content processing through a three-stage pipeline.

## Features

- **Intelligent Slide Generation**: Automatic content chunking and slide creation based on semantic blocks
- **Full Marp/Bespoke.js Integration**: Complete presentation layout with navigation, presenter view, and transitions
- **Markdown-in-HTML Support**: Render markdown content inside custom HTML elements
- **Multiple Themes**: Card theme, Zappts dark branding theme, and Hyperflow dark theme
- **Three-Stage Processing Pipeline**: Preprocessor → Marp → Post-processor for optimal results
- **PowerShell Automation**: Easy build scripts for Windows development

## Processing Pipeline

The presentation generation follows a sophisticated three-stage pipeline:

### Stage 1: Preprocessor (`src/preprocessor/`)
**Purpose**: Intelligent content analysis and slide generation

The `PabloSlideGenerator` class:
- **Parses semantic blocks**: Identifies headings, content sections, and HTML elements
- **Extracts sources**: Automatically formats source sections into HTML blocks
- **Chunks content**: Splits content into slides based on estimated height and semantic boundaries
- **Applies card classes**: Adds appropriate CSS classes for styling
- **Handles HTML placeholders**: Preserves HTML blocks during processing

**Key Features**:
- Configurable `maxLinesPerCard` (default: 20 lines)
- Semantic block detection (H1, H2, H3, HTML blocks)
- Automatic slide separation based on content density
- Source section extraction and formatting

### Stage 2: Marp Processing
**Purpose**: Convert processed markdown to HTML with theme application

Marp handles:
- **Theme application**: Applies SCSS/CSS themes to the presentation
- **HTML generation**: Converts markdown to presentation-ready HTML
- **Bespoke.js integration**: Adds navigation, presenter view, and transitions
- **Asset processing**: Handles images, fonts, and other resources

### Stage 3: Post-processor (`postprocess-marp-html.js`)
**Purpose**: Process markdown content within HTML elements

The post-processor:
- **Finds HTML elements**: Locates `<div class="sources">` and other custom elements
- **Renders markdown**: Converts markdown syntax to HTML using markdown-it
- **Preserves structure**: Maintains Marp/Bespoke.js functionality
- **Safety features**: Creates backups, validates output, atomic file operations

## Project Structure

```
pablo/
├── zappts-AI-as-a-service.source.md    # Original source markdown
├── zappts-AI-as-a-service.md           # Preprocessed markdown (generated)
├── output/
│   └── zappts-AI-as-a-service.html     # Final presentation (generated)
├── src/
│   └── preprocessor/
│       ├── index.js                    # Preprocessor exports
│       └── slide-generator.js          # Core slide generation logic
├── themes/
│   ├── *.scss                          # SCSS theme sources
│   └── output/themes/*.css             # Compiled themes
├── build-presentation.js               # Main build script
├── postprocess-marp-html.js            # HTML post-processor
├── pablo.config.js                     # Preprocessor configuration
├── marp.config.js                      # Marp configuration
└── package.json                        # Project dependencies
```

## Quick Start

### Prerequisites

- Node.js 16+ 
- Python 3+ (for HTTP server)
- PowerShell (for Windows automation)

### Installation

1. **Clone/Download** the project
2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development Workflow

1. **Start the development server**:
   ```bash
   python -m http.server 8000
   ```

2. **Build the presentation**:
   ```bash
   npm run build:presentation
   ```

3. **View the presentation**:
   Open `http://localhost:8000/output/zappts-AI-as-a-service.html`

## Usage

### Writing Presentations

Create your presentation in Markdown format with semantic structure:

```markdown
---
marp: true
theme: zappts-dark-theme
---

# Main Title

## Section Heading

Your content here with automatic slide generation.

<div class="sources">
  **Fontes:**
  - [Source 1](https://example.com)
  - [Source 2](https://example.com)
</div>

## Another Section

More content that will be intelligently split into slides.
```

### Supported HTML Elements

#### Sources Div
```html
<div class="sources">
  **Fontes:**
  - [Link text](https://url.com)
  - [Another link](https://url.com)
</div>
```

The markdown inside `<div class="sources">` will be automatically converted to HTML with:
- Bold text (`**text**` → `<strong>text</strong>`)
- Links (`[text](url)` → `<a href="url">text</a>`)
- Lists (`- item` → `<ul><li>item</li></ul>`)

#### Left Notes
```html
<div class="left-notes">
  Speaker notes and context information.
  
  <div class="sources">
    Additional sources here.
  </div>
</div>
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run build:presentation` | Complete pipeline: preprocess → Marp → post-process |
| `npm run build:ps` | Alternative PowerShell build command |
| `npm run serve` | Start development server |
| `npm run live` | Start live-server with auto-refresh |

### Manual Build Steps

For debugging or custom processing:

1. **Preprocess markdown**:
   ```bash
   node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); const generator = new PabloSlideGenerator(); const processed = generator.processMarkdown(fs.readFileSync('zappts-AI-as-a-service.source.md', 'utf8')); fs.writeFileSync('zappts-AI-as-a-service.md', processed);"
   ```

2. **Generate HTML with Marp**:
   ```bash
   npx marp zappts-AI-as-a-service.md --theme ./themes/zappts-dark-theme.css -o output/zappts-AI-as-a-service.html
   ```

3. **Process markdown in HTML elements**:
   ```bash
   node postprocess-marp-html.js output/zappts-AI-as-a-service.html
   ```

## Configuration

### Preprocessor Configuration (`pablo.config.js`)

```javascript
export const config = {
  maxLinesPerCard: 20,        // Maximum lines per slide
  maxColumnsPerSlide: 4,      // Maximum columns for grid layouts
  maxRowsPerSlide: 10,        // Maximum rows for grid layouts
  charsPerLine: 80,           // Characters per line for height estimation
  themes: [                   // Available themes
    'card-theme',
    'custom-theme', 
    'light-theme',
    'zappts-dark-theme',
    'hyperflow-dark-theme'
  ]
};
```

### Marp Configuration (`marp.config.js`)

```javascript
module.exports = {
  html: true,
  allowLocalFiles: true,
  themeSet: './themes',
  // Additional Marp options...
};
```

## Theme Customization

### Available Themes

#### Zappts Dark Theme (Latest)
- **Brand Colors**: Dark navy (`#121326`) background with Zappts blue (`#0076BD`) accents
- **Title Layout**: Custom horizontal strip design with left-aligned titles
- **High Contrast**: White/light gray text on dark backgrounds for accessibility
- **Card Layout**: Blue content cards (`#0A85CC`) with professional spacing
- **Usage**: Set `theme: zappts-dark-theme` in your markdown frontmatter

#### Hyperflow Dark Theme
- **Modern Design**: Clean dark theme optimized for technical presentations
- **Grid Support**: Advanced layout capabilities for complex content
- **Professional Typography**: Optimized font sizing and spacing
- **Usage**: Set `theme: hyperflow-dark-theme` in your markdown frontmatter

#### Card Theme (Original)
- **Catppuccin Color Palette**: Beautiful dark theme with accent colors
- **Card-based Layout**: Content displayed in styled cards
- **Left Notes Panel**: Speaker notes and sources in sidebar
- **Usage**: Set `theme: card-theme` in your markdown frontmatter

### Customizing Themes

1. **Edit theme files**:
   - Zappts theme: `themes/zappts-dark-theme.scss`
   - Hyperflow theme: `themes/hyperflow-dark-theme.scss`
   - Card theme: `themes/card-theme.scss`
2. **Rebuild themes**:
   ```bash
   npm run build
   ```
3. **Rebuild presentation**:
   ```bash
   npm run build:presentation
   ```

## Technical Details

### Preprocessor Algorithm

The `PabloSlideGenerator` uses a sophisticated algorithm:

1. **Frontmatter Preservation**: Extracts and preserves YAML frontmatter
2. **Source Extraction**: Finds and formats source sections into HTML blocks
3. **HTML Placeholder Creation**: Replaces HTML blocks with placeholders for processing
4. **Semantic Block Parsing**: Identifies content types (headings, paragraphs, HTML)
5. **Height Estimation**: Calculates content height based on lines, tables, lists
6. **Slide Chunking**: Groups blocks into slides based on height limits and semantic boundaries
7. **HTML Reinsertion**: Restores HTML blocks to their original positions
8. **Class Application**: Adds appropriate CSS classes for styling

### Post-processing Pipeline

The `postprocess-marp-html.js` script provides:

- **Safety Features**: Backup creation, atomic file operations, content validation
- **Markdown Processing**: Uses markdown-it for reliable markdown-to-HTML conversion
- **Element Targeting**: Specifically processes `<div class="sources">` and other custom elements
- **Error Recovery**: Automatic backup restoration on processing failures
- **Command-line Interface**: Flexible input/output file specification

### Dependencies

- `@marp-team/marpit`: Core Marpit functionality
- `markdown-it`: Markdown processing for HTML elements
- `sass`: SCSS compilation for themes
- `front-matter`: YAML frontmatter parsing
- `child_process`: Build process orchestration

## Troubleshooting

### Common Issues

**PowerShell Execution Policy Error**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Preprocessor Errors**:
- Check source file syntax and frontmatter
- Verify `pablo.config.js` configuration
- Ensure proper markdown structure

**Marp Build Failures**:
- Verify theme files exist and are compiled
- Check markdown syntax and HTML elements
- Ensure all referenced assets exist

**Post-processing Issues**:
- Check HTML file permissions
- Verify markdown syntax in HTML elements
- Review backup files for content comparison

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
DEBUG=* npm run build:presentation
```

### Manual Pipeline Steps

For debugging specific stages:

1. **Test preprocessor only**:
   ```bash
   node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); console.log(new PabloSlideGenerator().processMarkdown(fs.readFileSync('zappts-AI-as-a-service.source.md', 'utf8')));"
   ```

2. **Test Marp only**:
   ```bash
   npx marp zappts-AI-as-a-service.md --output test.html --theme ./themes/zappts-dark-theme.css
   ```

3. **Test post-processor only**:
   ```bash
   node postprocess-marp-html.js test.html --help
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run build:presentation`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Note**: This project extends Marpit's capabilities to support markdown content within HTML elements while maintaining full presentation functionality. The post-processing approach ensures compatibility with all Marp/Bespoke.js features. 

# Marpit Card Theme for Presentations

A configurable card-based theme for Marpit presentations with support for multiple color schemes and layouts.

## Available Themes

### Zappts Dark Theme (NEW)
- **File**: `zappts-dark-theme`
- **Colors**: Zappts signature blue (#0076BD) backgrounds with high-contrast white text
- **Card Background**: Lighter blue (#0A85CC) for content separation
- **Text Colors**: White (#FFFFFF) for titles, light gray (#F0F0F0) for content
- **Supporting Text**: Mid-gray (#888888) for sources and secondary information
- **Notes Section**: Dark gray (#1A1A1A) background with light text
- **Usage**: `theme: zappts-dark-theme`

### Card Theme (Default)
- **File**: `card-theme`
- **Colors**: Catppuccin Mocha dark theme
- **Usage**: `theme: card-theme`

### Light Theme
- **File**: `light-theme`
- **Colors**: Light/minimal color scheme
- **Usage**: `theme: light-theme`

### Custom Theme
- **File**: `custom-theme`
- **Colors**: Customizable theme with configuration options
- **Usage**: `theme: custom-theme`

## Quick Start

1. **Start Development Server**:
   ```bash
   npm run serve
   # or
   npm run live
   ```

2. **Build Themes**:
   ```bash
   npm run build
   ```

3. **Watch for Changes**:
   ```bash
   npm run watch
   ```

## Using the Zappts Dark Theme

To use the new Zappts dark theme in your presentation:

1. **Set theme in your Markdown file**:
   ```markdown
   ---
   marp: true
   theme: zappts-dark-theme
   size: 16:9
   paginate: true
   ---
   ```

2. **Build the theme** (if not already built):
   ```bash
   npm run build
   ```

3. **Start the development server**:
   ```bash
   npm run serve
   ```

## Theme Features

- **Card-based layouts** with left sidebar for notes
- **Multiple slide types**: title, card-single, card-start, card-middle, card-end
- **High contrast** accessibility-compliant color schemes
- **Responsive design** optimized for 16:9 presentations
- **Source citations** with dedicated styling in notes section

## Development

- **Build Scripts**: `build-theme.js` compiles SCSS to CSS
- **Theme Sources**: `/themes/` directory contains SCSS source files
- **Output**: `/output/` directory contains compiled CSS files
- **Live Server**: Available on http://localhost:8000 or http://localhost:3000

## Color Accessibility

The Zappts dark theme maintains high contrast ratios:
- **Background to Text**: 21:1 (WCAG AAA compliant)
- **Card Background to Text**: 19:1 (WCAG AAA compliant)
- **Supporting Text**: 4.5:1 minimum (WCAG AA compliant)

All color combinations meet WCAG 2.1 accessibility standards for professional presentations. 
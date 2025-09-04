# Pablo - Professional Presentation System

A sophisticated presentation system built on Marpit that transforms semantic markdown into professional presentations with intelligent slide generation, multiple themes, and a robust three-stage processing pipeline.

## Features

- **Intelligent Slide Generation**: Automatically organizes content into well-structured slides
- **Professional Theme System**: Multiple corporate and technical themes with consistent styling
- **Three-Stage Processing Pipeline**: Preprocessor → Marp → Post-processor for optimal results
- **Semantic Content Analysis**: Smart parsing of headings, content blocks, and citations
- **Markdown-in-HTML Support**: Advanced formatting within specialized containers
- **Multiple Layout Options**: Title slides, content cards, columns, and specialized business layouts

## Quick Start

### 1. Setup

```bash
# Install dependencies
npm install

# Build themes
npm run build
```

### 2. Create Presentation

Create a file named `my-presentation.source.md`:

```markdown
---
marp: true
theme: zappts-dark-theme
class: title
---

# My First Presentation
### Created with Pablo

---

## Key Features

- Professional styling
- Automatic slide generation
- Multiple layout options
```

### 3. Build & View

```bash
# Build the presentation
npm run build:presentation my-presentation.source.md

# Start dev server
npm run serve
```

Open http://localhost:1234/output/my-presentation.html in your browser.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

### Guides

- [Getting Started Guide](docs/guides/getting-started.md) - First steps and basic workflow
- [Theme Creation Guide](docs/guides/theme-creation.md) - Create custom themes for your brand

### References

- [Theme Reference](docs/reference/themes.md) - All available themes and their features

### Examples

- [Zappts Corporate Example](docs/examples/zappts-corporate-example.md) - Business presentation example

## Development Commands

```bash
# Build presentations
npm run build:presentation file.source.md  # Process specific file

# Theme development
npm run build                              # Compile all themes
npm run watch                              # Watch themes for changes

# Development servers
npm run dev                                # Build themes + start server
npm run serve                              # Basic development server
npm run live                               # Live-reload server
```

## Key Components

### Three-Stage Pipeline

```
Source File (.source.md) → Preprocessor → Marp → Post-processor → Final HTML
      ↓                       ↓           ↓            ↓
  Semantic Content      Chunked Slides  Themed HTML   Enhanced HTML
```

### Professional Themes

- **Corporate**: Zappts dark theme, Authentic Zappts theme
- **Technical**: Hyperflow dark theme, Card theme
- **Utility**: Light theme, Custom theme

### Slide Types

- **Presentation**: Title slides, section dividers, content slides
- **Corporate**: Proposal cover, two-column layouts, topic slides
- **Card-Based**: Single cards, card sequences, media cards

## Project Structure

```
pablo/
├── docs/                               # Documentation
│   ├── guides/                         # User guides
│   ├── reference/                      # Technical references 
│   └── examples/                       # Example presentations
├── src/preprocessor/                   # Core slide generation logic
├── themes/                             # SCSS theme sources
├── output/themes/                      # Compiled CSS themes
├── *.source.md                         # Source presentation files
├── build-presentation.js               # Main build orchestrator
├── build-theme.js                      # Theme compiler
└── pablo.config.js                     # Configuration
```

## License

MIT

## Contributing

Contributions are welcome! See the [Theme Creation Guide](docs/guides/theme-creation.md) for details on adding new themes.

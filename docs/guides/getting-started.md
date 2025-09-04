# Getting Started with Pablo

## Overview

Pablo is a sophisticated presentation system built on Marpit that transforms semantic markdown into professional presentations. It features a three-stage processing pipeline, intelligent slide generation, and multiple professional themes.

## Quick Start

### 1. Setup and Installation

Ensure you have Node.js installed, then:

```bash
# Install dependencies
npm install

# Build all themes
npm run build
```

### 2. Create Your First Presentation

Create a new file with the `.source.md` extension:

**my-presentation.source.md**
```yaml
---
marp: true
theme: zappts-dark-theme
class: title
---

# My First Presentation
### Created with Pablo
*Professional presentations made easy*

---

## About This System

Pablo transforms your markdown into beautiful presentations with:

- **Intelligent slide chunking** - Automatic content organization
- **Professional themes** - Corporate and technical styles
- **Semantic processing** - Smart content understanding
- **Multiple layouts** - Cards, columns, and specialized business slides

---

## Key Features

- Automated slide generation
- Brand-consistent styling
- Responsive design
- Modern build pipeline
```

### 3. Build Your Presentation

```bash
# Process and build the presentation
npm run build:presentation my-presentation.source.md

# This creates:
# - my-presentation.md (processed)
# - output/my-presentation.html (final)
```

### 4. View Your Presentation

```bash
# Start development server
npm run serve

# Or open directly
open output/my-presentation.html
```

## Understanding the Pipeline

Pablo uses a three-stage processing pipeline:

```
Source File (.source.md) → Preprocessor → Marp → Post-processor → Final HTML
      ↓                       ↓           ↓            ↓
  Semantic Content      Chunked Slides  Themed HTML   Enhanced HTML
```

### Stage 1: Preprocessing
- Parses semantic blocks (headings, content, HTML)
- Chunks content into slides based on height estimation
- Applies appropriate slide classes
- Processes sources and citations

### Stage 2: Marp Processing
- Converts markdown to HTML
- Applies theme styling
- Handles slide transitions

### Stage 3: Post-processing
- Processes markdown within HTML elements
- Enhances interactive elements
- Creates final presentation

## Available Themes

### Corporate Themes
- **zappts-dark-theme** - Professional business presentations
- **zappts-theme** - Alternative Zappts corporate styling

### Technical Themes
- **hyperflow-dark-theme** - Modern technical presentations
- **card-theme** - Card-based layouts with developer-friendly colors

### Utility Themes
- **light-theme** - Minimal light theme
- **custom-theme** - Base for customization
- **example-new-theme** - Template and demonstration

## Slide Classes

### Universal Classes
- `title` - Main title slide
- `card-single` - Single content card
- `section` - Section divider

### Zappts Corporate Classes
- `proposal` - Business proposal cover
- `title-content` - Title with content area
- `onecol` - Single column layout
- `twocol` - Two-column layout
- `main-topic` - Topic announcement
- `title-sub-right` - Title with right support
- `section-title` - Full-width section

## Content Organization

### Headings and Structure
```markdown
# H1 creates title slides
## H2 creates section headers
### H3 creates subsections

Regular paragraphs become slide content.
```

### Emphasis and Styling
```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
`Code snippets` for technical terms

> Blockquotes for important information

<div class="para--emphasis">
Special emphasis blocks with theme colors
</div>
```

### Lists and Tables
```markdown
- Bullet lists work naturally
- Multiple levels supported
  - Nested items
  - Good for hierarchical content

| Tables | Are | Supported |
|--------|-----|-----------|
| Data   | In  | Columns   |
| Theme  | Styled | Automatically |
```

## Development Workflow

### Daily Development
```bash
# Start with theme and server together
npm run dev

# Or separate steps:
npm run build        # Compile themes
npm run serve        # Start server
```

### Building Presentations
```bash
# Build specific presentation
npm run build:presentation filename.source.md

# Quick theme compilation
npm run build

# Watch themes during development
npm run watch
```

### Live Development
```bash
# Live reload server
npm run live

# Development server with port detection
npm run serve
```

## File Naming Convention

- **Source files**: `*.source.md` (your original content)
- **Processed files**: `*.md` (preprocessor output)
- **Final output**: `output/*.html` (generated presentations)
- **Backups**: `*.backup.timestamp` (automatic backups)

Example flow: `presentation.source.md` → `presentation.md` → `output/presentation.html`

## Common Patterns

### Business Presentations
```yaml
---
marp: true
theme: zappts-dark-theme
class: proposal
---

<!-- Proposal cover -->
<div class="proposal-info">
Proposal: 2024-001<br>
Date: September 2024
</div>

<div class="proposal-title">
Business Proposal for
</div>

---

<!-- _class: section-title -->
# Project Overview

---

<!-- _class: title-content -->
# Solution Benefits

<div class="content">
Professional content with proper spacing
and brand-consistent styling.
</div>
```

### Technical Presentations
```yaml
---
marp: true
theme: hyperflow-dark-theme
class: title
---

# System Architecture
### Microservices Design
*Technical Documentation*

---

<!-- _class: card-single -->
## Core Components

- **API Gateway**: Request routing
- **Service Mesh**: Communication layer
- **Data Layer**: Persistent storage
```

## Configuration

### Pablo Configuration (`pablo.config.js`)
```javascript
export const config = {
  maxLinesPerCard: 20,        // Slide height limit
  maxColumnsPerSlide: 4,      // Grid layout limits
  maxRowsPerSlide: 10,
  charsPerLine: 80,           // Height calculation basis
  themes: ['zappts-dark-theme', 'card-theme']
};
```

### Marp Configuration (`marp.config.js`)
```javascript
module.exports = {
  markdown: {
    breaks: true,
    html: true,
    linkify: true,
    typographer: true
  },
  themeSet: './output/themes'
};
```

## Troubleshooting

### Common Issues

**Theme not found**
- Run `npm run build` to compile themes
- Check theme name in frontmatter matches file name

**Preprocessing errors**
- Ensure `.source.md` file exists
- Check YAML frontmatter syntax
- Use debug mode: `PabloSlideGenerator({debug: true})`

**Server issues**
- Check port availability (starts from 1234)
- Kill existing processes if needed
- Try `npm run serve` instead of `npm run live`

### Debug Mode

Enable detailed logging:
```javascript
const generator = new PabloSlideGenerator({debug: true});
```

This shows:
- Slide processing steps
- Height calculations
- Content chunking decisions
- Validation warnings

## Next Steps

1. **Explore themes** - Try different themes to find your style
2. **Learn slide classes** - Master the layout options
3. **Create custom themes** - See [Theme Creation Guide](theme-creation.md)
4. **Advanced features** - Check [Advanced Usage Guide](advanced-usage.md)
5. **Reference docs** - Browse the [Reference section](../reference/)

## Getting Help

- Check the [Troubleshooting Guide](troubleshooting.md)
- Review [Theme Reference](../reference/themes.md) for styling options
- See [Examples](../examples/) for complete presentations
- Look at existing `.source.md` files for patterns

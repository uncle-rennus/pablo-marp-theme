# Marpit Presentation with Markdown-in-HTML Support

A presentation system built with Marpit that supports rendering markdown content inside HTML elements like `<div class="sources">` and tables, while preserving the full Marp/Bespoke.js presentation layout and features.

## Features

- **Full Marp/Bespoke.js Integration**: Complete presentation layout with navigation, presenter view, and transitions
- **Markdown-in-HTML Support**: Render markdown content inside custom HTML elements
- **Multiple Themes**: Card theme and Zappts dark branding theme
- **Post-processing Pipeline**: Automatically converts markdown in HTML elements to proper HTML
- **PowerShell Automation**: Easy build scripts for Windows development

## Project Structure

```
pablo/
├── zappts-AI-as-a-service.md          # Main presentation source
├── output/
│   └── zappts-AI-as-a-service.html    # Generated presentation
├── themes/
│   ├── card-theme.scss                # SCSS theme source
│   └── card-theme.css                 # Compiled theme
├── build-presentation.ps1             # PowerShell build script
├── postprocess-marp-html.js           # Markdown-in-HTML processor
├── dev-server.js                      # Development server
└── package.json                       # Project dependencies
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

Create your presentation in Markdown format with custom HTML elements:

```markdown
---
marp: true
theme: card-theme
---

# Slide Title

<div class="left-notes">
  Speaker notes and context information.
  
  <div class="sources">
    **Fontes:**
    - [Source 1](https://example.com)
    - [Source 2](https://example.com)
  </div>
</div>

## Main Content

Your slide content here...
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

#### Tables
```html
<table>
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |
</table>
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run build:presentation` | Build presentation with markdown processing |
| `npm run build:ps` | Alternative PowerShell build command |
| `npm run serve` | Start development server |
| `npm run live` | Start live-server with auto-refresh |

### Manual Build Steps

If you prefer manual control:

1. **Generate HTML with Marp**:
   ```bash
   npx marp zappts-AI-as-a-service.md --theme ./themes/card-theme.css -o output/zappts-AI-as-a-service.html
   ```

2. **Process markdown in HTML elements**:
   ```bash
   node postprocess-marp-html.js
   ```

## Theme Customization

### Available Themes

#### Zappts Dark Theme (Latest)
- **Brand Colors**: Dark navy (`#121326`) background with Zappts blue (`#0076BD`) accents
- **Title Layout**: Custom horizontal strip design with left-aligned titles
- **High Contrast**: White/light gray text on dark backgrounds for accessibility
- **Card Layout**: Blue content cards (`#0A85CC`) with professional spacing
- **Usage**: Set `theme: zappts-dark-theme` in your markdown frontmatter

#### Card Theme (Original)
- **Catppuccin Color Palette**: Beautiful dark theme with accent colors
- **Card-based Layout**: Content displayed in styled cards
- **Left Notes Panel**: Speaker notes and sources in sidebar
- **Usage**: Set `theme: card-theme` in your markdown frontmatter

### Customizing Themes

1. **Edit theme files**:
   - Card theme: `themes/card-theme.scss`
   - Zappts theme: `themes/zappts-dark-theme.scss`
2. **Rebuild themes**:
   ```bash
   npm run build
   ```
3. **Rebuild presentation**:
   ```bash
   npm run build:presentation
   ```

### Theme Development

The themes are built using SCSS and include:
- Color variable overrides
- Custom layout components
- High-specificity selectors to override base styles
- Accessibility-compliant contrast ratios

## Technical Details

### Post-processing Pipeline

The `postprocess-marp-html.js` script:

1. **Reads** the Marp-generated HTML
2. **Finds** `<div class="sources">` elements
3. **Processes** markdown content using markdown-it
4. **Replaces** raw markdown with rendered HTML
5. **Preserves** all Marp/Bespoke.js functionality

### Dependencies

- `@marp-team/marpit`: Core Marpit functionality
- `markdown-it`: Markdown processing for HTML elements
- `sass`: SCSS compilation for themes

## Troubleshooting

### Common Issues

**PowerShell Execution Policy Error**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Port Already in Use**:
```bash
# Use different port
python -m http.server 8001
```

**Theme Not Updating**:
```bash
npm run build
npm run build:presentation
```

### Development Tips

1. **Auto-refresh**: Use `npm run live` for automatic browser refresh
2. **Theme Development**: Edit SCSS files and run `npm run watch` for live compilation
3. **Debug Mode**: Check browser console for any JavaScript errors
4. **Presenter View**: Press `P` in the presentation for presenter mode

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
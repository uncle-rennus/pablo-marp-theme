# Marpit Presentation with Markdown-in-HTML Support

A presentation system built with Marpit that supports rendering markdown content inside HTML elements like `<div class="sources">` and tables, while preserving the full Marp/Bespoke.js presentation layout and features.

## Features

- **Full Marp/Bespoke.js Integration**: Complete presentation layout with navigation, presenter view, and transitions
- **Markdown-in-HTML Support**: Render markdown content inside custom HTML elements
- **Custom Card Theme**: Beautiful Catppuccin-inspired theme with card-based layout
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

### Card Theme Features

- **Catppuccin Color Palette**: Beautiful dark theme with accent colors
- **Card-based Layout**: Content displayed in styled cards
- **Left Notes Panel**: Speaker notes and sources in sidebar
- **Responsive Design**: Works on different screen sizes

### Customizing the Theme

1. Edit `themes/card-theme.scss`
2. Rebuild the theme:
   ```bash
   npm run build
   ```
3. Rebuild the presentation:
   ```bash
   npm run build:presentation
   ```

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
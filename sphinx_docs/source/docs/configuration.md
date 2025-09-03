# Configuration

Pablo uses several configuration files to control different aspects of the presentation system.

## Preprocessor Configuration (`pablo.config.js`)

Controls the slide generation algorithm:

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

### Key Parameters:

- **maxLinesPerCard**: Controls when content gets split into multiple slides
- **charsPerLine**: Used for height estimation calculations  
- **themes**: List of available theme names for validation

## Marp Configuration (`marp.config.js`)

Controls Marp behavior:

```javascript
module.exports = {
  html: true,
  allowLocalFiles: true,
  themeSet: './themes',
  markdown: {
    breaks: true,
    html: true,
    linkify: true,
    typographer: true,
    gfm: true
  }
};
```

### Key Settings:

- **html**: Enable HTML processing in markdown
- **allowLocalFiles**: Allow local file references
- **themeSet**: Directory containing CSS theme files
- **markdown**: Markdown-it configuration options

## Theme Configuration

### Available Themes

- **zappts-dark-theme**: Corporate dark theme with blue branding
- **hyperflow-dark-theme**: Modern technical presentation theme  
- **card-theme**: Card-based layout with Catppuccin colors
- **light-theme**: Minimal light color scheme
- **custom-theme**: Configurable base theme

### Using Themes

Set the theme in your presentation frontmatter:

```yaml
---
marp: true
theme: zappts-dark-theme
size: 16:9
paginate: true
---
```

## File Naming Convention

- **Source files**: `*.source.md` (original content)
- **Processed files**: `*.md` (preprocessor output)  
- **Final output**: `output/*.html`
- **Backups**: `*.backup.timestamp`
- **Temp files**: `*.tmp.timestamp`

Example flow: `presentation.source.md` → `presentation.md` → `output/presentation.html`

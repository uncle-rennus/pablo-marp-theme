# Theme Creation Guide

## Overview

This guide covers creating custom themes for the Pablo presentation system. Themes are built using SCSS and compiled to CSS files that Marp can use for presentation styling.

## Quick Start

To create a new theme:

1. **Create Theme File** - Add a new `.scss` file in the `themes/` directory
2. **Define Colors** - Set up your brand color palette using SCSS variables
3. **Add to Build** - Include your theme in `build-theme.js`
4. **Compile** - Run `node build-theme.js` to generate CSS
5. **Test** - Create a presentation using your new theme

## Theme Structure

### Required Theme Header

Every theme must start with a Marpit theme declaration:

```scss
/*! 
 * @theme your-theme-name
 * @auto-scaling true
 * @size 16:9 1280px 720px
 */
```

### Color Palette Setup

Define your brand colors as SCSS variables:

```scss
// Brand Colors
$primary-brand: #FF6B35;      // Orange
$secondary-brand: #004E89;    // Navy Blue
$accent-color: #40E0D0;       // Turquoise
$background-dark: #1A1A1D;    // Dark background
$text-light: #E8E8E8;        // Light text
$text-muted: #B0B0B0;        // Muted text

// Status Colors
$success-green: #4CAF50;
$warning-orange: #FF9800;
$error-red: #F44336;
```

### CSS Custom Properties Export

Export your colors as CSS custom properties for use in the theme:

```scss
:root {
  --primary-brand: #{$primary-brand};
  --secondary-brand: #{$secondary-brand};
  --accent-color: #{$accent-color};
  --background-dark: #{$background-dark};
  --text-light: #{$text-light};
  --text-muted: #{$text-muted};
}
```

## Slide Classes and Layouts

The Pablo system supports multiple slide layouts via CSS classes:

### Basic Slide Types

- **`title`** - Main title slide with large heading
- **`card-single`** - Single content card layout
- **`card-start`** - First card in a multi-card sequence
- **`card-middle`** - Middle card in a sequence
- **`card-end`** - Final card in a sequence

### Zappts Corporate Layout Classes

For business presentations, the following classes are available:

- **`proposal`** - Proposal cover slide with client info
- **`section-title`** - Full-width section divider
- **`title-content`** - Title with content area
- **`onecol`** - Single column text layout
- **`twocol`** - Two-column layout with left/right content
- **`main-topic`** - Large topic announcement slide
- **`title-sub-right`** - Title with subtitle and right support box
- **`title-sub-right-block`** - Title with right image/content block

## Typography Setup

Define your font stack and hierarchy:

```scss
// Typography
$font-family: 'Roboto', 'Segoe UI', system-ui, sans-serif;
$font-family-mono: 'Fira Code', 'Consolas', monospace;

section {
  font-family: $font-family;
  font-size: 28px;
  line-height: 1.4;
  color: var(--text-light);
  
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--primary-brand);
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 2.8rem;
    font-weight: 600;
    color: var(--secondary-brand);
    margin-bottom: 0.8rem;
  }
  
  h3 {
    font-size: 2.2rem;
    font-weight: 500;
    color: var(--accent-color);
    margin-bottom: 0.6rem;
  }
}
```

## Layout Components

### Two-Column Layout

```scss
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 100%;
  align-items: start;
}

.col--left, .col--right {
  padding: 1rem;
}
```

### Support Boxes and Blocks

```scss
.support-box {
  background: rgba(var(--secondary-brand-rgb), 0.1);
  border: 2px solid var(--secondary-brand);
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem 0;
}

.support-block {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  .support-image {
    max-width: 100%;
    border-radius: 8px;
  }
}
```

### Emphasis Styles

```scss
.para--emphasis {
  background: rgba(var(--accent-color-rgb), 0.1);
  border-left: 4px solid var(--accent-color);
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  font-weight: 500;
}
```

## Brand-Specific Implementations

### Zappts Corporate Theme Colors

The authentic Zappts theme uses these specific colors extracted from the original PowerPoint:

```scss
$zappts-primary-blue: #4285F4;    // Primary Blue
$zappts-orange: #FFAB40;          // Orange Accent
$zappts-teal: #0097A7;            // Teal
$zappts-gray: #646B6B;            // Specific gray for emphasis
```

### Business Proposal Elements

For corporate presentations, include these specialized components:

```scss
.proposal-info {
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.proposal-title {
  font-size: 3rem;
  font-weight: 600;
  color: var(--primary-brand);
  text-align: center;
  margin-bottom: 2rem;
}

.customer-logo {
  max-height: 150px;
  margin: 2rem auto;
  display: block;
}
```

## Building and Testing

### Build Configuration

Add your theme to the build system in `build-theme.js`:

```javascript
const themeFiles = [
  'card-theme.scss',
  'zappts-dark-theme.scss',
  'your-new-theme.scss'  // Add your theme here
];
```

### Build Commands

```bash
# Build all themes
node build-theme.js

# Watch for changes during development
node build-theme.js watch

# Build specific theme (if supported)
node build-theme.js --theme your-new-theme
```

### Testing Your Theme

Create a test presentation file:

```yaml
---
marp: true
theme: your-new-theme
class: title
---

# Your Theme Test

This slide tests your new theme!

---

<!-- _class: card-single -->

## Feature Testing

- Color palette
- Typography
- Layout components
- **Bold text** and *italic text*
- `Code snippets`

> Blockquote styling

### Lists and Tables

| Feature | Status |
|---------|--------|
| Colors | ✅ |
| Fonts | ✅ |
| Layouts | 🔄 |
```

## Advanced Customization

### CSS Grid Layouts

For complex layouts, use CSS Grid:

```scss
.grid-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "content sidebar"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
  height: 100%;
}
```

### Animation and Transitions

Add subtle animations for professional presentations:

```scss
section {
  transition: all 0.3s ease-in-out;
}

h1, h2, h3 {
  animation: slideInFromLeft 0.6s ease-out;
}

@keyframes slideInFromLeft {
  0% { transform: translateX(-50px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
```

### Responsive Design

Ensure themes work across different screen sizes:

```scss
@media (max-width: 1024px) {
  section {
    font-size: 24px;
    padding: 3rem 2rem;
  }
  
  .columns {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

## Best Practices

1. **Color Accessibility** - Ensure sufficient contrast for readability
2. **Consistent Spacing** - Use a modular scale for margins and padding
3. **Typography Hierarchy** - Clear distinction between heading levels
4. **Brand Alignment** - Match colors and fonts to brand guidelines
5. **Testing** - Test on different screen sizes and with various content types
6. **Performance** - Avoid complex animations that might slow down presentations
7. **Maintainability** - Use SCSS variables and mixins for reusable components

## Troubleshooting

### Common Issues

- **Theme not found**: Ensure the theme CSS is compiled in `output/themes/`
- **Colors not displaying**: Check CSS custom property definitions
- **Layout issues**: Verify slide class names match theme definitions
- **Font problems**: Ensure web fonts are loaded or fallbacks are defined

### Debug Mode

Use the debug mode in the preprocessor to troubleshoot slide generation:

```javascript
const generator = new PabloSlideGenerator({debug: true});
```

This will show detailed information about slide processing and height calculations.

## Example Themes

See the following example themes in the `themes/` directory:

- `example-new-theme.scss` - Complete template with modern styling
- `zappts-dark-theme.scss` - Corporate business theme
- `card-theme.scss` - Card-based layout with Catppuccin colors
- `hyperflow-dark-theme.scss` - Technical presentation theme

Each theme demonstrates different approaches to color, typography, and layout design.

# Theme Reference

## Overview

This document provides a comprehensive reference for all available themes in the Pablo presentation system, including their color palettes, supported slide classes, and usage examples.

## Available Themes

### 1. Zappts Dark Theme (`zappts-dark-theme`)

**Purpose**: Corporate business presentations with professional dark styling

**Brand Colors**:
- Primary Blue: `#4285F4`
- Orange Accent: `#FFAB40`
- Teal: `#0097A7`
- Emphasis Gray: `#646B6B`
- Dark Background: `#1E1E1E`

**Typography**: Montserrat font family for professional appearance

**Supported Classes**:
- `proposal` - Proposal cover slide with client information
- `section-title` - Full-width section divider slides
- `title-content` - Title slide with content area
- `onecol` - Single column text layout
- `twocol` - Two-column layout with left/right content
- `main-topic` - Large topic announcement slides
- `title-sub-right` - Title with subtitle and right support box
- `title-sub-right-block` - Title with right image/content block

**Usage**:
```yaml
---
marp: true
theme: zappts-dark-theme
class: proposal
---
```

**Best For**: Corporate presentations, business proposals, client-facing materials

### 2. Card Theme (`card-theme`)

**Purpose**: Modern card-based layouts with Catppuccin color palette

**Brand Colors**:
- Base: `#1e1e2e` (Dark purple-blue)
- Mantle: `#181825` (Darker background)
- Surface: `#313244` (Card backgrounds)
- Text: `#cdd6f4` (Light blue-white)
- Subtext: `#a6adc8` (Muted text)
- Accent: `#f38ba8` (Pink accent)

**Typography**: Modern system font stack

**Supported Classes**:
- `title` - Main title slide
- `card-single` - Single content card
- `card-start` - First card in sequence
- `card-middle` - Middle card in sequence
- `card-end` - Final card in sequence

**Usage**:
```yaml
---
marp: true
theme: card-theme
class: title
---
```

**Best For**: Technical presentations, developer talks, modern design aesthetics

### 3. Hyperflow Dark Theme (`hyperflow-dark-theme`)

**Purpose**: Technical presentations with modern dark styling

**Brand Colors**:
- Primary: `#00D9FF` (Cyan)
- Secondary: `#FF6B35` (Orange)
- Background: `#0D1117` (GitHub dark)
- Surface: `#21262D` (Card background)
- Text: `#F0F6FC` (Light text)
- Muted: `#7D8590` (Muted text)

**Typography**: Inter font family for technical readability

**Supported Classes**:
- `title` - Main title slide
- `card-single` - Single content layout
- `section` - Section divider
- `code` - Code-focused slides

**Usage**:
```yaml
---
marp: true
theme: hyperflow-dark-theme
class: title
---
```

**Best For**: Technical documentation, software architecture, developer presentations

### 4. Example New Theme (`example-new-theme`)

**Purpose**: Template and demonstration theme showing customization possibilities

**Brand Colors**:
- Primary Brand: `#FF6B35` (Orange)
- Secondary Brand: `#004E89` (Navy Blue)
- Accent: `#40E0D0` (Turquoise)
- Background: `#1A1A1D` (Dark gray)
- Text: `#E8E8E8` (Light gray)

**Typography**: Roboto font family

**Supported Classes**:
- `title` - Main title slide with gradient background
- `card-single` - Content cards with accent borders
- `section` - Section dividers

**Usage**:
```yaml
---
marp: true
theme: example-new-theme
class: title
---
```

**Best For**: Theme development reference, custom branding examples

### 5. Light Theme (`light-theme`)

**Purpose**: Minimal light theme for simple presentations

**Brand Colors**:
- Background: `#FFFFFF` (White)
- Text: `#333333` (Dark gray)
- Accent: `#007ACC` (Blue)
- Muted: `#666666` (Medium gray)

**Typography**: System font stack

**Supported Classes**:
- `title` - Simple title slide
- `content` - Basic content layout

**Usage**:
```yaml
---
marp: true
theme: light-theme
class: title
---
```

**Best For**: Simple presentations, academic use, high contrast needs

### 6. Custom Theme (`custom-theme`)

**Purpose**: Base template for custom theme development

**Features**: Configurable base styles that can be extended for specific needs

**Usage**:
```yaml
---
marp: true
theme: custom-theme
class: title
---
```

**Best For**: Starting point for new theme development

## Slide Class Reference

### Universal Classes

These classes are supported across most themes:

#### `title`
Main title slide, typically used for presentation cover
- Large heading typography
- Centered layout
- Brand color accents

#### `card-single`
Single content card layout
- Contained content area
- Standard padding and margins
- Good for focused content

### Zappts Corporate Classes

#### `proposal`
Specialized cover slide for business proposals
- Client information area
- Proposal metadata
- Professional layout

**HTML Structure**:
```html
<div class="proposal-info">
Proposta N°: 25082207PTR.V1<br>
Emitida em 26 de Agosto de 2025<br>
Elaborada por: Team Name
</div>

<div class="proposal-title">
Proposta para a área comercial do
</div>

<img class="customer-logo" alt="Client Logo">
```

#### `section-title`
Full-width section divider slides
- Large text treatment
- Background emphasis
- Topic transition

#### `title-content`
Title with expandable content area
- Structured content presentation
- Good for detailed information
- Professional layout

**HTML Structure**:
```html
# Slide Title

<div class="content">
Main content goes here with proper styling
and spacing for professional presentations.
</div>
```

#### `onecol`
Single column text layout with emphasis support
- Full-width content
- Emphasis paragraph styling
- Good readability

**HTML Structure**:
```html
# Single Column Title

Regular paragraph content flows naturally.

<div class="para--emphasis">
**Highlighted content** appears with special styling
and accent colors for important information.
</div>
```

#### `twocol`
Two-column layout for comparisons
- Left and right content areas
- Grid-based responsive layout
- Good for before/after, pros/cons

**HTML Structure**:
```html
# Two Column Title

<div class="columns">
<div class="col--left">
Left column content
</div>
<div class="col--right">
Right column content
</div>
</div>
```

#### `main-topic`
Large topic announcement slides
- Minimal text
- High visual impact
- Topic transitions

#### `title-sub-right`
Title with subtitle and right support box
- Left content with title/subtitle
- Right sidebar with supporting information
- Professional business layout

**HTML Structure**:
```html
<div class="left-content">
# Main Title
<div class="subtitle">Subtitle text</div>
Main content area
</div>

<div class="support-box">
### Supporting Information
- Bullet points
- Additional details
- Contact info
</div>
```

#### `title-sub-right-block`
Title with right image/content block
- Left text content
- Right image or content block
- Visual emphasis

**HTML Structure**:
```html
<div class="left-content">
# Main Title
<div class="subtitle">Subtitle</div>
Content description
</div>

<div class="support-block">
<img class="support-image" src="image.jpg" alt="Description">
<div class="support-text">
Supporting text content
</div>
</div>
```

## Color Reference

### Zappts Corporate Colors

```css
:root {
  --zappts-primary-blue: #4285F4;
  --zappts-orange: #FFAB40;
  --zappts-teal: #0097A7;
  --zappts-gray: #646B6B;
  --zappts-dark-bg: #1E1E1E;
  --zappts-light-text: #E8E8E8;
}
```

### Catppuccin (Card Theme) Colors

```css
:root {
  --ctp-base: #1e1e2e;
  --ctp-mantle: #181825;
  --ctp-surface0: #313244;
  --ctp-text: #cdd6f4;
  --ctp-subtext0: #a6adc8;
  --ctp-pink: #f38ba8;
}
```

### Hyperflow Colors

```css
:root {
  --hf-primary-cyan: #00D9FF;
  --hf-orange: #FF6B35;
  --hf-dark-bg: #0D1117;
  --hf-surface: #21262D;
  --hf-text: #F0F6FC;
}
```

## Typography Reference

### Font Stacks by Theme

- **Zappts**: `'Montserrat', system-ui, sans-serif`
- **Card Theme**: `system-ui, -apple-system, sans-serif`
- **Hyperflow**: `'Inter', system-ui, sans-serif`
- **Example**: `'Roboto', 'Segoe UI', system-ui, sans-serif`
- **Light**: `system-ui, sans-serif`

### Heading Scales

Most themes follow this hierarchy:
- **h1**: 3.5rem (56px) - Main titles
- **h2**: 2.8rem (45px) - Section headers  
- **h3**: 2.2rem (35px) - Subsections
- **Body**: 1.75rem (28px) - Regular content

## Usage Examples

### Corporate Presentation

```yaml
---
marp: true
theme: zappts-dark-theme
class: proposal
---

<!-- Proposal cover slide -->
<div class="proposal-info">
Proposta N°: 2024-001<br>
Data: 03/09/2025
</div>

<div class="proposal-title">
Proposta Commercial
</div>

---

<!-- _class: section-title -->
# Project Overview

---

<!-- _class: title-content -->
# Solution Benefits

<div class="content">
Our proposed solution delivers measurable value through:
- Cost reduction of 40%
- Improved efficiency
- Enhanced user experience
</div>
```

### Technical Presentation

```yaml
---
marp: true
theme: hyperflow-dark-theme
class: title
---

# System Architecture
### Microservices Design Patterns
*Technical Deep Dive*

---

<!-- _class: card-single -->
## Core Components

- **API Gateway**: Request routing and authentication
- **Service Mesh**: Inter-service communication  
- **Event Bus**: Asynchronous messaging
- **Database Layer**: Distributed data storage
```

## Migration Guide

### From Old Themes

If you're using deprecated themes, migrate as follows:

1. **Update theme name** in frontmatter
2. **Check slide classes** - some may have changed
3. **Review color usage** - custom colors may need updates
4. **Test layouts** - verify all slides render correctly

### Theme Compatibility

- **Zappts themes** are backward compatible
- **Card themes** may need class updates
- **Custom themes** require individual review

## Performance Notes

- **Theme file sizes**: 15-25KB each (compiled)
- **Load time**: <100ms for theme switching
- **Browser support**: Modern browsers (ES2018+)
- **Mobile**: Responsive design in newer themes

## Contributing

To contribute new themes or improvements:

1. Create theme in `themes/` directory
2. Add to build configuration
3. Test with sample presentations
4. Document colors and classes
5. Submit with examples

# Theme Creation and Development Guide

## Overview

The Pablo presentation system includes several professionally designed themes, including the flagship **Zappts Theme** - an authentic corporate theme extracted from PowerPoint templates with precise brand identity.

## Available Themes

### Zappts Theme - Professional Corporate

The **Zappts Theme** is a professional business presentation theme with authentic brand identity:

**Brand Colors (Extracted from PowerPoint theme):**
- **Zappts Blue:** `#4285F4` - Main brand color 
- **Dark Gray:** `#212121` - Primary text
- **Orange:** `#FFAB40` - Accent highlights
- **Teal:** `#0097A7` - Links/secondary
- **White/Gray backgrounds:** `#FFFFFF`, `#EEEEEE`, `#F3F3F3`

**Typography:** Montserrat font family with hierarchical sizing

**Image Assets:** Professional background images and logos positioned authentically

### Other Available Themes
- `example-new-theme`: Custom brand colors (Orange, Navy, Turquoise)
- `card-theme`: Card-based layout with modern colors
- `light-theme`: Minimal light color scheme

## Zappts Theme Slide Types

The Zappts theme supports 8 different slide layouts optimized for business presentations:

### 1. Title/Proposal Slide

Perfect for proposal cover slides with client branding.

```markdown
<!-- _class: proposal -->

<div class="proposal-info">
Proposta N° 2024-001<br>
Data: 03/09/2025<br>
Autores: Equipe Técnica
</div>

<div class="proposal-title">
Proposta para a área comercial do
</div>

<img class="customer-logo" src="client-logo.png" alt="Client Logo">
```

**Key Features:**
- `.proposal-info`: Small, muted text for proposal details (top-right)
- `.proposal-title`: Large, centered title in brand color
- `.customer-logo`: Placeholder sized exactly 6.45cm × 1.40cm
- Full background image with blue overlay
- Centered Zappts logo

### 2. Section Title Slide  

Large, centered titles for major section breaks.

```markdown
<!-- _class: section-title -->

# Major Section Title
```

### 3. Simple Title & Content Slide

Standard content slide with title and body text.

```markdown
<!-- _class: title-content -->

# Slide Title

<div class="content">
Your content here with optimal line length and readable typography.
</div>
```

### 4. One Column with Emphasis

Title with body text including a highlighted/emphasized paragraph.

```markdown
<!-- _class: onecol -->

# Slide Title

Regular paragraph text here.

<div class="para--emphasis">
**Important highlight:** This paragraph gets special styling with background and accent border.
</div>

More regular content.
```

### 5. Two Columns Layout

Side-by-side content comparison or complementary information.

```markdown
<!-- _class: twocol -->

# Comparative Analysis

<div class="columns">
<div class="col--left">

### Left Column
- Point one
- Point two
- Point three

</div>
<div class="col--right">

### Right Column  
- Counter-point one
- Counter-point two
- Counter-point three

</div>
</div>
```

### 6. Main Topic Title

Standalone topic announcement with optional subtitle.

```markdown
<!-- _class: main-topic -->

# Major Topic Announcement

<div class="subtitle">
Optional subtitle or description
</div>
```

### 7. Title + Subtitle + Right Support Box

Content with supporting information in a styled sidebar.

```markdown
<!-- _class: title-sub-right -->

<div class="left-content">

# Primary Title

<div class="subtitle">
Brief subtitle or context
</div>

Main content goes here...

</div>

<div class="support-box">

### Supporting Info

- Additional details
- Key metrics  
- Reference material

</div>
```

### 8. Title + Subtitle + Right Image/Text Block

Similar to above but optimized for images with supporting text.

```markdown
<!-- _class: title-sub-right-block -->

<div class="left-content">

# Primary Title

<div class="subtitle">
Brief subtitle or context
</div>

Main content goes here...

</div>

<div class="support-block">

<img class="support-image" src="diagram.png" alt="Supporting diagram">

<div class="support-text">
**Caption or explanation** for the image above.
</div>

</div>
```

## Theme Development Workflow

- Added `example-new-theme.scss` to `build-theme.js` configuration
- Successfully compiled SCSS to CSS using the build system
- Generated `output/themes/example-new-theme.css` (5,263 bytes)

## 3. Created Demo Presentation

**File:** `example-new-theme-demo.md`
- 7 slides demonstrating theme features
- Title slide with gradient background
- Content slides showing typography hierarchy
- Code examples and tables
- Step-by-step theme creation guide
- Resource references

## 4. Built and Tested Theme

- Successfully compiled presentation to HTML (`example-new-theme-demo.html`)
- Verified theme rendering works correctly
- All theme elements display properly

## 5. Updated Documentation

**Enhanced WARP.md with comprehensive theme creation section:**
- Step-by-step theme creation process
- Theme structure guidelines  
- Required Marpit compatibility elements
- Recommended features checklist
- Complete workflow from SCSS to final presentation
- Reference to example theme template

## Files Created/Modified

### New Files:
1. `themes/example-new-theme.scss` - Complete theme template
2. `example-new-theme-demo.md` - Demo presentation
3. `example-new-theme-demo.html` - Compiled HTML output
4. `output/themes/example-new-theme.css` - Compiled CSS theme

### Modified Files:
1. `build-theme.js` - Added new theme to build list
2. `WARP.md` - Enhanced with theme creation documentation

## Theme Creation Workflow Summary

```bash
# 1. Create theme file
vim themes/your-theme-name.scss

# 2. Add to build configuration
# Edit build-theme.js: add 'your-theme-name.scss' to themeFiles array

# 3. Compile theme
node build-theme.js

# 4. Create presentation using theme
# Add to frontmatter: theme: your-theme-name

# 5. Build presentation
npx @marp-team/marp-cli presentation.md --theme-set output/themes --output presentation.html
```

## Theme Template Features

The `example-new-theme.scss` serves as a comprehensive template showing:

- **Color Management:** SCSS variables + CSS custom properties
- **Typography:** Font family, sizing, and hierarchy
- **Layout:** Proper slide dimensions and spacing
- **Visual Elements:** Gradients, borders, shadows
- **Component Styling:** Tables, code blocks, lists, blockquotes
- **Slide Classes:** Support for all card-based layouts
- **Accessibility:** Proper contrast and readable typography

## Next Steps for Theme Development

1. **Copy Template:** Use `example-new-theme.scss` as starting point
2. **Customize Colors:** Modify brand color variables
3. **Adjust Typography:** Change fonts and sizing
4. **Test Thoroughly:** Build presentations to verify styling
5. **Document Changes:** Update theme-specific documentation

This demonstration provides a complete, working example of the Pablo theme creation system in action.

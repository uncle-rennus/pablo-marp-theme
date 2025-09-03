# Zappts Theme Reference

## Overview

The **Zappts Theme** is a professional business presentation theme with authentic brand identity extracted directly from PowerPoint templates. It provides comprehensive styling for corporate presentations with precise color matching and professional layouts.

## Brand Identity

### Authentic Brand Colors

The theme uses the **exact color palette** found in the original PowerPoint theme:

**Primary Colors:**
- **Zappts Blue:** `#4285F4` (accent1 - Main brand color)
- **Dark Gray:** `#212121` (accent2 - Text color)
- **Medium Gray:** `#78909C` (accent3 - Supporting text)
- **Orange:** `#FFAB40` (accent4 - Accent highlights)
- **Teal:** `#0097A7` (accent5 - Links/secondary)
- **Yellow:** `#EEFF41` (accent6 - Highlights)

**Background Colors:**
- **White:** `#FFFFFF` (Primary background)
- **Light Gray:** `#EEEEEE` (Secondary background)
- **Very Light:** `#F3F3F3` (Alternative backgrounds)
- **Specific Gray:** `#646B6B` (Found in slide content)

### Typography

- **Font Family:** Montserrat (replacing Arial from original PowerPoint)
- **Hierarchical sizing:** 48px (H1), 36px (H2), 28px (H3), 24px (Body)
- **Font weights:** 700 (headings), 600 (subheadings), 500 (emphasis)

### Image Assets & Positioning

**Asset Files (Extracted from PPTX):**
- **`image1.png`** (22.9KB) - Background decoration
- **`image2.png`** (65.5KB) - High-resolution logo for title slides
- **`image5.png`** (38.9KB) - Standard logo for content slides
- **`image8.png`** (1889.5KB) - Background image for title slides

**Positioning System:**

**Regular Slides (non-title):**
- `image1.png`: Bottom-left corner decoration
- `image5.png`: Top-right corner logo, resized appropriately

**Title/Proposal Slides:**
- `image8.png`: Full background with cover sizing
- Blue overlay: 70% opacity over background using Zappts blue (#4285F4)
- `image2.png`: Centered logo with slide-proportional sizing

## Slide Type Reference

### 1. Title/Proposal Slide (`proposal` or `slide--proposal`)

```markdown
<!-- _class: proposal -->

<div class="proposal-info">
Proposta N°: 25082207PTR.V1<br>
Emitida em 26 de Agosto de 2025<br>
Elaborada por:<br>
Felipe Nadal (Business Director)<br>
Rodrigo Bornholdt (CTO)
</div>

<div class="proposal-title">
Proposta para a área comercial do
</div>

<img class="customer-logo" alt="Customer Logo Placeholder">
```

**Features:**
- Full background image with blue overlay
- Centered Zappts logo
- Proposal info in top-right corner
- Customer logo placeholder (6.45cm × 1.40cm exactly)

### 2. Section Title Slide (`section-title` or `slide--section-title`)

```markdown
<!-- _class: section-title -->

# Full section title
```

**Features:**
- Large centered title
- Orange underline accent
- Full screen centering

### 3. Simple Title & Content (`title-content` or `slide--title-content`)

```markdown
<!-- _class: title-content -->

# Simple Slide Title

<div class="content">
Your content here...
</div>
```

### 4. One Column with Emphasis (`onecol` or `slide--onecol`)

```markdown
<!-- _class: onecol -->

# One Column Title

<div class="para--emphasis">
**Important highlight:** Special styled paragraph
</div>
```

**Features:**
- Uses authentic `#646B6B` color from extracted slide data
- Special emphasis styling with background and border

### 5. Two Columns Layout (`twocol` or `slide--twocol`)

```markdown
<!-- _class: twocol -->

# Two Columns Title

<div class="columns">
<div class="col--left">
Left content...
</div>
<div class="col--right">
Right content...
</div>
</div>
```

### 6. Main Topic Title (`main-topic` or `slide--main-topic`)

```markdown
<!-- _class: main-topic -->

# Main topic Title

<div class="subtitle">
Optional subtitle or description
</div>
```

### 7. Title + Right Content Block (`title-sub-right`)

```markdown
<!-- _class: title-sub-right -->

<div class="left-content">
# Title
<div class="subtitle">Subtitle</div>
Main content...
</div>

<div class="support-box">
Supporting content in styled box...
</div>
```

### 8. Title + Right Image/Text Block (`title-sub-right-block`)

```markdown
<!-- _class: title-sub-right-block -->

<div class="left-content">
# Title
<div class="subtitle">Subtitle</div>
Main content...
</div>

<div class="support-block">
<img class="support-image" src="image.png">
<div class="support-text">
Caption or supporting text...
</div>
</div>
```

## Usage Instructions

### Basic Setup

```yaml
---
marp: true
theme: zappts-theme
class: proposal  # For title slide
---
```

### Building the Theme

```bash
# Build theme from SCSS source
node build-theme.js

# Render presentation
npx @marp-team/marp-cli presentation.md --theme-set output/themes --output presentation.html
```

### Asset Management

- Assets are located in `themes/assets/`
- Images are automatically positioned using CSS
- No manual positioning required in markdown content
- Theme handles all layout and positioning

## Card-Based Classes

The theme also supports automated card generation classes:

- `card-single`: Single standalone slide
- `card-start`: First slide in a series
- `card-middle`: Middle slides in a series  
- `card-end`: Final slide in a series
- `title`: Automatically detected title slides

These classes are applied automatically by the preprocessor system based on content structure.

## Best Practices

1. **Use semantic HTML structure** for complex layouts
2. **Leverage the proposal slide** for client presentations
3. **Utilize emphasis blocks** for important information
4. **Keep two-column layouts balanced** for visual harmony
5. **Test with authentic assets** to ensure proper positioning
6. **Maintain brand consistency** across all slides

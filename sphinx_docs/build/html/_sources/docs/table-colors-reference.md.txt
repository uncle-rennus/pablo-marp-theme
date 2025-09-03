# Table Colors Reference - Zappts Dark Theme

## Quick Reference

### Table Row Background Colors

| Element | Variable | Color | Hex Code |
|---------|----------|-------|----------|
| **Header Row** | `$table-header-bg` | Light Blue | `#0A85CC` |
| **Regular Rows** | `$table-row-bg` | Dark Navy | `#0f1120` |
| **Even Rows** | `$table-row-alt-bg` | Darkest Navy | `#0c0e1a` |

### Table Text Colors

| Element | Variable | Color | Hex Code |
|---------|----------|-------|----------|
| **Header Text** | `$table-header-text` | White | `#FFFFFF` |
| **Cell Text** | `$table-text` | White | `#FFFFFF` |
| **Strong Text** | `$ctp-green` | Light Gray | `#F0F0F0` |

### Table Borders

| Element | Variable | Color | Hex Code |
|---------|----------|-------|----------|
| **Cell Borders** | `$table-border-color` | Light Blue | `#1a93d4` |

## Visual Pattern

```
┌─────────────────────────────────────┐
│ Header Row (Light Blue: #0A85CC)    │ ← $table-header-bg
├─────────────────────────────────────┤
│ Row 1 (Dark Navy: #0f1120)          │ ← $table-row-bg
├─────────────────────────────────────┤
│ Row 2 (Darkest Navy: #0c0e1a)       │ ← $table-row-alt-bg
├─────────────────────────────────────┤
│ Row 3 (Dark Navy: #0f1120)          │ ← $table-row-bg
├─────────────────────────────────────┤
│ Row 4 (Darkest Navy: #0c0e1a)       │ ← $table-row-alt-bg
└─────────────────────────────────────┘
```

## Configuration

All table colors are defined in `themes/zappts-dark-theme.config.scss`:

```scss
// Table colors
$table-header-bg: $ctp-surface0 !default;  // Light blue for headers
$table-header-text: $ctp-mauve !default;   // White text for headers
$table-row-bg: $ctp-mantle !default;       // Dark navy for regular rows
$table-row-alt-bg: $ctp-crust !default;    // Darkest navy for alternating rows
$table-border-color: $ctp-surface1 !default; // Light blue for borders
$table-text: $ctp-text !default;           // White text for table content
```

## Customization

To change table colors, modify the variables in `themes/zappts-dark-theme.config.scss` and rebuild the theme:

```bash
npm run build
``` 
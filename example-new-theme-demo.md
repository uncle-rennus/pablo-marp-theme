---
marp: true
theme: example-new-theme
class: title
---

<!-- _class: title -->

# Example New Theme Demo
### A Custom Theme with Brand Colors
*Created using the Pablo theme creation system*

---

<!-- _class: card-single -->

# Theme Overview

This is the **example-new-theme** demonstration showing:

- Custom orange and navy brand colors
- Gradient title slide backgrounds
- Professional typography with Roboto
- Accent bars and visual elements
- *Styled emphasis* and **strong text**

---

<!-- _class: card-single -->

## Features Showcase

### Visual Design Elements
- 🎨 **Primary Brand Color:** Orange (#FF6B35)  
- 🔵 **Secondary Brand Color:** Navy Blue (#004E89)
- ✨ **Accent Color:** Turquoise (#40E0D0)
- 🌙 **Background:** Dark theme with professional contrast

### Typography & Layout
- Modern **Roboto** font family
- Hierarchical heading styles with color coding
- Clean spacing and readability optimization

---

<!-- _class: card-single -->

# Code Examples

Here's how to use this theme:

```yaml
---
marp: true
theme: example-new-theme
class: title
---
```

You can also use inline `code snippets` that are styled with the brand colors.

> **Pro Tip:** This blockquote style uses the primary brand color for the border and a subtle background tint.

---

<!-- _class: card-single -->

## Table Example

| Feature | Status | Notes |
|---------|--------|--------|
| Brand Colors | ✅ Complete | Orange & Navy palette |
| Typography | ✅ Complete | Roboto font family |
| Layout System | ✅ Complete | Card-based sections |
| Responsive | 🔄 In Progress | Mobile optimization |

---

<!-- _class: card-single -->

# Creating Your Own Theme

To create a new theme like this one:

1. **Copy the template** - Start with `example-new-theme.scss`
2. **Customize colors** - Update the `$primary-brand`, `$secondary-brand` variables
3. **Modify typography** - Change `$font-family` and sizing variables  
4. **Add to build** - Include your `.scss` file in `build-theme.js`
5. **Compile** - Run `node build-theme.js` to generate CSS
6. **Test** - Create a presentation using your theme

---

<!-- _class: card-single -->

# Resources & Next Steps

### Theme System Files
- **Theme Source:** `themes/example-new-theme.scss`
- **Compiled Output:** `output/themes/example-new-theme.css`
- **Build Script:** `build-theme.js`

### Documentation
- Check `WARP.md` for theme development guidelines
- Explore existing themes for inspiration
- Use watch mode: `node build-theme.js watch`

*Happy theme creating! 🎨*

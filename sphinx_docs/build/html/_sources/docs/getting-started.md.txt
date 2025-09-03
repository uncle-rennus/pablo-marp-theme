# Getting Started

Pablo is a sophisticated Marpit-based presentation system with a three-stage processing pipeline that supports intelligent slide generation, markdown-in-HTML rendering, and automated content processing.

## Prerequisites

- Node.js 16+ 
- Python 3+ (for HTTP server)
- PowerShell (for Windows automation)

## Installation

1. **Clone/Download** the project
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Start the development server:
```bash
npm run serve
# or for development (builds themes + starts server)
npm run dev
```

### Build the presentation:
```bash
npm run build:presentation
```

### View the presentation:
Open `http://localhost:1234/output/zappts-AI-as-a-service.html`

## Quick Start Example

Create your presentation in Markdown format with semantic structure:

```markdown
---
marp: true
theme: zappts-dark-theme
---

# Main Title

## Section Heading

Your content here with automatic slide generation.

<div class="sources">
  **Fontes:**
  - [Source 1](https://example.com)
  - [Source 2](https://example.com)
</div>

## Another Section

More content that will be intelligently split into slides.
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build:presentation` | Complete pipeline: preprocess → Marp → post-process |
| `npm run build` | Build SCSS themes |
| `npm run serve` | Start development server (port 1234) |
| `npm run dev` | Build themes and start server |
| `npm run live` | Start live-server with auto-refresh (port 1234) |

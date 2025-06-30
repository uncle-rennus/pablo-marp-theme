#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const inputFile = path.join(__dirname, 'zappts-AI-as-a-service.html');
const md = new MarkdownIt({ html: true, linkify: true });

let html = fs.readFileSync(inputFile, 'utf8');

// Process <div class="sources">...</div>
html = html.replace(/<div class="sources">([\s\S]*?)<\/div>/g, (match, content) => {
  // Remove leading/trailing whitespace
  const inner = content.trim();
  // Render markdown
  const rendered = md.render(inner);
  // Remove wrapping <p> if only one block
  const clean = rendered.replace(/^<p>([\s\S]*)<\/p>$/m, '$1');
  return `<div class="sources">${clean}</div>`;
});

// Process <table>...</table> (if table markdown is present as raw text)
// If you want to support markdown tables inside <table>...</table>,
// you can add a similar block here. For now, we assume tables are already HTML.

fs.writeFileSync(inputFile, html);

console.log('✅ Post-processed Marp HTML for markdown-in-divs.'); 
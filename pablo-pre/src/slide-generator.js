import { config } from '../pablo-pre.config.js';

export class PabloSlideGenerator {
  constructor(options = {}) {
    this.config = { ...config, ...options };
  }

  processMarkdown(markdown) {
    const lines = markdown.split('\n');
    let slides = [];
    let currentSlide = this.newSlide();
    let cardState = 'single'; // single, start, middle, end

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === '---') {
        slides.push(this.finalizeSlide(currentSlide, cardState));
        currentSlide = this.newSlide();
        cardState = 'single';
        continue;
      }

      if (currentSlide.lines.length >= this.config.maxLinesPerCard) {
        if (cardState === 'single') {
          cardState = 'start';
          currentSlide.class = 'card-start';
        } else {
          currentSlide.class = 'card-middle';
        }
        slides.push(this.finalizeSlide(currentSlide, cardState));
        currentSlide = this.newSlide();
        currentSlide.lines.push(line);
        cardState = 'middle';
      } else {
        currentSlide.lines.push(line);
      }
    }

    if (cardState === 'middle') {
      cardState = 'end';
    }
    slides.push(this.finalizeSlide(currentSlide, cardState));

    return slides.map(s => s.content).join('\n\n---\n\n');
  }

  newSlide() {
    return { lines: [], class: 'card-single', content: '' };
  }

  finalizeSlide(slide, cardState) {
    if (cardState === 'end') {
      slide.class = 'card-end';
    }

    let content = `<!-- _class: ${slide.class} -->\n`;
    let hasTitle = false;

    for (let i = 0; i < slide.lines.length; i++) {
      const line = slide.lines[i];
      if (line.startsWith('# ') && i === 0) {
        slide.class = 'title';
        content = `<!-- _class: ${slide.class} -->\n`;
        content += `${line}\n`;
        hasTitle = true;
      } else if (line.startsWith('## ') && !hasTitle) {
        content += `<div class="slide-title">${line.substring(3)}</div>\n`;
        hasTitle = true;
      } else {
        content += `${line}\n`;
      }
    }

    slide.content = content;
    return slide;
  }
}
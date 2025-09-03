/**
 * Slide Generator - Card-based slide generation with smart splitting
 */
export class SlideGenerator {
  constructor(config = {}) {
    this.maxLines = config.maxLinesPerCard || 20;
    this.autoSplitting = config.autoSplitting ?? true;
  }

  processMarkdown(markdown) {
    if (!this.autoSplitting) return markdown;

    const lines = markdown.split('\n');
    const slides = [];
    let currentSlide = { lines: [], class: 'card-single' };
    let cardState = 'single';

    for (const line of lines) {
      if (line.trim() === '---') {
        if (currentSlide.lines.length > 0) {
          slides.push(this.finalizeSlide(currentSlide, cardState));
        }
        currentSlide = { lines: [], class: 'card-single' };
        cardState = 'single';
        continue;
      }

      // Auto-split if too many lines
      if (currentSlide.lines.length >= this.maxLines) {
        cardState = cardState === 'single' ? 'start' : 'middle';
        currentSlide.class = `card-${cardState}`;
        slides.push(this.finalizeSlide(currentSlide, cardState));
        
        currentSlide = { lines: [line], class: 'card-middle' };
        cardState = 'middle';
      } else {
        currentSlide.lines.push(line);
      }
    }

    // Finalize last slide
    if (currentSlide.lines.length > 0) {
      if (cardState === 'middle') cardState = 'end';
      slides.push(this.finalizeSlide(currentSlide, cardState));
    }

    return slides.map(s => s.content).join('\n\n---\n\n');
  }

  finalizeSlide(slide, cardState) {
    if (cardState === 'end') slide.class = 'card-end';
    
    // Check if first line is title
    if (slide.lines[0]?.startsWith('# ')) {
      slide.class = 'title';
    }

    let content = `<!-- _class: ${slide.class} -->\n`;
    content += slide.lines.join('\n');
    
    return { ...slide, content };
  }
}

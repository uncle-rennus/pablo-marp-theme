const { Marpit } = require('@marp-team/marpit');

// Custom Marpit extension for processing sources divs and tables
const customElementsExtension = () => {
  return (marpit) => {
    // Store original renderer
    const originalRenderer = marpit.renderer.html;

    // Override the HTML renderer
    marpit.renderer.html = function (tokens, options) {
      let html = originalRenderer.call(this, tokens, options);
      
      // Process sources divs
      html = processSourcesDivs(html);
      
      // Process tables (if needed)
      html = processTables(html);
      
      return html;
    };
  };
};

// Process sources divs - convert markdown inside to HTML
function processSourcesDivs(html) {
  return html.replace(
    /<div class="sources">([\s\S]*?)<\/div>/g,
    (match, content) => {
      console.log('Processing sources div:', content);
      
      // Convert markdown links to HTML and bold text only
      // Do NOT process lists here - postprocess-marp-html.js handles full markdown rendering
      let processedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      
      console.log('Processed content:', processedContent);
      
      return `<div class="sources">${processedContent}</div>`;
    }
  );
}

// Process tables - ensure proper rendering
function processTables(html) {
  return html.replace(
    /<table>([\s\S]*?)<\/table>/g,
    (match, content) => {
      // Ensure table has proper styling classes
      return `<table class="marpit-table">${content}</table>`;
    }
  );
}

// Alternative: Post-processing extension
const postProcessExtension = () => {
  return (marpit) => {
    // Hook into the final HTML output
    const originalRender = marpit.render.bind(marpit);
    
    marpit.render = function(markdown, options) {
      const result = originalRender(markdown, options);
      
      // Post-process the HTML
      result.html = processSourcesDivs(result.html);
      result.html = processTables(result.html);
      
      return result;
    };
  };
};

// Usage example
function createMarpitWithExtensions() {
  const marpit = new Marpit({
    html: true,
    math: { mathjax: true }
  });
  
  // Apply extensions
  marpit.use(customElementsExtension());
  marpit.use(postProcessExtension());
  
  return marpit;
}

module.exports = {
  customElementsExtension,
  postProcessExtension,
  createMarpitWithExtensions,
  processSourcesDivs,
  processTables
}; 
#!/usr/bin/env node

/**
 * PPTX Asset Extraction Script
 * Extracts images, colors, fonts, and layout data from PPTX files for theme development
 * 
 * Usage: node extract-pptx-assets.js <path-to-pptx> [output-dir]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

class PPTXExtractor {
  constructor(pptxPath, outputDir = './extracted-assets') {
    this.pptxPath = path.resolve(pptxPath);
    this.outputDir = path.resolve(outputDir);
    this.tempDir = path.join(this.outputDir, 'temp');
    this.assets = {
      images: [],
      colors: [],
      fonts: [],
      layouts: [],
      theme: {},
      slides: []
    };
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.outputDir, this.tempDir, 
     path.join(this.outputDir, 'images'),
     path.join(this.outputDir, 'analysis')
    ].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async extract() {
    console.log(`[INFO] Extracting assets from: ${this.pptxPath}`);
    
    try {
      // Step 1: Unzip PPTX file
      await this.unzipPPTX();
      
      // Step 2: Extract images
      await this.extractImages();
      
      // Step 3: Parse theme data
      await this.parseTheme();
      
      // Step 4: Parse slide layouts
      await this.parseSlideLayouts();
      
      // Step 5: Extract colors and fonts
      await this.extractColorsAndFonts();
      
      // Step 6: Generate analysis report
      await this.generateReport();
      
      // Step 7: Clean up temp files
      await this.cleanup();
      
      console.log(`[SUCCESS] Assets extracted to: ${this.outputDir}`);
      return this.assets;
      
    } catch (error) {
      console.error(`[ERROR] Extraction failed:`, error.message);
      throw error;
    }
  }

  async unzipPPTX() {
    console.log('[STEP 1] Unzipping PPTX file...');
    
    try {
      const zip = new AdmZip(this.pptxPath);
      zip.extractAllTo(this.tempDir, true);
      console.log('[OK] PPTX unzipped successfully');
    } catch (error) {
      throw new Error(`Failed to unzip PPTX: ${error.message}`);
    }
  }

  async extractImages() {
    console.log('[STEP 2] Extracting images...');
    
    const mediaPath = path.join(this.tempDir, 'ppt', 'media');
    const imagesOutputPath = path.join(this.outputDir, 'images');
    
    if (fs.existsSync(mediaPath)) {
      const files = fs.readdirSync(mediaPath);
      
      for (const file of files) {
        const srcPath = path.join(mediaPath, file);
        const destPath = path.join(imagesOutputPath, file);
        
        fs.copyFileSync(srcPath, destPath);
        
        const stats = fs.statSync(destPath);
        this.assets.images.push({
          filename: file,
          path: destPath,
          size: stats.size,
          extension: path.extname(file).toLowerCase()
        });
      }
      
      console.log(`[OK] Extracted ${files.length} images`);
    } else {
      console.log('[WARN] No media folder found in PPTX');
    }
  }

  async parseTheme() {
    console.log('[STEP 3] Parsing theme data...');
    
    const themePath = path.join(this.tempDir, 'ppt', 'theme');
    
    if (fs.existsSync(themePath)) {
      const themeFiles = fs.readdirSync(themePath);
      
      for (const themeFile of themeFiles) {
        if (themeFile.endsWith('.xml')) {
          const themeXmlPath = path.join(themePath, themeFile);
          const themeXml = fs.readFileSync(themeXmlPath, 'utf8');
          
          // Extract color scheme
          this.parseColorScheme(themeXml);
          
          // Extract font scheme
          this.parseFontScheme(themeXml);
          
          this.assets.theme[themeFile] = {
            path: themeXmlPath,
            content: themeXml
          };
        }
      }
      
      console.log('[OK] Theme data parsed');
    } else {
      console.log('[WARN] No theme folder found');
    }
  }

  parseColorScheme(xml) {
    // Extract color scheme from theme XML
    const colorRegex = /<a:srgbClr val="([A-Fa-f0-9]{6})"/g;
    const colors = [];
    let match;
    
    while ((match = colorRegex.exec(xml)) !== null) {
      const color = `#${match[1]}`;
      if (!colors.includes(color)) {
        colors.push(color);
      }
    }
    
    this.assets.colors = [...this.assets.colors, ...colors];
  }

  parseFontScheme(xml) {
    // Extract font information from theme XML
    const fontRegex = /<a:latin typeface="([^"]+)"/g;
    const fonts = [];
    let match;
    
    while ((match = fontRegex.exec(xml)) !== null) {
      const font = match[1];
      if (!fonts.includes(font)) {
        fonts.push(font);
      }
    }
    
    this.assets.fonts = [...this.assets.fonts, ...fonts];
  }

  async parseSlideLayouts() {
    console.log('[STEP 4] Parsing slide layouts...');
    
    const slideLayoutsPath = path.join(this.tempDir, 'ppt', 'slideLayouts');
    const slidesPath = path.join(this.tempDir, 'ppt', 'slides');
    
    // Parse slide layouts
    if (fs.existsSync(slideLayoutsPath)) {
      const layoutFiles = fs.readdirSync(slideLayoutsPath)
        .filter(file => file.endsWith('.xml'));
      
      for (const layoutFile of layoutFiles) {
        const layoutXmlPath = path.join(slideLayoutsPath, layoutFile);
        const layoutXml = fs.readFileSync(layoutXmlPath, 'utf8');
        
        const layout = this.parseLayoutStructure(layoutXml);
        layout.filename = layoutFile;
        
        this.assets.layouts.push(layout);
      }
    }
    
    // Parse actual slides
    if (fs.existsSync(slidesPath)) {
      const slideFiles = fs.readdirSync(slidesPath)
        .filter(file => file.endsWith('.xml'))
        .sort((a, b) => {
          const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
          const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
          return aNum - bNum;
        });
      
      for (const slideFile of slideFiles) {
        const slideXmlPath = path.join(slidesPath, slideFile);
        const slideXml = fs.readFileSync(slideXmlPath, 'utf8');
        
        const slide = this.parseSlideStructure(slideXml);
        slide.filename = slideFile;
        slide.slideNumber = parseInt(slideFile.match(/\d+/)?.[0] || '0');
        
        this.assets.slides.push(slide);
      }
    }
    
    console.log(`[OK] Parsed ${this.assets.layouts.length} layouts and ${this.assets.slides.length} slides`);
  }

  parseLayoutStructure(xml) {
    // Extract layout information from XML
    const layout = {
      placeholders: [],
      background: null,
      dimensions: { width: 0, height: 0 }
    };
    
    // Extract placeholder information
    const placeholderRegex = /<p:ph[^>]*type="([^"]*)"[^>]*>/g;
    let match;
    while ((match = placeholderRegex.exec(xml)) !== null) {
      layout.placeholders.push(match[1]);
    }
    
    // Extract dimensions if present
    const dimRegex = /<p:sldSz cx="(\d+)" cy="(\d+)"/;
    const dimMatch = xml.match(dimRegex);
    if (dimMatch) {
      layout.dimensions.width = parseInt(dimMatch[1]);
      layout.dimensions.height = parseInt(dimMatch[2]);
    }
    
    return layout;
  }

  parseSlideStructure(xml) {
    const slide = {
      textContent: [],
      images: [],
      shapes: [],
      colors: [],
      layout: null
    };
    
    // Extract text content
    const textRegex = /<a:t>([^<]+)<\/a:t>/g;
    let match;
    while ((match = textRegex.exec(xml)) !== null) {
      slide.textContent.push(match[1].trim());
    }
    
    // Extract image references
    const imageRefRegex = /<a:blip r:embed="([^"]+)"/g;
    while ((match = imageRefRegex.exec(xml)) !== null) {
      slide.images.push(match[1]);
    }
    
    // Extract color information
    const colorRegex = /<a:srgbClr val="([A-Fa-f0-9]{6})"/g;
    while ((match = colorRegex.exec(xml)) !== null) {
      const color = `#${match[1]}`;
      if (!slide.colors.includes(color)) {
        slide.colors.push(color);
      }
    }
    
    return slide;
  }

  async extractColorsAndFonts() {
    console.log('[STEP 5] Extracting colors and fonts...');
    
    // Remove duplicates and sort
    this.assets.colors = [...new Set(this.assets.colors)].sort();
    this.assets.fonts = [...new Set(this.assets.fonts)].sort();
    
    console.log(`[OK] Found ${this.assets.colors.length} colors and ${this.assets.fonts.length} fonts`);
  }

  async generateReport() {
    console.log('[STEP 6] Generating analysis report...');
    
    const report = {
      extractedAt: new Date().toISOString(),
      sourceFile: this.pptxPath,
      summary: {
        totalImages: this.assets.images.length,
        totalColors: this.assets.colors.length,
        totalFonts: this.assets.fonts.length,
        totalLayouts: this.assets.layouts.length,
        totalSlides: this.assets.slides.length
      },
      assets: this.assets
    };
    
    // Generate detailed analysis
    const analysisReport = this.generateDetailedAnalysis();
    
    // Save reports
    const reportPath = path.join(this.outputDir, 'analysis', 'extraction-report.json');
    const analysisPath = path.join(this.outputDir, 'analysis', 'detailed-analysis.md');
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    fs.writeFileSync(analysisPath, analysisReport);
    
    console.log('[OK] Reports generated');
  }

  generateDetailedAnalysis() {
    let analysis = `# PPTX Asset Extraction Analysis\n\n`;
    analysis += `**Source:** ${path.basename(this.pptxPath)}\n`;
    analysis += `**Extracted:** ${new Date().toLocaleString()}\n\n`;
    
    // Images section
    analysis += `## Images (${this.assets.images.length})\n\n`;
    this.assets.images.forEach(img => {
      analysis += `- **${img.filename}** (${(img.size / 1024).toFixed(1)}KB) - ${img.extension}\n`;
    });
    
    // Colors section
    analysis += `\n## Colors (${this.assets.colors.length})\n\n`;
    this.assets.colors.forEach(color => {
      analysis += `- \`${color}\` ![${color}](https://via.placeholder.com/15/${color.substring(1)}/${color.substring(1)}.png)\n`;
    });
    
    // Fonts section
    analysis += `\n## Fonts (${this.assets.fonts.length})\n\n`;
    this.assets.fonts.forEach(font => {
      analysis += `- **${font}**\n`;
    });
    
    // Slides section
    analysis += `\n## Slides Analysis (${this.assets.slides.length})\n\n`;
    this.assets.slides.forEach((slide, index) => {
      analysis += `### Slide ${slide.slideNumber || index + 1}\n`;
      analysis += `- **Text elements:** ${slide.textContent.length}\n`;
      analysis += `- **Images:** ${slide.images.length}\n`;
      analysis += `- **Colors:** ${slide.colors.join(', ')}\n`;
      if (slide.textContent.length > 0) {
        analysis += `- **Sample text:** "${slide.textContent[0].substring(0, 50)}${slide.textContent[0].length > 50 ? '...' : ''}"\n`;
      }
      analysis += `\n`;
    });
    
    return analysis;
  }

  async cleanup() {
    console.log('[STEP 7] Cleaning up temporary files...');
    
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
      console.log('[OK] Temporary files cleaned');
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
PPTX Asset Extraction Tool

Usage: node extract-pptx-assets.js <path-to-pptx> [output-dir]

Examples:
  node extract-pptx-assets.js presentation.pptx
  node extract-pptx-assets.js ./slides/deck.pptx ./my-assets

This tool extracts:
- Images and media files
- Color schemes and palettes  
- Font information
- Slide layouts and structure
- Theme data
    `);
    process.exit(1);
  }
  
  const pptxPath = args[0];
  const outputDir = args[1] || './extracted-assets';
  
  if (!fs.existsSync(pptxPath)) {
    console.error(`[ERROR] File not found: ${pptxPath}`);
    process.exit(1);
  }
  
  try {
    const extractor = new PPTXExtractor(pptxPath, outputDir);
    const assets = await extractor.extract();
    
    console.log('\n' + '='.repeat(50));
    console.log('EXTRACTION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Images extracted: ${assets.images.length}`);
    console.log(`Colors found: ${assets.colors.length}`);
    console.log(`Fonts detected: ${assets.fonts.length}`);
    console.log(`Slide layouts: ${assets.layouts.length}`);
    console.log(`Total slides: ${assets.slides.length}`);
    console.log(`\nAssets saved to: ${outputDir}`);
    console.log(`Analysis report: ${outputDir}/analysis/`);
    
  } catch (error) {
    console.error(`[FATAL] ${error.message}`);
    process.exit(1);
  }
}

// Export for module use
module.exports = PPTXExtractor;

// Run if called directly
if (require.main === module) {
  main();
}

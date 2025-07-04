#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting presentation build...');

// Get input file from command line arguments
const inputFile = process.argv[2] || 'zappts-AI-as-a-service.source.md';

// Check if source file exists
let sourceFile = inputFile;
if (!sourceFile.endsWith('.source.md')) {
    const possibleSourceFile = inputFile.replace('.md', '.source.md');
    if (fs.existsSync(possibleSourceFile)) {
        sourceFile = possibleSourceFile;
    }
}

if (!fs.existsSync(sourceFile)) {
    console.error(`❌ Input file not found: ${sourceFile}`);
    process.exit(1);
}

// Determine output file name
const processedFile = sourceFile.replace('.source.md', '.md');
const outputHtmlFile = processedFile.replace('.md', '.html');

// Clear only specific files for this build
console.log('🧹 Clearing cache and old files...');
const outputDir = path.join(__dirname, 'output');
if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    files.forEach(file => {
        // Only remove backup files and the specific HTML file being built
        if (file.includes('.backup.') || file === outputHtmlFile) {
            fs.unlinkSync(path.join(outputDir, file));
        }
    });
}
console.log('✅ Cache cleared');

// Preprocess markdown
console.log('🔄 Preprocessing markdown...');
try {
    const { PabloSlideGenerator } = require('./src/preprocessor/index.js');
    const generator = new PabloSlideGenerator();
    const processedMarkdown = generator.processMarkdown(fs.readFileSync(sourceFile, 'utf8'));
    
    // Write processed markdown
    fs.writeFileSync(processedFile, processedMarkdown);
    console.log('✅ Preprocessing completed successfully');
} catch (error) {
    console.error('❌ Preprocessing failed:', error.message);
    process.exit(1);
}

// Build themes
console.log('🎨 Building themes...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Themes built successfully');
} catch (error) {
    console.error('❌ Theme build failed');
    process.exit(1);
}

// Build with Marp
console.log('📝 Building presentation with Marp...');
try {
    execSync(`marp ${processedFile} --output output/${outputHtmlFile} --config-file marp.config.js --html --allow-local-files`, { stdio: 'pipe' });
    console.log('✅ Marp build completed successfully');
} catch (error) {
    console.error('❌ Marp build failed:', error.message);
    process.exit(1);
}

// Post-process HTML
console.log('🔧 Post-processing HTML for markdown-in-divs...');
try {
    execSync(`node postprocess-marp-html.js output/${outputHtmlFile}`, { stdio: 'inherit' });
    console.log('✅ Post-processing completed successfully');
} catch (error) {
    console.error('❌ Post-processing failed');
    process.exit(1);
}

console.log('\n🎉 Build completed successfully!');
console.log(`📄 Presentation ready at: http://localhost:8000/output/${outputHtmlFile}`);
console.log('💡 Run "npm run serve" to start the Node.js development server');
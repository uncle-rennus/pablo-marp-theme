import { config as defaultConfig } from '../../pablo.config.js';
import fm from 'front-matter';

export class PabloSlideGenerator {
    constructor(options = {}) {
        this.config = { ...defaultConfig, ...options };
    }

    processMarkdown(markdown) {
        const content = fm(markdown);
        const frontMatter = content.attributes;
        let body = content.body;

        // Step 1: Extract and format sources section into an HTML block
        const { modifiedBody, sourcesHtml } = this.extractAndFormatSources(body);
        body = modifiedBody;

        // Step 2: Extract and replace special HTML blocks (left-notes, sources) with placeholders
        const htmlBlockPlaceholders = [];
        body = body.replace(/(<div class="(left-notes|sources)">[\s\S]*?<\/div>)/g, (match) => {
            htmlBlockPlaceholders.push(match);
            return `__HTML_BLOCK_${htmlBlockPlaceholders.length - 1}__`;
        });

        // If sources were found and formatted, add them to placeholders
        if (sourcesHtml) {
            if (Array.isArray(sourcesHtml)) {
                // Multiple sources sections found
                sourcesHtml.forEach((html, index) => {
                    htmlBlockPlaceholders.push(html);
                });
            } else {
                // Single sources section (backward compatibility)
                htmlBlockPlaceholders.push(sourcesHtml);
                // Only append placeholder if it wasn't already inserted in the body
                if (!body.includes('__HTML_BLOCK_0__')) {
                    body += `\n\n__HTML_BLOCK_${htmlBlockPlaceholders.length - 1}__`;
                }
            }
        }

        // Step 2: Parse body into semantic blocks
        const semanticBlocks = this.parseBodyIntoSemanticBlocks(body);

        // Step 3: Chunk semantic blocks into slides
        const slides = this.chunkSemanticBlocksIntoSlides(semanticBlocks);

        // Step 4: Re-insert HTML blocks into slides
        const slidesWithReinsertedHtml = slides.map(slideContent => {
            return slideContent.replace(/__HTML_BLOCK_(\d+)__/g, (match, index) => htmlBlockPlaceholders[parseInt(index)]);
        });

        // Step 5: Apply card classes and join slides
        const slidesWithClasses = this.applyCardClasses(slidesWithReinsertedHtml);

        // Reconstruct frontmatter properly
        const frontMatterLines = [];
        for (const [key, value] of Object.entries(frontMatter)) {
            frontMatterLines.push(`${key}: ${value}`);
        }
        const frontMatterString = frontMatterLines.join('\n');

        return `---\n${frontMatterString}\n---\n\n${slidesWithClasses.join('\n\n---\n\n')}`;
    }

    /**
     * Parses the markdown body into an array of semantic blocks.
     * Each block is a logical unit of content (e.g., a heading and its content, an HTML block).
     * @param {string} body - The markdown body with HTML placeholders.
     * @returns {Array<object>} - Array of semantic block objects { type, content, estimatedHeight }.
     */
    parseBodyIntoSemanticBlocks(body) {
        const blocks = [];
        const lines = body.split('\n');
        let currentBlockLines = [];
        let currentBlockType = 'paragraph';

        const addCurrentBlock = () => {
            if (currentBlockLines.length > 0) {
                const content = currentBlockLines.join('\n');
                blocks.push({
                    type: currentBlockType,
                    content: content,
                    estimatedHeight: this.estimateBlockHeight(content)
                });
            }
            currentBlockLines = [];
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.trim() === '---') { // Manual slide separator
                addCurrentBlock();
                // Check if the next block is just an HTML block (sources) - if so, merge it with previous content
                const nextLines = lines.slice(i + 1);
                const nextNonEmptyLine = nextLines.find(line => line.trim() !== '');
                if (nextNonEmptyLine && nextNonEmptyLine.startsWith('__HTML_BLOCK_')) {
                    // Skip this separator - the HTML block will be merged with previous content
                    continue;
                }
                blocks.push({ type: 'separator', content: '---', estimatedHeight: 0 });
                currentBlockType = 'paragraph'; // Reset type
                continue;
            }

            if (line.startsWith('# ')) { // H1 - Title slide content
                addCurrentBlock();
                currentBlockType = 'title-content';
                currentBlockLines.push(line);
            } else if (line.startsWith('## ')) { // H2 - Content section heading
                addCurrentBlock();
                currentBlockType = 'h2-section';
                currentBlockLines.push(line);
            } else if (line.startsWith('### ')) { // H3 - Content section heading
                addCurrentBlock();
                currentBlockType = 'h3-section';
                currentBlockLines.push(line);
            } else if (line.startsWith('__HTML_BLOCK_')) { // HTML placeholder
                addCurrentBlock();
                currentBlockType = 'html-block';
                currentBlockLines.push(line);
            } else if (line.trim() === '') { // Blank line
                if (currentBlockLines.length > 0 && currentBlockLines[currentBlockLines.length - 1].trim() !== '') {
                    currentBlockLines.push(line);
                } else if (currentBlockLines.length === 0) {
                    // Ignore leading blank lines for a new block
                }
            } else {
                currentBlockLines.push(line);
            }
        }
        addCurrentBlock(); // Add the last block

        return blocks;
    }

    /**
     * Chunks semantic blocks into slides based on estimated height and rules.
     * @param {Array<object>} semanticBlocks - Array of semantic block objects.
     * @returns {Array<string>} - Array of slide markdown content.
     */
    chunkSemanticBlocksIntoSlides(semanticBlocks) {
        const slides = [];
        let currentSlideContent = [];
        let currentSlideHeight = 0;

        // Handle title slide first
        const titleBlockIndex = semanticBlocks.findIndex(block => block.type === 'title-content');
        if (titleBlockIndex !== -1) {
            const titleBlock = semanticBlocks.splice(titleBlockIndex, 1)[0];
            slides.push(titleBlock.content); // Don't add class here, let applyCardClasses handle it
        }

        for (const block of semanticBlocks) {
            if (block.type === 'separator') {
                if (currentSlideContent.length > 0) {
                    slides.push(currentSlideContent.join('\n\n'));
                }
                currentSlideContent = [];
                currentSlideHeight = 0;
                continue;
            }

            // If adding the block exceeds max height, start a new slide
            if (currentSlideHeight + block.estimatedHeight > this.config.maxLinesPerCard && currentSlideContent.length > 0) {
                slides.push(currentSlideContent.join('\n\n'));
                currentSlideContent = [block.content];
                currentSlideHeight = block.estimatedHeight;
            } else {
                currentSlideContent.push(block.content);
                currentSlideHeight += block.estimatedHeight;
            }
        }
        if (currentSlideContent.length > 0) {
            slides.push(currentSlideContent.join('\n\n'));
        }

        return slides;
    }

    /**
     * Estimates the "height" of a markdown block in abstract line units.
     * @param {string} blockContent - The content of the markdown block.
     * @returns {number} - The estimated height.
     */
    estimateBlockHeight(blockContent) {
        if (blockContent.startsWith('__HTML_BLOCK_')) {
            return 8; // Fixed height for HTML blocks
        }

        const lines = blockContent.split('\n');
        let height = 0;
        for (const line of lines) {
            if (line.trim() === '') {
                height += 0.5; // Blank lines
            } else if (line.startsWith('|')) {
                height += 1.2; // Table rows
            } else if (line.startsWith('*') || line.startsWith('-') || line.match(/^\\d+\\./)) {
                height += 1.5; // List items
            } else if (line.startsWith('#')) {
                height += 2; // Headings
            } else {
                height += Math.ceil(line.length / this.config.charsPerLine); // Paragraphs
            }
        }
        return height;
    }

    /**
     * Applies card classes (card-single, card-start, card-middle, card-end) to slides.
     * @param {Array<string>} slides - Array of slide markdown content.
     * @returns {Array<string>} - Array of slide markdown content with classes.
     */
    applyCardClasses(slides) {
        let cardState = 'single'; // single, card-start, card-middle, card-end
        const finalSlides = [];

        for (let i = 0; i < slides.length; i++) {
            let slideContent = slides[i];
            let slideClass = '';

            // Check if this is a title slide (contains H1 heading)
            if (slideContent.includes('# ') && !slideContent.includes('## ') && !slideContent.includes('### ')) {
                slideClass = 'title';
                cardState = 'single'; // Reset card state after title slide
            } else {
                // Determine if this is the last content slide in a sequence
                const isLastContentSlide = (i === slides.length - 1);

                if (cardState === 'single') {
                    // If previous was title or single, this starts a new card sequence
                    slideClass = isLastContentSlide ? 'card-single' : 'card-start';
                } else if (cardState === 'card-start' || cardState === 'card-middle') {
                    // If continuing a multi-slide card
                    slideClass = isLastContentSlide ? 'card-end' : 'card-middle';
                }
                // Update cardState for the next iteration
                cardState = slideClass;
            }
            finalSlides.push(`<!-- _class: ${slideClass} -->\n${slideContent}`);
        }
        return finalSlides;
    }

    /**
     * Extracts and formats the "Sources/Fontes" section into an HTML block.
     * @param {string} markdown - The full markdown content.
     * @returns {{modifiedBody: string, sourcesHtml: string|null}} - The markdown body with sources removed and the generated sources HTML.
     */
    extractAndFormatSources(markdown) {
        const lines = markdown.split('\n');
        let inSourcesSection = false;
        const sourcesLines = [];
        const bodyLines = [];
        const allSourcesHtml = [];
        let placeholderIndex = 0;

        // Regex for bold sources heading (single line)
        const fontesHeadingRegex = /^\*\*(Sources|Fontes)\*\*\s*$/i;
        const fontesHeadingColonRegex = /^\*\*(Sources|Fontes).*:\*\*\s*$/i;
        const fontesHeadingHRegex = /^(#+ )?(Sources|Fontes)$/i;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Detect sources section with various patterns
            if (
                fontesHeadingHRegex.test(line) ||
                fontesHeadingRegex.test(line) ||
                fontesHeadingColonRegex.test(line)
            ) {
                if (!inSourcesSection) {
                    inSourcesSection = true;
                    sourcesLines.length = 0; // reset
                }
                sourcesLines.push(line);
                // Don't add to bodyLines - this is part of the sources section
                continue;
            }

            if (inSourcesSection) {
                // If we encounter another heading, it means the sources section has ended
                if (
                    (line.match(/^#+ /) && !fontesHeadingHRegex.test(line)) ||
                    (line.match(/^\*\*.*\*\*$/) && !fontesHeadingRegex.test(line))
                ) {
                    // End of sources section: insert placeholder
                    if (sourcesLines.length > 0) {
                        const sourcesHtml = `<div class="left-notes">\n<div class="sources">\n${sourcesLines.join('\n').trim()}\n</div>\n</div>`;
                        allSourcesHtml.push(sourcesHtml);
                        bodyLines.push(`__HTML_BLOCK_${placeholderIndex}__`);
                        placeholderIndex++;
                    }
                    inSourcesSection = false;
                    bodyLines.push(line);
                    continue;
                }
                // Don't add sources lines to bodyLines - they're being collected in sourcesLines
                sourcesLines.push(line);
            } else {
                bodyLines.push(line);
            }
        }

        // If sources section was at the end of the file
        if (inSourcesSection && sourcesLines.length > 0) {
            const sourcesHtml = `<div class="left-notes">\n<div class="sources">\n${sourcesLines.join('\n').trim()}\n</div>\n</div>`;
            allSourcesHtml.push(sourcesHtml);
            bodyLines.push(`__HTML_BLOCK_${placeholderIndex}__`);
        }

        let modifiedBody = bodyLines.join('\n');
        if (allSourcesHtml.length > 0) {
            return { modifiedBody, sourcesHtml: allSourcesHtml };
        } else {
            return { modifiedBody, sourcesHtml: null };
        }
    }
}
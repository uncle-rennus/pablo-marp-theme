export class TableSplitter {
  constructor(options = {}) {
    this.minFontSize = options.minFontSize || 15;
    this.maxFontSize = options.maxFontSize || 24;
    this.slideWidth = options.slideWidth || 1280;
    this.slideHeight = options.slideHeight || 720;
    this.padding = options.padding || 40;
    this.maxRowsPerSlide = options.maxRowsPerSlide || 6;
    this.preserveHeaders = options.preserveHeaders ?? true;
  }

  processMarkdown(markdown) {
    const lines = markdown.split('\n');
    const processedLines = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      if (this.isTableStart(line)) {
        const tableData = this.extractTable(lines, i);
        const splitTables = this.optimizeTable(tableData.table, tableData.title);
        
        processedLines.push(...splitTables);
        i = tableData.endIndex;
      } else {
        processedLines.push(line);
        i++;
      }
    }

    return processedLines.join('\n');
  }

  isTableStart(line) {
    const cleanLine = line.trim();
    return cleanLine.includes('|') && cleanLine.split('|').length >= 3;
  }

  extractTable(lines, startIndex) {
    const tableLines = [];
    let title = '';
    let i = startIndex;

    if (startIndex > 0) {
      const prevLine = lines[startIndex - 1];
      if (prevLine.match(/^#{2,4}\s/)) {
        title = prevLine;
      }
    }

    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.includes('|') && line.split('|').length >= 3) {
        const cleanedLine = line.replace(/^\|+/, '|').replace(/\|+$/, '|');
        tableLines.push(cleanedLine);
        i++;
      } else if (line === '' && tableLines.length > 0) {
        i++;
      } else {
        break;
      }
    }

    return { table: tableLines, title, endIndex: i };
  }

  optimizeTable(tableLines, title) {
    if (tableLines.length === 0) return [];

    const header = tableLines[0];
    const separator = tableLines[1] || '';
    const dataRows = tableLines.slice(2);
    const columns = this.parseTableRow(header);

    const tableMetrics = this.analyzeTableContent(header, dataRows);
    const strategy = this.calculateOptimalStrategy(tableMetrics, columns.length);

    return this.applyRenderingStrategy(strategy, header, separator, dataRows, title, columns);
  }

  analyzeTableContent(header, dataRows) {
    const columns = this.parseTableRow(header);
    const allRows = [header, ...dataRows];
    
    const columnMetrics = columns.map((col, colIndex) => {
      const columnContent = allRows.map(row => {
        const cells = this.parseTableRow(row);
        return cells[colIndex] || '';
      });

      const lengths = columnContent.map(content => content.length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const maxLength = Math.max(...lengths);

      return {
        index: colIndex,
        header: col,
        avgLength: Math.round(avgLength),
        maxLength,
        estimatedWidth: Math.max(col.length, maxLength) * 0.6
      };
    });

    const totalEstimatedWidth = columnMetrics.reduce((sum, col) => sum + col.estimatedWidth, 0);
    const avgColumnWidth = totalEstimatedWidth / columns.length;

    return {
      columnCount: columns.length,
      rowCount: dataRows.length,
      columnMetrics,
      totalEstimatedWidth,
      avgColumnWidth,
      maxColumnWidth: Math.max(...columnMetrics.map(c => c.estimatedWidth)),
      minColumnWidth: Math.min(...columnMetrics.map(c => c.estimatedWidth))
    };
  }

  calculateOptimalStrategy(metrics, columnCount) {
    const availableWidth = this.slideWidth - this.padding;
    const availableHeight = this.slideHeight - 200;
    const strategies = [];

    const needsRowSplit = metrics.rowCount > this.maxRowsPerSlide;
    const rowSplitCount = needsRowSplit ? Math.ceil(metrics.rowCount / this.maxRowsPerSlide) : 1;

    if (needsRowSplit) {
      for (let fontSize = this.maxFontSize; fontSize >= this.minFontSize; fontSize--) {
        const charWidth = fontSize * 0.25;
        const rowHeight = fontSize * 1.3;
        const maxTableWidth = availableWidth;
        const maxContentWidth = maxTableWidth / columnCount;
        const maxCharsPerColumn = Math.floor(maxContentWidth / charWidth);

        const fitsWithoutColumnSplit = metrics.columnMetrics.every(col => 
          col.maxLength <= maxCharsPerColumn * 1.5
        );

        const rowsPerChunk = this.maxRowsPerSlide;
        const chunkHeight = (rowsPerChunk + 2) * rowHeight;
        const heightFits = chunkHeight <= availableHeight;

        if (fitsWithoutColumnSplit && heightFits) {
          strategies.push({
            type: 'row_split',
            fontSize,
            columnCount,
            splitCount: rowSplitCount,
            readabilityScore: this.calculateReadabilityScore(fontSize, columnCount, metrics) + 500,
            description: `Row split into ${rowSplitCount} parts, ${fontSize}px font`
          });
          break;
        }
      }
    } else {
      for (let fontSize = this.maxFontSize; fontSize >= this.minFontSize; fontSize--) {
        const charWidth = fontSize * 0.25;
        const rowHeight = fontSize * 1.3;
        const maxTableWidth = availableWidth;
        const maxContentWidth = maxTableWidth / columnCount;
        const maxCharsPerColumn = Math.floor(maxContentWidth / charWidth);

        const fitsWithoutSplit = metrics.columnMetrics.every(col => 
          col.maxLength <= maxCharsPerColumn
        );

        const totalTableHeight = (metrics.rowCount + 2) * rowHeight;
        const heightFits = totalTableHeight <= availableHeight;

        if (fitsWithoutSplit && heightFits) {
          strategies.push({
            type: 'single_table',
            fontSize,
            columnCount,
            splitCount: 1,
            readabilityScore: this.calculateReadabilityScore(fontSize, columnCount, metrics),
            description: `Single table, ${fontSize}px font`
          });
          break;
        }
      }
    }

    if (strategies.length === 0 && !needsRowSplit) {
      for (let splitColumns = Math.ceil(columnCount / 2); splitColumns >= 2; splitColumns--) {
        for (let fontSize = this.maxFontSize; fontSize >= this.minFontSize; fontSize--) {
          const charWidth = fontSize * 0.25;
          const rowHeight = fontSize * 1.3;
          const maxTableWidth = availableWidth;
          const maxContentWidth = maxTableWidth / splitColumns;
          const maxCharsPerColumn = Math.floor(maxContentWidth / charWidth);

          const canFitColumns = splitColumns;
          const worstCaseColumn = Math.max(
            ...metrics.columnMetrics.slice(0, canFitColumns).map(c => c.maxLength)
          );

          const totalTableHeight = (metrics.rowCount + 2) * rowHeight;
          const heightFits = totalTableHeight <= availableHeight;

          if (worstCaseColumn <= maxCharsPerColumn && heightFits) {
            const splitCount = Math.ceil(columnCount / splitColumns);
            strategies.push({
              type: 'column_split',
              fontSize,
              columnCount: splitColumns,
              splitCount,
              readabilityScore: this.calculateReadabilityScore(fontSize, splitColumns, metrics),
              description: `Split into ${splitCount} parts, ${splitColumns} cols each, ${fontSize}px font`
            });
          }
        }
      }
    }

    return strategies.length > 0 ? strategies[0] : {
      type: 'fallback',
      fontSize: this.minFontSize,
      columnCount: Math.min(columnCount, 3),
      splitCount: Math.ceil(columnCount / 3),
      readabilityScore: 0,
      description: 'Fallback strategy'
    };
  }

  calculateReadabilityScore(fontSize, columnCount, metrics) {
    const baseScore = fontSize * 10;
    const columnPenalty = (columnCount - 1) * 5;
    const contentPenalty = Math.max(0, metrics.avgColumnWidth - 20) * 2;
    return baseScore - columnPenalty - contentPenalty;
  }

  applyRenderingStrategy(strategy, header, separator, dataRows, title, columns) {
    switch (strategy.type) {
      case 'single_table':
        return this.renderSingleTable(header, separator, dataRows, title, strategy);
      case 'column_split':
        return this.renderColumnSplit(header, separator, dataRows, title, columns, strategy);
      case 'row_split':
        return this.renderRowSplit(header, separator, dataRows, title, strategy);
      default:
        return this.renderFallback(header, separator, dataRows, title, strategy);
    }
  }

  renderSingleTable(header, separator, dataRows, title, strategy) {
    const result = ['---\n'];
    if (title) result.push(title);
    result.push('');
    
    const cssClass = this.getCSSClass(strategy.columnCount);
    result.push(`<div class="${cssClass}">`);
    result.push('');
    result.push(header);
    result.push(separator);
    result.push(...dataRows);
    result.push('');
    result.push('</div>');
    
    return result;
  }

  renderColumnSplit(header, separator, dataRows, title, columns, strategy) {
    const chunks = [];
    const chunkSize = strategy.columnCount;
    
    for (let i = 0; i < columns.length; i += chunkSize) {
      const columnChunk = columns.slice(i, i + chunkSize);
      const isLastChunk = i + chunkSize >= columns.length;
      
      chunks.push('---\n');
      
      const colRange = `${i + 1}-${Math.min(i + chunkSize, columns.length)}`;
      if (title) {
        chunks.push(`${title} (Cols ${colRange})`);
      } else {
        chunks.push(`<h2>Table (Columns ${colRange})</h2>`);
      }
      
      chunks.push('');
      
      const cssClass = this.getCSSClass(columnChunk.length);
      chunks.push(`<div class="${cssClass}">`);
      chunks.push('');
      
      const newHeader = '| ' + columnChunk.join(' | ') + ' |';
      const newSeparator = '|' + columnChunk.map(() => '-------').join('|') + '|';
      
      chunks.push(newHeader);
      chunks.push(newSeparator);
      
      dataRows.forEach(row => {
        const rowData = this.parseTableRow(row);
        const chunkData = rowData.slice(i, i + chunkSize);
        
        while (chunkData.length < columnChunk.length) {
          chunkData.push('');
        }
        
        chunks.push('| ' + chunkData.join(' | ') + ' |');
      });
      
      chunks.push('');
      chunks.push('</div>');
    }

    return chunks;
  }

  renderRowSplit(header, separator, dataRows, title, strategy) {
    const chunks = [];
    const chunkSize = this.maxRowsPerSlide;
    
    for (let i = 0; i < dataRows.length; i += chunkSize) {
      const rowChunk = dataRows.slice(i, i + chunkSize);
      const partNum = Math.floor(i / chunkSize) + 1;
      const totalParts = Math.ceil(dataRows.length / chunkSize);
      
      chunks.push('---\n');
      
      if (title) {
        chunks.push(`${title} (Part ${partNum}/${totalParts})`);
      } else {
        chunks.push(`<h2>Table (Part ${partNum}/${totalParts})</h2>`);
      }
      
      chunks.push('');
      
      const cssClass = this.getCSSClass(strategy.columnCount);
      chunks.push(`<div class="${cssClass}">`);
      chunks.push('');
      
      chunks.push(header);
      chunks.push(separator);
      chunks.push(...rowChunk);
      
      chunks.push('');
      chunks.push('</div>');
    }

    return chunks;
  }

  renderFallback(header, separator, dataRows, title, strategy) {
    return this.renderSingleTable(header, separator, dataRows, title, strategy);
  }

  getCSSClass(columnCount) {
    if (columnCount <= 3) return 'table-cols-3';
    if (columnCount <= 5) return 'table-cols-5';
    if (columnCount <= 7) return 'table-cols-7';
    if (columnCount <= 9) return 'table-cols-9';
    return 'table-cols-10plus';
  }

  parseTableRow(row) {
    return row.split('|').slice(1, -1).map(cell => cell.trim());
  }
}
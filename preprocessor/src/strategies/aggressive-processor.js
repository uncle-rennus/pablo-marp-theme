import { optimizeContent } from '../utils/content-optimizer.js';

export class AdaptiveTableProcessor {
  constructor(options = {}) {
    this.maxRowsPerSlide = options.maxRowsPerSlide || 3;
    this.maxColumnsPerSlide = options.maxColumnsPerSlide || 4;
    this.aggressiveMode = options.aggressiveMode ?? true;
    this.optimizeContent = options.optimizeContent ?? true;
  }

  processMarkdown(markdown) {
    let processed = markdown;
    
    if (this.optimizeContent) {
      processed = optimizeContent(processed);
    }
    
    processed = this.splitTables(processed);
    processed = this.addSlideBreaks(processed);
    
    return processed;
  }

  splitTables(markdown) {
    const lines = markdown.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      if (this.isTableStart(line)) {
        const tableData = this.extractTable(lines, i);
        const splitTables = this.processTable(tableData);
        result.push(...splitTables);
        i = tableData.endIndex;
      } else {
        result.push(line);
        i++;
      }
    }

    return result.join('\n');
  }

  isTableStart(line) {
    return line.trim().startsWith('|') && line.includes('|') && line.split('|').length > 3;
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

    while (i < lines.length && lines[i].trim().startsWith('|')) {
      tableLines.push(lines[i]);
      i++;
    }

    return { table: tableLines, title, endIndex: i };
  }

  processTable(tableData) {
    if (tableData.table.length === 0) return [];

    const [header, separator, ...dataRows] = tableData.table;
    const columns = this.parseRow(header);
    const columnCount = columns.length;

    if (columnCount > this.maxColumnsPerSlide || this.aggressiveMode) {
      return this.splitByColumns(header, separator, dataRows, tableData.title, columns);
    } else if (dataRows.length > this.maxRowsPerSlide) {
      return this.splitByRows(header, separator, dataRows, tableData.title, columnCount);
    } else {
      const result = ['---\n'];
      if (tableData.title) result.push(tableData.title);
      result.push('');
      result.push(`<div class="table-cols-${Math.min(columnCount, 5)}">`);
      result.push('');
      result.push(...tableData.table);
      result.push('');
      result.push('</div>');
      return result;
    }
  }

  splitByColumns(header, separator, dataRows, title, columns) {
    const chunks = [];
    const chunkSize = this.aggressiveMode ? 3 : this.maxColumnsPerSlide;
    
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
      
      const cssClass = columnChunk.length <= 3 ? 'table-cols-3' : 
                      columnChunk.length <= 4 ? 'table-cols-4' : 'table-cols-5';
      chunks.push(`<div class="${cssClass}">`);
      chunks.push('');
      
      const newHeader = '| ' + columnChunk.join(' | ') + ' |';
      const newSeparator = '|' + columnChunk.map(() => '-------').join('|') + '|';
      
      chunks.push(newHeader);
      chunks.push(newSeparator);
      
      dataRows.forEach(row => {
        const rowData = this.parseRow(row);
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

  splitByRows(header, separator, dataRows, title, columnCount) {
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
      
      const cssClass = columnCount <= 3 ? 'table-cols-3' : 
                      columnCount <= 5 ? 'table-cols-5' : 'table-cols-7';
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

  parseRow(row) {
    return row.split('|').slice(1, -1).map(cell => cell.trim());
  }

  addSlideBreaks(markdown) {
    const lines = markdown.split('\n');
    const result = [];
    let contentLines = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.trim() === '---') {
        result.push(line);
        contentLines = 0;
        continue;
      }

      if (line.match(/^## (Summary|Key Findings|Budget Analysis|Unused|Specific)/)) {
        if (contentLines > 3) {
          result.push('---\n');
          contentLines = 0;
        }
      }

      result.push(line);
      if (line.trim() && !line.startsWith('<') && !line.startsWith('|')) {
        contentLines++;
      }
    }

    return result.join('\n');
  }
}
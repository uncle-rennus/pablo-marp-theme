/**
 * Intelligent Table Processor - Smart table splitting and optimization
 */
export class IntelligentTableProcessor {
  constructor(config = {}) {
    this.maxRows = config.maxRowsPerSlide || 6;
    this.maxCols = config.maxColumnsPerSlide || 4;
    this.preserveHeaders = config.preserveHeaders ?? true;
  }

  processMarkdown(markdown) {
    const lines = markdown.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      if (this.isTableStart(line)) {
        const tableData = this.extractTable(lines, i);
        const processedTable = this.processTable(tableData);
        result.push(...processedTable);
        i = tableData.endIndex;
      } else {
        result.push(line);
        i++;
      }
    }

    return result.join('\n');
  }

  isTableStart(line) {
    return line.trim().includes('|') && line.split('|').length >= 3;
  }

  extractTable(lines, startIndex) {
    const table = [];
    let title = '';
    let i = startIndex;

    // Check for title above table
    if (startIndex > 0 && lines[startIndex - 1].match(/^#{2,4}\s/)) {
      title = lines[startIndex - 1];
    }

    // Extract table rows
    while (i < lines.length && lines[i].trim().includes('|')) {
      table.push(lines[i]);
      i++;
    }

    return { table, title, endIndex: i };
  }

  processTable(tableData) {
    if (tableData.table.length === 0) return [];

    const [header, separator, ...dataRows] = tableData.table;
    const columns = this.parseRow(header);

    // Simple splitting logic
    if (dataRows.length > this.maxRows) {
      return this.splitByRows(header, separator, dataRows, tableData.title);
    } else if (columns.length > this.maxCols) {
      return this.splitByColumns(header, separator, dataRows, tableData.title, columns);
    }

    // Return as single table
    const result = ['---\n'];
    if (tableData.title) result.push(tableData.title, '');
    result.push('<div class="table-responsive">', '', ...tableData.table, '', '</div>');
    return result;
  }

  splitByRows(header, separator, dataRows, title) {
    const chunks = [];
    const chunkSize = this.maxRows;
    
    for (let i = 0; i < dataRows.length; i += chunkSize) {
      const rowChunk = dataRows.slice(i, i + chunkSize);
      const partNum = Math.floor(i / chunkSize) + 1;
      const totalParts = Math.ceil(dataRows.length / chunkSize);
      
      chunks.push('---\n');
      if (title) chunks.push(`${title} (${partNum}/${totalParts})`);
      chunks.push('', '<div class="table-responsive">', '', header, separator, ...rowChunk, '', '</div>');
    }
    
    return chunks;
  }

  splitByColumns(header, separator, dataRows, title, columns) {
    const chunks = [];
    const chunkSize = this.maxCols;
    
    for (let i = 0; i < columns.length; i += chunkSize) {
      const columnChunk = columns.slice(i, i + chunkSize);
      const colRange = `${i + 1}-${Math.min(i + chunkSize, columns.length)}`;
      
      chunks.push('---\n');
      if (title) chunks.push(`${title} (Cols ${colRange})`);
      chunks.push('', '<div class="table-responsive">');
      
      const newHeader = '| ' + columnChunk.join(' | ') + ' |';
      const newSeparator = '|' + columnChunk.map(() => '-------').join('|') + '|';
      
      chunks.push('', newHeader, newSeparator);
      
      dataRows.forEach(row => {
        const rowData = this.parseRow(row);
        const chunkData = rowData.slice(i, i + chunkSize);
        chunks.push('| ' + chunkData.join(' | ') + ' |');
      });
      
      chunks.push('', '</div>');
    }
    
    return chunks;
  }

  parseRow(row) {
    return row.split('|').slice(1, -1).map(cell => cell.trim());
  }
}

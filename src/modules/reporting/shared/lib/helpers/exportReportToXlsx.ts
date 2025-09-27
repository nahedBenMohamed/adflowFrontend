import { envUtil } from '@/shared';
import type { Table } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { renderToStaticMarkup } from 'react-dom/server';
import * as XLSX from 'xlsx';

export const exportReportToExcel = <R>(table: Table<R>, t: TFunction): void => {
  const worksheetData: string[][] = [];
  const merges: XLSX.Range[] = [];

  // --- Step 1: Multi-row headers ---
  const headerGroups = table.getHeaderGroups();
  headerGroups.forEach((group, rowIndex) => {
    const row: string[] = [];
    let colIndex = 0;

    for (const header of group.headers) {
      const colSpan = header.colSpan ?? 1;
      let label = '';

      const def = header.column.columnDef.header;

      if (typeof def === 'function') label = def(header.getContext());
      else if (typeof def === 'string') label = def;
      else label = String(def);

      row.push(label);

      if (colSpan > 1) {
        merges.push({
          s: { r: rowIndex, c: colIndex },
          e: { r: rowIndex, c: colIndex + colSpan - 1 },
        });

        for (let i = 1; i < colSpan; i++) row.push('');
      }

      colIndex += colSpan;
    }

    worksheetData.push(row);
  });

  // --- Step 2: Data rows using meta.excelValue ---
  const dataRows = table.getRowModel().rows.map(row =>
    row.getVisibleCells().map(cell => {
      const column = cell.column;
      const meta = column.columnDef.meta as { excelValue?: (row: R) => string } | undefined;

      if (meta?.excelValue) {
        try {
          return meta.excelValue(row.original as R) || t('total');
        } catch {
          return '';
        }
      }

      const renderCell = column.columnDef.cell;

      if (typeof renderCell === 'function') {
        try {
          const rendered = renderCell(cell.getContext());
          if (typeof rendered === 'string' || typeof rendered === 'number') return String(rendered);

          if (rendered == null) return '';

          return renderToStaticMarkup(rendered as React.ReactElement);
        } catch {
          return '';
        }
      }

      const val = cell.getValue();

      if (typeof val === 'string' || typeof val === 'number') return String(val);

      if (val?.toString !== Object.prototype.toString) return val?.toString() ?? '';

      return '';
    })
  );

  worksheetData.push(...dataRows);

  // --- Step 3: Add export footer ---
  const footerText = t('export_table', {
    date: new Date().toLocaleString(),
    company: envUtil.appName,
  });
  // left-align in first column
  const footerRow = [''];
  worksheetData.push([], footerRow);
  worksheetData.push([footerText]);

  // --- Step 4: Create worksheet ---
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet['!merges'] = merges;

  // --- Step 5: Auto-width per column ---
  const maxColLengths: number[] = [];

  worksheetData.forEach(row => {
    row.forEach((cell, colIdx) => {
      const len = cell ? String(cell).length : 0;
      maxColLengths[colIdx] = Math.max(maxColLengths[colIdx] ?? 10, len);
    });
  });

  worksheet['!cols'] = maxColLengths.map(len => ({
    // Clamp width to avoid too-wide columns
    wch: Math.min(40, len + 2),
  }));

  // --- Step 6: Save workbook ---
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

  // XLSX styling support requires setting workbook.SSF or using a compatible writer
  XLSX.writeFile(workbook, 'report.xlsx', {
    cellStyles: true,
  });
};

import { flexRender, type Cell, type Row, type Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { BaseTableBodyCell } from './BaseTableBodyCell';
import { BaseTableBodyRow, type BaseTableBodyRowProps } from './BaseTableBodyRow';

type OmittedBodyRowsProps = Omit<BaseTableBodyRowProps, 'selectable'>;

export interface BaseTableBodyProps<T> {
  table: Table<T>;
  bodyRowProps?: OmittedBodyRowsProps;
  onSelect?: (row: Row<T>) => void;
  getCellStyleFn?: (cell: Cell<T, unknown>) => CSSProperties;
}

const BaseTableBody = <T extends unknown>(props: BaseTableBodyProps<T>) => {
  const { table, bodyRowProps, getCellStyleFn, onSelect } = props;

  return table.getRowModel().rows.map(r => (
    <BaseTableBodyRow
      key={r.id}
      {...bodyRowProps}
      $selectable={Boolean(onSelect)}
      onClick={() => onSelect?.(r)}
    >
      {r.getVisibleCells().map(c => (
        <BaseTableBodyCell
          key={c.id}
          style={getCellStyleFn ? getCellStyleFn(c) : { width: c.column.getSize() }}
        >
          {flexRender(c.column.columnDef.cell, c.getContext())}
        </BaseTableBodyCell>
      ))}
    </BaseTableBodyRow>
  ));
};

export { BaseTableBody };

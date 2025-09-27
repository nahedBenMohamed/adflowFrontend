import type { Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { BaseTableHeadCell } from './BaseTableHeadCell';
import { BaseTableHeadRow, type BaseTableHeadRowProps } from './BaseTableHeadRow';

export interface BaseTableHeadProps<T> {
  table: Table<T>;
  headRowProps?: BaseTableHeadRowProps;
  getCellStyleFn?: (cell: Header<T, unknown>) => CSSProperties;
}

const BaseTableHead = <T extends unknown>(props: BaseTableHeadProps<T>) => {
  const { table, headRowProps, getCellStyleFn } = props;

  return table.getHeaderGroups().map(hg => (
    <BaseTableHeadRow key={hg.id} {...headRowProps}>
      {hg.headers.map(h => (
        <BaseTableHeadCell key={h.id} header={h} getCellStyleFn={getCellStyleFn} />
      ))}
    </BaseTableHeadRow>
  ));
};

export { BaseTableHead };

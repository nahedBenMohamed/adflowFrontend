import type { Table } from '@tanstack/react-table';
import { BaseTableBody, type BaseTableBodyProps } from './BaseTableBody';
import { BaseTableHead, type BaseTableHeadProps } from './BaseTableHead';
import { BaseTableRoot } from './BaseTableRoot';

type OmittedBodyProps<T> = Omit<BaseTableBodyProps<T>, 'table'>;
type OmittedHeadProps<T> = Omit<BaseTableHeadProps<T>, 'table'>;

interface Props<T> {
  table: Table<T>;
  disabled?: boolean;
  tableLoading?: boolean;
  bodyProps?: OmittedBodyProps<T>;
  headProps?: OmittedHeadProps<T>;
}

const BaseTable = <T extends unknown>(props: Props<T>) => {
  const { table, disabled, tableLoading, bodyProps, headProps } = props;

  return (
    <BaseTableRoot $loading={tableLoading} $disabled={disabled}>
      <BaseTableHead table={table} {...headProps} />
      <BaseTableBody table={table} {...bodyProps} />
    </BaseTableRoot>
  );
};

export { BaseTable };

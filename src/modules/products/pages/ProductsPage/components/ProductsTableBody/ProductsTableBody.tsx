import { BaseTableBodyCell, BaseTableBodyRowFilled } from '@/shared';
import { flexRender, type Table } from '@tanstack/react-table';
import type { Product } from '../../../../shared';

interface Props {
  productsTable: Table<Product>;
}

const ProductsTableBody = (props: Props) => {
  const { productsTable } = props;

  return productsTable.getRowModel().rows.map(r => (
    <BaseTableBodyRowFilled key={r.id}>
      {r.getVisibleCells().map(c => (
        <BaseTableBodyCell key={c.id} style={{ width: c.column.getSize() }}>
          {flexRender(c.column.columnDef.cell, c.getContext())}
        </BaseTableBodyCell>
      ))}
    </BaseTableBodyRowFilled>
  ));
};

export { ProductsTableBody };

import type { ColumnResizeMode, Table } from '@tanstack/react-table';
import styled from 'styled-components';
import type { Product } from '../../../../shared';
import { ProductsTableHeadCell } from '../cells/ProductsTableHeadCell/ProductsTableHeadCell';

const THeadRow = styled.div`
  position: sticky;
  top: calc(var(--header-with-subheader-height) + var(--header-height));

  height: 32px;
  width: fit-content;

  display: flex;
  align-items: center;
  gap: 16px;

  z-index: 1;

  padding: 8px 0 0 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: var(--graphite-graphite-20);

  &::before,
  &::after {
    content: '';

    position: absolute;
    top: 0;

    height: calc(100% + 1px);
    width: 8px;

    background-color: var(--graphite-graphite-20);

    z-index: 1;
  }

  &::before {
    left: -4px;
  }

  &::after {
    right: -16px;

    width: 16px;
  }
`;

interface Props {
  productsTable: Table<Product>;
  columnResizeMode: ColumnResizeMode;
  saveColumnSize: ({ columnId, size }: { columnId: string; size: number }) => void;
}

const ProductsTableHead = (props: Props) => {
  const { productsTable, columnResizeMode, saveColumnSize } = props;

  return (
    <>
      {productsTable.getHeaderGroups().map(hg => (
        <THeadRow key={hg.id}>
          {hg.headers.map(h => (
            <ProductsTableHeadCell
              key={h.id}
              header={h}
              columnResizeMode={columnResizeMode}
              sizingDeltaOffset={productsTable.getState().columnSizingInfo.deltaOffset}
              saveColumnSize={saveColumnSize}
            />
          ))}
        </THeadRow>
      ))}
    </>
  );
};

export { ProductsTableHead };

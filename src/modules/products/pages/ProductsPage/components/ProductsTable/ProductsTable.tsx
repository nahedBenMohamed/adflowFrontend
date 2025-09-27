import { SectionPagination } from '@/shared';
import type { ColumnResizeMode, Table } from '@tanstack/react-table';
import styled, { css } from 'styled-components';
import { PRODUCTS_LIMIT } from '../../../../api';
import type { GetProductsMeta, Product } from '../../../../shared';
import { ProductsTableBody } from '../ProductsTableBody/ProductsTableBody';
import { ProductsTableHead } from '../ProductsTableHead/ProductsTableHead';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

const TableRoot = styled.div<{ $loading: boolean }>`
  width: fit-content;

  transition: opacity var(--transition-200);

  ${p =>
    p.$loading &&
    css`
      opacity: 0.65;

      cursor: wait;
    `}
`;

interface Props {
  currentPage: number;
  productsTable: Table<Product>;
  columnResizeMode: ColumnResizeMode;
  productsMeta: GetProductsMeta;
  showingPreviousData: boolean;
  handleChangePage: (page: number) => void;
  saveColumnSize: ({ columnId, size }: { columnId: string; size: number }) => void;
}

const ProductsTable = (props: Props) => {
  const {
    currentPage,
    productsTable,
    columnResizeMode,
    productsMeta,
    showingPreviousData,
    handleChangePage,
    saveColumnSize,
  } = props;

  const pageCount = Math.ceil(productsMeta.totalCount / PRODUCTS_LIMIT);

  return (
    <Root>
      <TableRoot $loading={showingPreviousData}>
        <ProductsTableHead
          productsTable={productsTable}
          columnResizeMode={columnResizeMode}
          saveColumnSize={saveColumnSize}
        />

        <ProductsTableBody productsTable={productsTable} />
      </TableRoot>

      {pageCount > 1 && (
        <SectionPagination
          currentPage={currentPage}
          pageCount={pageCount}
          handleChange={handleChangePage}
        />
      )}
    </Root>
  );
};

export { ProductsTable };

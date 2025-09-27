import { EmptyTableBlock, SectionPagination, TableSkeleton } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PRODUCTS_LIMIT } from '../../api';
import {
  BlockFooterControls,
  ProductWarehouseBlockTemplateHeader,
  type GetProductsMeta,
  type ProductWarehouseBlockTemplateHeaderProps,
} from '../../shared';
import { ProductsOrderPanelTemplate } from '../ProductsOrderPanelTemplate/ProductsOrderPanelTemplate';

const SectionPaginationWrapper = styled.div<{ $visible: boolean }>`
  margin-right: auto;

  opacity: ${p => (p.$visible ? 1 : 0)};
  scale: ${p => (p.$visible ? 1 : 0.5)};
  transition: var(--transition-200);
  transform-origin: left center;
`;

interface Props {
  Table: ReactNode;
  adding: boolean;
  rowsLength: number;
  currentPage: number;
  addDisabled: boolean;
  productsLoading: boolean;
  warehousesEnabled: boolean;
  headerProps: ProductWarehouseBlockTemplateHeaderProps;
  isRental?: boolean;
  productsResultMeta?: GetProductsMeta;
  handleAdd: () => Promise<void>;
  handleChangePage: (page: number) => void;
  handleReset: () => void;
  initializeProductRows?: () => void;
}

const ProductsWarehouseBlockTemplate = observer((props: Props) => {
  const {
    Table,
    adding,
    rowsLength,
    currentPage,
    addDisabled,
    productsLoading,
    warehousesEnabled,
    headerProps,
    isRental,
    productsResultMeta,
    handleAdd,
    handleChangePage,
    handleReset,
    initializeProductRows,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.templates.products_warehouse_block_template',
  });

  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  }, [currentPage]);

  const pageCount = productsResultMeta
    ? Math.ceil(productsResultMeta.totalCount / PRODUCTS_LIMIT)
    : 0;

  const productsSectionBlockTitle = isRental
    ? t('product_management_rentals')
    : t('product_management_for_sales');

  return (
    <ProductsOrderPanelTemplate
      order={1}
      ref={bodyRef}
      title={productsSectionBlockTitle}
      id="workspace__ProductsWarehouseBlockTemplate--Root"
      HeaderContent={
        <ProductWarehouseBlockTemplateHeader
          {...headerProps}
          warehousesEnabled={warehousesEnabled}
        />
      }
      Controls={
        <BlockFooterControls
          approveProps={{
            title: t('add'),
            loading: adding,
            disabled: addDisabled,
            handler: handleAdd,
          }}
          cancelProps={{
            title: t('reset'),
            disabled: !initializeProductRows,
            handler: handleReset,
          }}
        >
          <SectionPaginationWrapper $visible={Boolean(productsResultMeta && pageCount > 1)}>
            <SectionPagination
              boundaries={1}
              pageCount={pageCount}
              currentPage={currentPage}
              handleChange={handleChangePage}
            />
          </SectionPaginationWrapper>
        </BlockFooterControls>
      }
    >
      {productsLoading ? (
        <TableSkeleton />
      ) : rowsLength ? (
        Table
      ) : (
        <EmptyTableBlock>{t('empty')}</EmptyTableBlock>
      )}
    </ProductsOrderPanelTemplate>
  );
});

ProductsWarehouseBlockTemplate.displayName = 'ProductsWarehouseBlockTemplate';
export { ProductsWarehouseBlockTemplate };

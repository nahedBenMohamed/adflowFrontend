import { EmptyTableBlock, PageSecondaryHeader } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProductCategoriesSelect,
  ProductWarehousesSelect,
  type ProductCategoriesSelectProps,
  type ProductWarehousesSelectProps,
} from '../../../../shared';

interface Props {
  visible: boolean;
  categorySelectProps: ProductCategoriesSelectProps;
  warehouseSelectProps?: ProductWarehousesSelectProps;
  ExtraControls?: ReactNode;
}

const SELECT_TITLE_WIDTH = '240px';

const ProductsPageSecondaryHeader = observer((props: Props) => {
  const { visible, categorySelectProps, warehouseSelectProps, ExtraControls } = props;

  const { t } = useTranslation('module.products', { keyPrefix: 'products.pages.products_page' });

  const showWarehousesSelect = Boolean(
    warehouseSelectProps && warehouseSelectProps.warehouseStore.accessibleWarehouses.length > 0
  );

  const showCategoriesSelect = Boolean(
    categorySelectProps && categorySelectProps.productCategoryStore.categories.length > 0
  );

  return (
    <PageSecondaryHeader pageHasSubheader>
      {visible && (
        <>
          {!showWarehousesSelect && !showCategoriesSelect && (
            <EmptyTableBlock $justifyContent="flex-start">
              {t('no_warehouses_or_categories')}
            </EmptyTableBlock>
          )}

          {ExtraControls}

          {showWarehousesSelect && warehouseSelectProps && (
            <ProductWarehousesSelect
              clearable
              titleWidth={SELECT_TITLE_WIDTH}
              variant="outlined-without-active-shadow"
              {...warehouseSelectProps}
            />
          )}

          {showCategoriesSelect && (
            <ProductCategoriesSelect
              clearable
              titleWidth={SELECT_TITLE_WIDTH}
              variant="outlined-without-active-shadow"
              {...categorySelectProps}
            />
          )}
        </>
      )}
    </PageSecondaryHeader>
  );
});

ProductsPageSecondaryHeader.displayName = 'ProductsPageSecondaryHeader';
export { ProductsPageSecondaryHeader };

import { Hint, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProductsSearchBlock, type ProductsSearchBlockProps } from '../../../../pages';
import {
  ProductCategoriesSelect,
  type ProductCategoriesSelectProps,
} from '../ProductCategoriesSelect/ProductCategoriesSelect';
import {
  ProductWarehousesSelect,
  type ProductWarehousesSelectProps,
} from '../ProductWarehousesSelect/ProductWarehousesSelect';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const WarehouseSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export interface ProductWarehouseBlockTemplateHeaderProps {
  searchBlockProps: ProductsSearchBlockProps;
  categorySelectProps: ProductCategoriesSelectProps;
  warehouseSelectProps: ProductWarehousesSelectProps<Nullable<number>>;
  warehousesEnabled?: boolean;
  ExtraControls?: ReactNode;
}

const SELECT_TITLE_WIDTH = '224px';

const ProductWarehouseBlockTemplateHeader = observer(
  (props: ProductWarehouseBlockTemplateHeaderProps) => {
    const {
      searchBlockProps,
      categorySelectProps,
      warehouseSelectProps,
      warehousesEnabled,
      ExtraControls,
    } = props;

    const { t } = useTranslation('module.products', {
      keyPrefix:
        'products.pages.card_products_order_page.templates.products_warehouse_block_template',
    });

    return (
      <Root>
        <ProductsSearchBlock width={`calc(${SELECT_TITLE_WIDTH} + 40px)`} {...searchBlockProps} />

        {warehouseSelectProps.warehouseStore.accessibleWarehouses.length > 0 &&
          warehousesEnabled && (
            <WarehouseSelectWrapper>
              <ProductWarehousesSelect
                clearable
                titleWidth={SELECT_TITLE_WIDTH}
                {...warehouseSelectProps}
              />

              {warehouseSelectProps.disabled && <Hint text={t('warehouse_select_hint')} />}
            </WarehouseSelectWrapper>
          )}

        <ProductCategoriesSelect
          clearable
          titleWidth={SELECT_TITLE_WIDTH}
          {...categorySelectProps}
        />

        {ExtraControls}
      </Root>
    );
  }
);

ProductWarehouseBlockTemplateHeader.displayName = 'ProductWarehouseBlockTemplateHeader';
export { ProductWarehouseBlockTemplateHeader };

import { FieldGroupTabPanel, FieldGroupTabs } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProductsSectionType, type Product, type ProductsSection } from '../../../../shared';
import type { WarehouseStore } from '../../../../store';
import { ProductCalendarBlock } from '../ProductFeed/ProductCalendarBlock/ProductCalendarBlock';
import { ProductImagesBlock } from '../ProductFeed/ProductImagesBlock/ProductImagesBlock';
import { ProductPricesBlock } from '../ProductFeed/ProductPricesBlock/ProductPricesBlock';
import { ProductStocksBlock } from '../ProductFeed/ProductStocksBlock/ProductStocksBlock';

const TabList = styled(FieldGroupTabs.List)`
  width: 100%;
  height: 38px;

  display: flex;
  align-items: center;
`;

interface Props {
  sectionType: ProductsSectionType;
  product: Product;
  disabled: boolean;
  warehouseStore: WarehouseStore;
  productsSection?: ProductsSection;
}

const ProductFeed = observer((props: Props) => {
  const { sectionType, warehouseStore, disabled, product, productsSection } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_feed',
  });

  const isStocksTabEnabled =
    product.isProduct() &&
    productsSection &&
    productsSection.isSale() &&
    productsSection.enableWarehouse;

  return (
    <FieldGroupTabs defaultValue={isStocksTabEnabled ? 'stocks' : 'prices'}>
      <TabList>
        {isStocksTabEnabled && (
          <FieldGroupTabs.Tab value="stocks">{t('stocks')}</FieldGroupTabs.Tab>
        )}

        <FieldGroupTabs.Tab value="prices">{t('prices')}</FieldGroupTabs.Tab>

        <FieldGroupTabs.Tab value="images">{t('images')}</FieldGroupTabs.Tab>

        {sectionType === ProductsSectionType.RENTAL && (
          <FieldGroupTabs.Tab value="calendar">{t('calendar')}</FieldGroupTabs.Tab>
        )}
      </TabList>

      {isStocksTabEnabled && (
        <FieldGroupTabPanel key="workspace__ProductFeed--Stocks" value="stocks">
          <ProductStocksBlock
            disabled={disabled}
            productId={product.id}
            stocks={product.stocks}
            sectionType={sectionType}
            warehouseStore={warehouseStore}
            sectionId={warehouseStore.sectionId}
          />
        </FieldGroupTabPanel>
      )}

      <FieldGroupTabPanel key="workspace__ProductFeed--Prices" value="prices">
        <ProductPricesBlock
          disabled={disabled}
          productId={product.id}
          prices={product.prices}
          sectionId={warehouseStore.sectionId}
        />
      </FieldGroupTabPanel>

      <FieldGroupTabPanel key="workspace__ProductFeed--Images" value="images">
        <ProductImagesBlock
          disabled={disabled}
          productId={product.id}
          sectionId={warehouseStore.sectionId}
          photoFileLinks={product.photoFileLinks}
        />
      </FieldGroupTabPanel>

      {sectionType === ProductsSectionType.RENTAL && (
        <FieldGroupTabPanel key="workspace__ProductFeed--Calendar" value="calendar">
          <ProductCalendarBlock productId={product.id} sectionId={warehouseStore.sectionId} />
        </FieldGroupTabPanel>
      )}
    </FieldGroupTabs>
  );
});

ProductFeed.displayName = 'ProductFeed';
export { ProductFeed };

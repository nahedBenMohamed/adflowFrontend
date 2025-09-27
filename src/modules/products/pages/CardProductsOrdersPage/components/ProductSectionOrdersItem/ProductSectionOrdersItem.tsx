import { appStore } from '@/app';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import {
  useProductsSectionOrdersColumns,
  type Order,
  type ProductsSection,
} from '../../../../shared';
import { WarehouseStore } from '../../../../store';
import { ProductSectionOrdersItemTemplate } from '../../../../templates';
import { ProductSectionOrdersItemTable } from '../ProductSectionOrdersItemTable/ProductSectionOrdersItemTable';

interface Props {
  entityId: number;
  isLoading: boolean;
  entityTypeId: number;
  productsSection: ProductsSection;
  productOrders?: Order[];
  fromEncoded?: string;
}

const ProductSectionOrdersItem = observer((props: Props) => {
  const { entityId, entityTypeId, productsSection, isLoading, productOrders, fromEncoded } = props;

  const warehouseStore = useMemo(
    () => new WarehouseStore(productsSection.id),
    [productsSection.id]
  );

  const { loadData: loadWarehouses } = warehouseStore;

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => loadWarehouses()
    );
  }, [loadWarehouses]);

  const defaultColumns = useProductsSectionOrdersColumns({
    entityId,
    entityTypeId,
    warehouseStore,
    sectionId: productsSection.id,
    fromEncoded,
  });

  const productsSectionOrdersTable = useReactTable<Order>({
    data: productOrders ?? [],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ProductSectionOrdersItemTemplate
      productOrders={productOrders}
      productOrdersLoaded={!isLoading}
      productsSection={productsSection}
      Table={
        <ProductSectionOrdersItemTable productsSectionOrdersTable={productsSectionOrdersTable} />
      }
    />
  );
});

ProductSectionOrdersItem.displayName = 'ProductSectionOrdersItem';
export { ProductSectionOrdersItem };

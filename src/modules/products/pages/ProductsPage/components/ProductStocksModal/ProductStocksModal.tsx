import { DialogModalSecondary, validateForm, type ModalControl } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UpdateStockDto, UpdateStocksDto, useUpdateProductStocks } from '../../../../api';
import type { Stock } from '../../../../shared';
import {
  ProductStockRow,
  useProductStocksColumns,
  type ProductsSectionType,
} from '../../../../shared';
import type { WarehouseStore } from '../../../../store';
import { AddWarehousePlaceholder } from '../AddWarehousePlaceholder/AddWarehousePlaceholder';
import { ProductStocksTable } from '../ProductStocksTable/ProductStocksTable';

const Content = styled.div`
  width: 100%;

  padding: 0 16px;
`;

const AddStockPlaceholderWrapper = styled.div`
  padding: 32px 16px;
`;

interface Props {
  productId: number;
  sectionType: ProductsSectionType;
  stocks: Stock[];
  modalControl: ModalControl;
  warehouseStore: WarehouseStore;
  canEditProducts: boolean;
}

const ProductStocksModal = observer((props: Props) => {
  const { productId, sectionType, stocks, modalControl, warehouseStore, canEditProducts } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.product_stocks_modal',
  });

  const { activeWarehouses, isLoaded: areWarehousesLoaded } = warehouseStore;
  const { mutateAsync: updateProductStocks } = useUpdateProductStocks({
    sectionId: warehouseStore.sectionId,
    productId,
  });

  const [stockRows, setStockRows] = useState<ProductStockRow[]>([]);

  const defaultColumns = useProductStocksColumns();

  useEffect(() => {
    if (activeWarehouses.length) {
      const rows: ProductStockRow[] = [];

      activeWarehouses.forEach(w => {
        const stock = stocks.find(s => s.warehouseId === w.id);

        rows.push(new ProductStockRow({ warehouse: w, stock }));
      });

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setStockRows(rows);
    }
  }, [activeWarehouses, stocks]);

  const productStocksTable = useReactTable<ProductStockRow>({
    data: stockRows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSave = () => {
    if (!validateForm(stockRows)) return;

    const dtos = stockRows.map<UpdateStockDto>(
      r =>
        new UpdateStockDto({
          warehouseId: r.warehouse.id,
          stockQuantity: r.stockQuantity.asNumber(),
        })
    );

    modalControl.close();

    updateProductStocks(new UpdateStocksDto(dtos));
  };

  return (
    <DialogModalSecondary
      width="640px"
      maxHeight="296px"
      Header={t('title')}
      onApprove={onSave}
      onClose={modalControl.close}
      isOpened={modalControl.opened}
    >
      {activeWarehouses.length > 0 ? (
        <Content>
          <ProductStocksTable
            disabled={!canEditProducts}
            loading={!areWarehousesLoaded}
            productStocksTable={productStocksTable}
          />
        </Content>
      ) : (
        <AddStockPlaceholderWrapper>
          <AddWarehousePlaceholder sectionId={warehouseStore.sectionId} sectionType={sectionType} />
        </AddStockPlaceholderWrapper>
      )}
    </DialogModalSecondary>
  );
});

ProductStocksModal.displayName = 'ProductStocksModal';
export { ProductStocksModal };

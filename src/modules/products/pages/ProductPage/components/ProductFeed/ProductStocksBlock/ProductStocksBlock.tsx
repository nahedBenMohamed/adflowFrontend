import { SaveCancelButtons } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { UpdateStocksDto, useUpdateProductStocks, type UpdateStockDto } from '../../../../../api';
import { AddWarehousePlaceholder, ProductStocksTable } from '../../../../../pages';
import {
  useProductStocksColumns,
  type ProductStockRow,
  type ProductsSectionType,
  type Stock,
} from '../../../../../shared';
import { ProductStockBlockStore, type WarehouseStore } from '../../../../../store';

const Root = styled.div`
  padding: 16px;

  gap: 16px;
  display: flex;
  flex-direction: column;
`;

const SaveCancelButtonsWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-end;
`;

interface Props {
  sectionId: number;
  sectionType: ProductsSectionType;
  productId: number;
  stocks: Stock[];
  disabled: boolean;
  warehouseStore: WarehouseStore;
}

const ProductStocksBlock = observer((props: Props) => {
  const { sectionId, sectionType, productId, stocks, disabled, warehouseStore } = props;

  const { accessibleWarehouses, isLoaded: areWarehousesLoaded } = warehouseStore;

  const { mutateAsync: updateProductStocks, isPending: updating } = useUpdateProductStocks({
    sectionId,
    productId,
  });

  const productStocksBlockStore = useMemo(
    () => new ProductStockBlockStore({ warehouses: accessibleWarehouses, stocks }),
    [accessibleWarehouses, stocks]
  );

  const { stockRows, handleCancel, isJsonStateChanged } = productStocksBlockStore;

  const defaultColumns = useProductStocksColumns();

  const productStocksTable = useReactTable<ProductStockRow>({
    data: stockRows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const stateChanged = isJsonStateChanged();

  const handleUpdateStocks = useCallback(async (): Promise<void> => {
    const updateStockDtos = stockRows.map<UpdateStockDto>(r => r.toUpdateStockDto());
    const updateStocksDto = new UpdateStocksDto(updateStockDtos);

    await updateProductStocks(updateStocksDto);
  }, [stockRows, updateProductStocks]);

  return (
    <Root>
      {accessibleWarehouses.length > 0 ? (
        <>
          <ProductStocksTable
            disabled={disabled}
            loading={!areWarehousesLoaded}
            productStocksTable={productStocksTable}
          />

          {!disabled && (
            <SaveCancelButtonsWrapper>
              <SaveCancelButtons
                saveLoading={updating}
                saveDisabled={!stateChanged}
                cancelDisabled={!stateChanged}
                handleSave={handleUpdateStocks}
                handleCancel={handleCancel}
              />
            </SaveCancelButtonsWrapper>
          )}
        </>
      ) : (
        <AddWarehousePlaceholder sectionId={sectionId} sectionType={sectionType} />
      )}
    </Root>
  );
});

ProductStocksBlock.displayName = 'ProductStocksBlock';
export { ProductStocksBlock };

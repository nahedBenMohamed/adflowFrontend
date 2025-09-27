import { InputModel, MyInput, debounce } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import { UpdateStockDto, UpdateStocksDto, useUpdateProductStocks } from '../../../../api';
import type { Stock } from '../../../../shared';
import type { WarehouseStore } from '../../../../store';

interface Props {
  disabled: boolean;
  productId: number;
  stocks: Stock[];
  warehouseStore: WarehouseStore;
}

const ProductStocksInput = observer((props: Props) => {
  const { disabled, productId, stocks, warehouseStore } = props;

  const { mutateAsync: updateProductStocks } = useUpdateProductStocks({
    sectionId: warehouseStore.sectionId,
    productId,
  });

  const { accessibleWarehouses } = warehouseStore;

  const firstWarehouse = accessibleWarehouses[0];

  const stockModel = useLocalObservable(() =>
    InputModel.createFromNumber(
      stocks.find(s => s.warehouseId === firstWarehouse?.id)?.stockQuantity ?? 0
    )
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(() => {
      if (!firstWarehouse) {
        return;
      }

      const dto = new UpdateStocksDto([
        new UpdateStockDto({
          warehouseId: firstWarehouse.id,
          stockQuantity: stockModel.asNumber(),
        }),
      ]);

      updateProductStocks(dto);
    }, 500),
    []
  );

  return (
    <MyInput
      variant="outlined"
      model={stockModel}
      disabled={disabled}
      handleChange={debouncedUpdate}
    />
  );
});

ProductStocksInput.displayName = 'ProductStocksInput';
export { ProductStocksInput };

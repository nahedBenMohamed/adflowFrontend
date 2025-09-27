import { useModalControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import { StockQuantityBlock, type ProductsSectionType, type Stock } from '../../../../../shared';
import type { WarehouseStore } from '../../../../../store';
import { ProductStocksInput } from '../../ProductStocksInput/ProductStocksInput';
import { ProductStocksModal } from '../../ProductStocksModal/ProductStocksModal';

interface Props {
  stocks: Stock[];
  productId: number;
  canEditProducts: boolean;
  warehouseStore: WarehouseStore;
  sectionType: ProductsSectionType;
}

const ProductStocksCell = observer((props: Props) => {
  const { stocks, productId, canEditProducts, warehouseStore, sectionType } = props;

  const { accessibleWarehouses } = warehouseStore;

  const stocksModalControl = useModalControl(false);

  const stocksQuantity = stocks.reduce<number>((acc, stock) => {
    return acc + stock.stockQuantity;
  }, 0);

  // we want to show input input and directly update stock quantity without showing the modal
  // when there is only one warehouse
  return accessibleWarehouses.length === 1 ? (
    <ProductStocksInput
      stocks={stocks}
      productId={productId}
      disabled={!canEditProducts}
      warehouseStore={warehouseStore}
    />
  ) : (
    <>
      <StockQuantityBlock onClick={stocksModalControl.open}>{stocksQuantity}</StockQuantityBlock>

      {stocksModalControl.opened && (
        <ProductStocksModal
          stocks={stocks}
          productId={productId}
          sectionType={sectionType}
          warehouseStore={warehouseStore}
          modalControl={stocksModalControl}
          canEditProducts={canEditProducts}
        />
      )}
    </>
  );
});

ProductStocksCell.displayName = 'ProductStocksCell';
export { ProductStocksCell };

import { ProductStocksColumnsIds } from './ProductStocksColumnsIds';

type ProductStocksColumnsIdsWithoutName = Exclude<
  ProductStocksColumnsIds,
  ProductStocksColumnsIds.NAME
>;

export const ProductStocksColumnsSizes: Record<ProductStocksColumnsIdsWithoutName, number> = {
  [ProductStocksColumnsIds.STOCK]: 64,
  [ProductStocksColumnsIds.AVAILABLE]: 64,
  [ProductStocksColumnsIds.RESERVED]: 64,
  [ProductStocksColumnsIds.QUANTITY]: 104,
} as const;

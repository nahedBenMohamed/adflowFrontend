import type { MinMaxColumnSize } from '@/shared';
import { ProductsColumnsIds } from './ProductsColumnsIds';

type ExtractedProductsColumnsIds = Extract<
  ProductsColumnsIds,
  ProductsColumnsIds.CHECKBOX | ProductsColumnsIds.NAME
>;

export const ProductsColumnsSizes: Record<ExtractedProductsColumnsIds | MinMaxColumnSize, number> =
  {
    [ProductsColumnsIds.CHECKBOX]: 16,
    [ProductsColumnsIds.NAME]: 176,
    min: 104,
    max: 656,
  } as const;

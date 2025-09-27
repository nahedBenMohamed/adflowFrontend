import { ProductsSectionOrdersCommonColumnsIds } from './ProductsSectionOrdersCommonColumnsIds';

type ProductsSectionOrdersCommonColumnsSizesWithoutName = Exclude<
  ProductsSectionOrdersCommonColumnsIds,
  ProductsSectionOrdersCommonColumnsIds.NAME
>;

export const ProductsSectionOrdersCommonColumnsSizes: Record<
  ProductsSectionOrdersCommonColumnsSizesWithoutName,
  number
> = {
  [ProductsSectionOrdersCommonColumnsIds.WAREHOUSE]: 184,
  [ProductsSectionOrdersCommonColumnsIds.STATUS]: 176,
  [ProductsSectionOrdersCommonColumnsIds.CREATED_AT]: 144,
  [ProductsSectionOrdersCommonColumnsIds.CREATED_BY]: 224,
  [ProductsSectionOrdersCommonColumnsIds.LINKED_ENTITY]: 200,
} as const;

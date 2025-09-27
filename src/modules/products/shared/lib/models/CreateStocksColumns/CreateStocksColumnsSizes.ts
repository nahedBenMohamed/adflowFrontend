import { CreateStocksColumnsIds } from './CreateStocksColumnsIds';

type CreateStocksColumnsIdsWithoutName = Exclude<
  CreateStocksColumnsIds,
  CreateStocksColumnsIds.WAREHOUSE_NAME
>;

export const CreateStocksColumnsSizes: Record<CreateStocksColumnsIdsWithoutName, number> = {
  [CreateStocksColumnsIds.STOCK]: 104,
} as const;

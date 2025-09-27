import type { InputModel, Nullable, SelectModel } from '@/shared';

export interface OrderBlockFilterProps {
  searchModel: InputModel;
  filterWarehouseId: Nullable<number>;
  filterCategoryId: SelectModel;
  debouncedSearchQuery: (searchQuery: string) => void;
  setFilterWarehouseId: (warehouseId: Nullable<number>) => void;
  handleClearSearchQuery: () => void;
  handleSelectFilterCategory: (categoryId: Nullable<number>) => void;
  handleSelectFilterWarehouse: (warehouseId: Nullable<number>) => void;
}

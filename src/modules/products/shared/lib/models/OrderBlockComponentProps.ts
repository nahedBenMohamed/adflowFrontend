import type { Entity } from '@/shared';
import type { ProductCategoryStore, WarehouseStore } from '../../../store';
import type { LastSelectedWarehouseSettings } from './LastSelectedWarehouseSettings';
import type { OrderBlockFilterProps } from './OrderBlockFilterProps';
import type { OrderMutationRights } from './OrderMutationRights';
import type { GetProductsResult } from './Product/GetProductsResult';
import type { ProductsSection } from './ProductsSection/ProductsSection';

export interface OrderBlockComponentProps {
  entity: Entity;
  orderId: string;
  currentPage: number;
  productsLoading: boolean;
  warehousesEnabled: boolean;
  warehouseStore: WarehouseStore;
  productsSection: ProductsSection;
  filterProps: OrderBlockFilterProps;
  mutationRights: OrderMutationRights;
  showingPreviousProductsData: boolean;
  productCategoryStore: ProductCategoryStore;
  productsResult?: GetProductsResult;
  lastSelectedWarehouseSettings?: LastSelectedWarehouseSettings;
  setOrderIdParam: (orderId: number) => void;
  setCurrentPage: (page: number) => void;
}

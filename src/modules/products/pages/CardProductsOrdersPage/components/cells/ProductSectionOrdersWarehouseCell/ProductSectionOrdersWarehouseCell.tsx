import type { Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { WarehouseStore } from '../../../../../store';

const Root = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  warehouseId: Nullable<number>;
  warehouseStore: WarehouseStore;
}

const ProductSectionOrdersWarehouseCell = observer((props: Props) => {
  const { warehouseId, warehouseStore } = props;

  if (!warehouseId || !warehouseStore.isLoaded) return null;

  const warehouse = warehouseStore.getWarehouseById(warehouseId);

  return <Root>{warehouse.name}</Root>;
});

ProductSectionOrdersWarehouseCell.displayName = 'ProductSectionOrdersWarehouseCell';
export { ProductSectionOrdersWarehouseCell };

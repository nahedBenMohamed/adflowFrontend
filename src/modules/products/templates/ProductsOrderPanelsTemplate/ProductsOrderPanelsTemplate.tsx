import type { ReactNode } from 'react';
import { PanelGroup } from 'react-resizable-panels';
import { ProductsOrderComponentRoot } from '../../shared';
import { ProductsOrderResizeHandler } from './components';

interface Props {
  entityTypeId: number;
  OrderBlock: ReactNode;
  WarehouseBlock: ReactNode;
  warehouseBlockVisible: boolean;
}

const ProductsOrderPanelsTemplate = (props: Props) => {
  const { entityTypeId, OrderBlock, WarehouseBlock, warehouseBlockVisible } = props;

  return (
    <ProductsOrderComponentRoot>
      <PanelGroup direction="vertical" autoSaveId={`OrderPanelsSizeState-${entityTypeId}`}>
        {OrderBlock}

        {warehouseBlockVisible && (
          <>
            <ProductsOrderResizeHandler />

            {WarehouseBlock}
          </>
        )}
      </PanelGroup>
    </ProductsOrderComponentRoot>
  );
};

export { ProductsOrderPanelsTemplate };

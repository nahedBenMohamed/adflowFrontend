import { routes } from '@/app';
import type { SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  OrderStatusSelect,
  ProductsSectionType,
  generateOrderName,
  type CheckBarcodeResult,
  type ProductsSection,
  type Shipment,
} from '../../../../../../shared';
import { orderStatusStore, type WarehouseStore } from '../../../../../../store';
import { ShipmentPageSecondaryHeaderTemplate } from '../../../../../../templates';
import { ProductBarcodesControl } from '../../../ProductBarcodesControl/ProductBarcodesControl';

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  sectionId: number;
  canEdit: boolean;
  barcodesEnabled: boolean;
  warehouseStore: WarehouseStore;
  shipment?: Shipment;
  productsSection?: ProductsSection;
  statusModel: SelectModel;
  checkBarcode: (barcode: string) => Promise<CheckBarcodeResult>;
  changeStatus: (statusId: number) => void;
}

const ShipmentPageSecondaryHeader = observer((props: Props) => {
  const {
    sectionId,
    barcodesEnabled,
    warehouseStore,
    canEdit,
    shipment,
    statusModel,
    checkBarcode,
    changeStatus,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.ui.shipment_page_secondary_header',
  });

  const warehouseName = shipment
    ? warehouseStore.getWarehouseById(shipment.warehouseId).name
    : undefined;

  return (
    <ShipmentPageSecondaryHeaderTemplate
      warehouseName={warehouseName}
      entityInfo={shipment?.entityInfo}
      backLink={routes.shipments({ sectionId, sectionType: ProductsSectionType.SALE })}
      shipmentName={shipment ? generateOrderName({ orderNumber: shipment.orderId, t }) : undefined}
      Controls={
        orderStatusStore.isLoaded && (
          <ControlsWrapper>
            {barcodesEnabled && shipment && (
              <ProductBarcodesControl
                sectionId={sectionId}
                orderId={shipment.orderId}
                entityId={shipment.entityInfo.id}
                sectionType={ProductsSectionType.SALE}
                entityTypeId={shipment.entityInfo.entityTypeId}
                checkBarcode={checkBarcode}
              />
            )}

            {shipment && (
              <OrderStatusSelect
                disabled={!canEdit}
                model={statusModel}
                statuses={orderStatusStore.getShipmentAvailableStatuses(shipment.statusId)}
                onChange={changeStatus}
              />
            )}
          </ControlsWrapper>
        )
      }
    />
  );
});

export { ShipmentPageSecondaryHeader };

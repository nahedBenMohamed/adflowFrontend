import { routes } from '@/app';
import type { SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ProductsSectionType,
  RentalOrderStatusSelect,
  generateOrderName,
  type CheckBarcodeResult,
  type RentalOrder,
  type RentalOrderStatus,
} from '../../../../../../shared';
import { ShipmentPageSecondaryHeaderTemplate } from '../../../../../../templates/ShipmentPageSecondaryHeaderTemplate/ShipmentPageSecondaryHeaderTemplate';
import { ProductBarcodesControl } from '../../../ProductBarcodesControl/ProductBarcodesControl';

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  canEdit: boolean;
  barcodesEnabled: boolean;
  sectionId: number;
  statusModel: SelectModel;
  shipment?: RentalOrder;
  checkBarcode: (barcode: string) => Promise<CheckBarcodeResult>;
  changeOrderStatus: (status: RentalOrderStatus) => void;
}

const RentalShipmentPageSecondaryHeader = observer((props: Props) => {
  const {
    canEdit,
    shipment,
    barcodesEnabled,
    sectionId,
    statusModel,
    checkBarcode,
    changeOrderStatus,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.ui.rental_shipment_page_secondary_header',
  });

  return (
    <ShipmentPageSecondaryHeaderTemplate
      entityInfo={shipment?.entityInfo}
      shipmentName={
        shipment ? generateOrderName({ orderNumber: shipment.orderNumber, t }) : undefined
      }
      backLink={routes.shipments({ sectionId, sectionType: ProductsSectionType.RENTAL })}
      Controls={
        <ControlsWrapper>
          {barcodesEnabled && shipment && (
            <ProductBarcodesControl
              sectionId={sectionId}
              orderId={shipment.id}
              entityId={shipment.entityInfo.id}
              sectionType={ProductsSectionType.RENTAL}
              entityTypeId={shipment.entityInfo.entityTypeId}
              checkBarcode={checkBarcode}
            />
          )}

          <RentalOrderStatusSelect
            model={statusModel}
            disabled={!canEdit}
            onChange={changeOrderStatus}
          />
        </ControlsWrapper>
      }
    />
  );
});

RentalShipmentPageSecondaryHeader.displayName = 'RentalShipmentPageSecondaryHeader';
export { RentalShipmentPageSecondaryHeader };

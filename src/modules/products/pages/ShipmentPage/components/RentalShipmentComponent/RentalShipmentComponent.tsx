import { appStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  PermissionObjectType,
  SelectModel,
  WholePageLoaderWithLogo,
  useModalControl,
  type Nullable,
} from '@/shared';
import { useDidUpdate } from '@mantine/hooks';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { productApi, useChangeRentalOrderStatus } from '../../../../api';
import {
  generateOrderName,
  useRentalShipmentColumns,
  type CheckBarcodeResult,
  type ProductsSection,
  type RentalOrderStatus,
  type RentalShipmentItemRow,
} from '../../../../shared';
import { RentalShipmentStore } from '../../../../store';
import { ShipmentRoot } from '../ShipmentRoot/ShipmentRoot';
import { SomeProductsNotCheckedWarningModal } from '../SomeProductsNotCheckedWarningModal/SomeProductsNotCheckedWarningModal';
import { RentalShipmentPageSecondaryHeader, RentalShipmentTable } from './components';

export interface RentalShipmentComponentProps {
  sectionId: number;
  shipmentId: number;
  currentPageEncodedUrl: string;
  productsSection?: ProductsSection;
  setShipmentName: (name: string) => void;
}

const RentalShipmentComponent = observer((props: RentalShipmentComponentProps) => {
  const { sectionId, shipmentId, currentPageEncodedUrl, productsSection, setShipmentName } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.ui.rental_shipment_page_secondary_header',
  });

  const { user: currentUser } = authStore;
  const canEdit = Boolean(currentUser?.canEdit(PermissionObjectType.PRODUCTS_ORDER, sectionId));

  const { mutate: changeOrderStatus } = useChangeRentalOrderStatus({
    sectionId,
    orderId: shipmentId,
  });

  const someProductsNotCheckedWarningControl = useModalControl(false);

  const shipmentStore = useMemo(
    () => new RentalShipmentStore({ sectionId, shipmentId }),
    [sectionId, shipmentId]
  );

  const { isLoaded, shipment, rentalShipmentItemRows, initializeRows } = shipmentStore;

  useLayoutEffect(() => {
    if (appStore.isLoaded) initializeRows();
  }, [initializeRows]);

  useEffect(() => {
    if (!shipment) return;

    setShipmentName(generateOrderName({ orderNumber: shipment.orderNumber, t }));
  }, [shipment, setShipmentName, t]);

  const barcodesEnabled = Boolean(productsSection?.enableBarcode);

  const defaultColumns = useRentalShipmentColumns({
    shipmentStore,
    currentPageDecodeUrl: currentPageEncodedUrl,
  });

  const shipmentTable = useReactTable<RentalShipmentItemRow>({
    data: rentalShipmentItemRows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const checkBarcode = useCallback(
    async (barcode: string): Promise<CheckBarcodeResult> => {
      const { products } = await productApi.getProducts({
        sectionId,
        queryParams: {
          sku: barcode.trim(),
        },
      });

      let productIsNotInOrder = false;

      products.forEach(p => {
        const result = shipmentStore.checkRow(p.id);

        if (!result) {
          productIsNotInOrder = true;
        }
      });

      return { productDoesNotExist: !products.length, productIsNotInOrder };
    },
    [shipmentStore, sectionId]
  );

  const statusModel = useLocalObservable(() =>
    SelectModel.create(shipment ? shipment.status : null)
  );

  const [pendingStatus, setPendingStatus] = useState<Nullable<RentalOrderStatus>>(null);

  useDidUpdate(() => {
    if (shipment) {
      statusModel.setValue(shipment.status);
    }
  }, [statusModel, shipment]);

  const handleChangeOrderStatus = useCallback(
    (status: RentalOrderStatus) => {
      setPendingStatus(null);

      if (shipmentStore.allRowsChecked) {
        changeOrderStatus(status);

        shipmentStore.uncheckAllRows();
      } else {
        someProductsNotCheckedWarningControl.open();

        setPendingStatus(status);
      }
    },
    [shipmentStore, someProductsNotCheckedWarningControl, changeOrderStatus]
  );

  const handleApproveStatusChange = useCallback(() => {
    if (pendingStatus) {
      changeOrderStatus(pendingStatus);

      setPendingStatus(null);
    }

    shipmentStore.uncheckAllRows();
    someProductsNotCheckedWarningControl.close();
  }, [shipmentStore, pendingStatus, someProductsNotCheckedWarningControl, changeOrderStatus]);

  const handleCancelStatusChange = useCallback(() => {
    if (shipment) {
      statusModel.setValue(shipment.status);

      setPendingStatus(null);
    }

    someProductsNotCheckedWarningControl.close();
  }, [shipment, statusModel, someProductsNotCheckedWarningControl]);

  return (
    <ShipmentRoot>
      <RentalShipmentPageSecondaryHeader
        canEdit={canEdit}
        sectionId={sectionId}
        statusModel={statusModel}
        shipment={shipment ?? undefined}
        barcodesEnabled={barcodesEnabled}
        checkBarcode={checkBarcode}
        changeOrderStatus={handleChangeOrderStatus}
      />

      {appStore.isLoaded ? (
        <RentalShipmentTable isLoaded={isLoaded} shipmentTable={shipmentTable} />
      ) : (
        <WholePageLoaderWithLogo />
      )}

      {someProductsNotCheckedWarningControl.opened && (
        <SomeProductsNotCheckedWarningModal
          control={someProductsNotCheckedWarningControl}
          onCancel={handleCancelStatusChange}
          onApprove={handleApproveStatusChange}
        />
      )}
    </ShipmentRoot>
  );
});

RentalShipmentComponent.displayName = 'RentalShipmentComponent';
export { RentalShipmentComponent };

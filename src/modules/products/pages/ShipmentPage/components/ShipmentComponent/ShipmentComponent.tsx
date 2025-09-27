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
import { when } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { productApi } from '../../../../api';
import {
  generateOrderName,
  type CheckBarcodeResult,
  type ProductsSection,
} from '../../../../shared';
import { ShipmentStore, WarehouseStore } from '../../../../store';
import { ShipmentRoot } from '../ShipmentRoot/ShipmentRoot';
import { SomeProductsNotCheckedWarningModal } from '../SomeProductsNotCheckedWarningModal/SomeProductsNotCheckedWarningModal';
import { ShipmentPageSecondaryHeader, ShipmentTable } from './components';

export interface ShipmentComponentProps {
  sectionId: number;
  shipmentId: number;
  currentPageEncodedUrl: string;
  productsSection?: ProductsSection;
  setShipmentName: (name: string) => void;
}

const ShipmentComponent = observer((props: ShipmentComponentProps) => {
  const { sectionId, shipmentId, currentPageEncodedUrl, productsSection, setShipmentName } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.ui.shipment_page_secondary_header',
  });

  const { user: currentUser } = authStore;
  const canEdit = Boolean(currentUser?.canEdit(PermissionObjectType.PRODUCTS_SHIPMENT, sectionId));

  const barcodesEnabled = Boolean(productsSection?.enableBarcode);

  const warehouseStore = useMemo(() => new WarehouseStore(sectionId), [sectionId]);

  const { loadData: loadWarehouses } = warehouseStore;

  const shipmentStore = useMemo(
    () => new ShipmentStore({ sectionId, shipmentId }),
    [sectionId, shipmentId]
  );

  const { shipment, initializeRows, changeShipmentStatus } = shipmentStore;

  const someProductsNotCheckedWarningControl = useModalControl(false);

  const statusModel = useLocalObservable(() =>
    SelectModel.create(shipment ? shipment.statusId : null)
  );

  useDidUpdate(() => {
    if (shipment) statusModel.setValue(shipment.statusId);
  }, [statusModel, shipment]);

  useLayoutEffect(() => {
    when(
      () => appStore.isLoaded,
      async (): Promise<void> => {
        await loadWarehouses();

        initializeRows();
      }
    );
  }, [initializeRows, loadWarehouses]);

  useEffect(() => {
    if (!shipment) return;

    setShipmentName(generateOrderName({ orderNumber: shipment.orderId, t }));
  }, [shipment, setShipmentName, t]);

  const [pendingStatusId, setPendingStatusId] = useState<Nullable<number>>(null);

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

        if (!result) productIsNotInOrder = true;
      });

      return { productDoesNotExist: !products.length, productIsNotInOrder };
    },
    [shipmentStore, sectionId]
  );

  const handleChangeShipmentStatus = useCallback(
    (statusId: number) => {
      setPendingStatusId(null);

      if (shipmentStore.allRowsChecked) {
        changeShipmentStatus(statusId);

        shipmentStore.uncheckAllRows();
      } else {
        someProductsNotCheckedWarningControl.open();

        setPendingStatusId(statusId);
      }
    },
    [shipmentStore, someProductsNotCheckedWarningControl, changeShipmentStatus]
  );

  const handleApproveStatusChange = useCallback(() => {
    if (pendingStatusId) {
      changeShipmentStatus(pendingStatusId);

      setPendingStatusId(null);
    }

    shipmentStore.uncheckAllRows();
    someProductsNotCheckedWarningControl.close();
  }, [shipmentStore, pendingStatusId, someProductsNotCheckedWarningControl, changeShipmentStatus]);

  const handleCancelStatusChange = useCallback(() => {
    if (shipment) {
      statusModel.setValue(shipment.statusId);

      setPendingStatusId(null);
    }

    someProductsNotCheckedWarningControl.close();
  }, [shipment, statusModel, someProductsNotCheckedWarningControl]);

  return (
    <ShipmentRoot>
      <ShipmentPageSecondaryHeader
        canEdit={canEdit}
        sectionId={sectionId}
        statusModel={statusModel}
        warehouseStore={warehouseStore}
        shipment={shipment ?? undefined}
        barcodesEnabled={barcodesEnabled}
        checkBarcode={checkBarcode}
        changeStatus={handleChangeShipmentStatus}
      />

      {appStore.isLoaded ? (
        <ShipmentTable shipmentStore={shipmentStore} currentPageDecodeUrl={currentPageEncodedUrl} />
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

ShipmentComponent.displayName = 'ShipmentComponent';
export { ShipmentComponent };

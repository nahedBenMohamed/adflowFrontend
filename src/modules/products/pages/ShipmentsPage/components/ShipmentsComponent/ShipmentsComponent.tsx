import { appStore } from '@/app';
import { authStore } from '@/modules/auth';
import { PermissionObjectType, WholePageLoaderWithLogo, type ToggleControl } from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useGetShipments } from '../../../../api';
import { WarehouseStore } from '../../../../store';
import { ShipmentsTable } from './components';

interface Props {
  sectionId: number;
  currentPage: number;
  tableSettingsControl: ToggleControl;
  handleChangePage: (page: number) => void;
}

const ShipmentsComponent = observer((props: Props) => {
  const { sectionId, currentPage, tableSettingsControl, handleChangePage } = props;

  const { user: currentUser } = authStore;
  const canEdit = Boolean(currentUser?.canEdit(PermissionObjectType.PRODUCTS_SHIPMENT, sectionId));

  const warehouseStore = useMemo(() => new WarehouseStore(sectionId), [sectionId]);

  const { loadData: loadWarehouses, isLoaded: areWarehousesLoaded } = warehouseStore;

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => loadWarehouses()
    );
  }, [loadWarehouses]);

  const {
    data: shipmentsResult,
    isLoading: areShipmentsLoading,
    isPlaceholderData: showingPreviousData,
  } = useGetShipments({ sectionId, page: currentPage });

  const shipmentsLoaded = !areShipmentsLoading;
  const dataLoaded = areWarehousesLoaded && shipmentsLoaded;

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  return dataLoaded ? (
    <ShipmentsTable
      canEdit={canEdit}
      sectionId={sectionId}
      currentPage={currentPage}
      loading={areShipmentsLoading}
      warehouseStore={warehouseStore}
      shipmentsResult={shipmentsResult}
      showingPreviousData={showingPreviousData}
      tableSettingsControl={tableSettingsControl}
      handleChangePage={handleChangePage}
    />
  ) : (
    <WholePageLoaderWithLogo ensureSubheaderWithOffset />
  );
});

ShipmentsComponent.displayName = 'ShipmentsComponent';
export { ShipmentsComponent };

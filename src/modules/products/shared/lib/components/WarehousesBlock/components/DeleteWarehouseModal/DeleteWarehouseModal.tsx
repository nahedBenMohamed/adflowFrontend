import { MySelect, SelectModel, WarningModal, type Option } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { WarehouseStore } from '../../../../../../store';
import type { Warehouse } from '../../../../models';

const Root = styled.div`
  padding: 24px 32px 16px;
`;

interface Props {
  opened: boolean;
  warehouse: Warehouse;
  warehouseStore: WarehouseStore;
  onClose: () => void;
}

const DeleteWarehouseModal = observer((props: Props) => {
  const { opened, warehouse, warehouseStore, onClose } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.warehouses_page.ui.delete_warehouse_modal',
  });

  const { accessibleWarehouses, deleteWarehouse } = warehouseStore;

  const [deleting, setDeleting] = useState(false);

  const newWarehouseId = useLocalObservable(() => SelectModel.create());

  const onDelete = async (newWarehouseId?: number): Promise<void> => {
    await deleteWarehouse({ warehouseId: warehouse.id, newWarehouseId });
  };

  const handleApproveDelete = async (): Promise<void> => {
    try {
      setDeleting(true);

      await onDelete(newWarehouseId.value);
    } finally {
      setDeleting(false);
    }

    onClose();
  };

  const newWarehouseOptions = accessibleWarehouses.map<Option<number>>(w => ({
    value: w.id,
    label: w.name,
  }));

  const hasNewWarehouseOptions = newWarehouseOptions.length > 0;

  return (
    <WarningModal
      isDanger
      isOpened={opened}
      approveLoading={deleting}
      approveDisabled={deleting}
      title={t('title', { name: warehouse.name })}
      maxHeight={hasNewWarehouseOptions ? '464px' : undefined}
      annotation={hasNewWarehouseOptions ? t('annotation_move_stocks') : t('annotation')}
      onClose={onClose}
      onApprove={handleApproveDelete}
    >
      {hasNewWarehouseOptions && (
        <Root>
          <MySelect
            withinPortal
            variant="outlined"
            model={newWarehouseId}
            options={newWarehouseOptions}
            placeholder={t('placeholders.move_stocks_to')}
          />
        </Root>
      )}
    </WarningModal>
  );
});

DeleteWarehouseModal.displayName = 'DeleteWarehouseModal';
export { DeleteWarehouseModal };

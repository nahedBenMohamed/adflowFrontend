import { DeleteButton, InputModel, MyInput, debounce } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { UpdateWarehouseDto } from '../../../../../../api';
import type { WarehouseStore } from '../../../../../../store';
import { WarehouseIcon } from '../../../../../assets';
import type { Warehouse } from '../../../../models';
import { DeleteWarehouseModal } from '../DeleteWarehouseModal/DeleteWarehouseModal';

const Root = styled.div<{ disabled?: boolean }>`
  max-width: 600px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);

  ${p =>
    p.disabled &&
    css`
      pointer-events: none;

      opacity: 0.65;
    `}
`;

const TopBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WarehouseIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  // to align with the input
  margin-bottom: 2px;
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  warehouseStore: WarehouseStore;
  warehouse: Warehouse;
  disabled?: boolean;
}

const WarehousesBlockComponent = observer((props: Props) => {
  const { warehouseStore, warehouse, disabled } = props;

  const { updateWarehouse } = warehouseStore;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.warehouses_page',
  });

  const [deleteWarningOpened, { close: hideDeleteWarning, open: showDeleteWarning }] =
    useDisclosure(false);
  const [updating, setUpdating] = useState(false);

  const nameModel = useLocalObservable(() => InputModel.create(warehouse.name).required());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateGroup = useCallback(
    debounce(async (): Promise<void> => {
      if (!nameModel.validate()) {
        return;
      }

      try {
        setUpdating(true);

        const dto = new UpdateWarehouseDto(nameModel.value);
        await updateWarehouse(warehouse.id, dto);
      } finally {
        setUpdating(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    warehouse.name = nameModel.value;
  }, [warehouse, nameModel.value]);

  return (
    <Root disabled={disabled}>
      <TopBlock>
        <InputWrapper>
          <WarehouseIconWrapper>
            <WarehouseIcon />
          </WarehouseIconWrapper>

          <MyInput
            medium
            model={nameModel}
            loading={updating}
            placeholder={t('placeholders.name')}
            handleChange={debouncedUpdateGroup}
          />
        </InputWrapper>

        <IconsWrapper>
          <DeleteButton size="small" onClick={showDeleteWarning} />
        </IconsWrapper>
      </TopBlock>

      {deleteWarningOpened && (
        <DeleteWarehouseModal
          warehouse={warehouse}
          opened={deleteWarningOpened}
          warehouseStore={warehouseStore}
          onClose={hideDeleteWarning}
        />
      )}
    </Root>
  );
});

WarehousesBlockComponent.displayName = 'WarehousesBlockComponent';
export { WarehousesBlockComponent };

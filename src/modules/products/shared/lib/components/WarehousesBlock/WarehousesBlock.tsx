import { BuilderStepTitle } from '@/modules/builder';
import { AddItemForm, NoSelectMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CreateWarehouseDto } from '../../../../api';
import type { WarehouseStore } from '../../../../store';
import { WarehousePageBlockSkeleton, WarehousesBlockComponent } from './components';

const Root = styled.div`
  padding: 24px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);
`;

const AddWarehouseForm = styled.div<{ $disabled?: boolean }>`
  max-width: 600px;

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.5;

      ${NoSelectMixin}
    `}
`;

interface Props {
  warehouseStore: WarehouseStore;
  disabled?: boolean;
  showSkeleton?: boolean;
  children?: ReactNode;
}

const WarehousesBlock = observer((props: Props) => {
  const { warehouseStore, disabled, showSkeleton = true, children } = props;

  const { activeWarehouses, isLoaded, addWarehouse } = warehouseStore;

  const onWarehouseAdd = async (name: string): Promise<void> => {
    const dto = new CreateWarehouseDto(name);

    await addWarehouse(dto);
  };

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.warehouses_page',
  });

  return (
    <Root>
      <BuilderStepTitle>{t('page_title')}</BuilderStepTitle>

      {children}

      <AddWarehouseForm $disabled={disabled}>
        <AddItemForm
          placeholder={t('placeholders.name')}
          buttonText={t('add_warehouse')}
          onAdd={onWarehouseAdd}
        />
      </AddWarehouseForm>

      {isLoaded
        ? activeWarehouses.map(w => (
            <WarehousesBlockComponent
              key={w.id}
              warehouse={w}
              disabled={disabled}
              warehouseStore={warehouseStore}
            />
          ))
        : showSkeleton &&
          new Array(3)
            .fill(0)
            .map((_, idx) => <WarehousePageBlockSkeleton key={idx} $delay={idx * 300} />)}
    </Root>
  );
});

WarehousesBlock.displayName = 'WarehousesBlock';
export { WarehousesBlock };

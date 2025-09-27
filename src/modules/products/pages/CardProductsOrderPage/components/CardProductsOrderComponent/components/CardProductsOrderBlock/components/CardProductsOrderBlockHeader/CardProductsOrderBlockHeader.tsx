import { useGetProductsSectionAfterCancelDelayOptions } from '@/modules/builder';
import { DelaySelect, DeleteButton, MyTooltip, type Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  OrderStatusSelect,
  ProductWarehousesSelect,
  type OrderStatusSelectProps,
  type ProductWarehousesSelectProps,
} from '../../../../../../../../shared';

const Root = styled.div<{ $disabled: boolean }>`
  display: flex;
  align-items: center;

  ${p => p.$disabled && `pointer-events: none`}
`;

const DeleteButtonWrapper = styled.div`
  margin-left: 16px;
`;

const DelaySelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  margin-left: 16px;
`;

interface CancelAfterSelectProps {
  visible: boolean;
  cancelAfter: Nullable<number>;
  onChange: (value: Nullable<number>) => void;
}

export interface CardOrderBlockHeaderProps {
  disabled: boolean;
  cancelAfterSelectProps: CancelAfterSelectProps;
  statusesSelectProps?: OrderStatusSelectProps;
  warehouseSelectProps?: ProductWarehousesSelectProps<Nullable<number>>;
  onDelete?: () => void;
}

const CardProductsOrderBlockHeader = (props: CardOrderBlockHeaderProps) => {
  const { disabled, statusesSelectProps, warehouseSelectProps, cancelAfterSelectProps, onDelete } =
    props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_products_order_component.ui.card_products_order_block_header',
  });

  const delayOptions = useGetProductsSectionAfterCancelDelayOptions();

  return (
    <Root $disabled={disabled}>
      {/* If ProductWarehousesSelect is readonly and no value was selected – hide it */}
      {warehouseSelectProps && (!warehouseSelectProps.disabled || warehouseSelectProps.model) && (
        <ProductWarehousesSelect
          titleWidth="224px"
          placeholder={t('placeholders.select_order_warehouse')}
          {...warehouseSelectProps}
        />
      )}

      {cancelAfterSelectProps.visible && (
        <MyTooltip
          multiline
          withinPortal
          maxWidth={550}
          position="top-end"
          label={t('cancel_after_hint')}
        >
          <DelaySelectWrapper>
            <DelaySelect
              hideMinutes
              minifiedTitle
              titleWidth="90px"
              position="top-end"
              options={delayOptions}
              intervalInputFullWidth
              maxHeight="fit-content"
              dropdownFixedWidth={240}
              customIntervalColumnVariant
              delay={cancelAfterSelectProps.cancelAfter}
              onChange={cancelAfterSelectProps.onChange}
            />
          </DelaySelectWrapper>
        </MyTooltip>
      )}

      {statusesSelectProps && (
        <OrderStatusSelect
          // for smooth appearance animation
          margin={statusesSelectProps.visible ? '0 0 0 16px' : 0}
          {...statusesSelectProps}
        />
      )}

      {onDelete && (
        <DeleteButtonWrapper>
          <DeleteButton size="medium" onClick={onDelete} />
        </DeleteButtonWrapper>
      )}
    </Root>
  );
};

export { CardProductsOrderBlockHeader };

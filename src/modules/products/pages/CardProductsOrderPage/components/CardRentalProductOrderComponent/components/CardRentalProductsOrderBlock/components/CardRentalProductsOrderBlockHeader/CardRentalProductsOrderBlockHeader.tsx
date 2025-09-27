import { DeleteButton, type Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ProductWarehousesSelect,
  RentalOrderStatusSelect,
  type ProductWarehousesSelectProps,
  type RentalOrderStatusSelectProps,
} from '../../../../../../../../shared';
import {
  RentalOrderPeriodsControl,
  type RentalOrderPeriodsControlProps,
} from '../RentalOrderPeriodsControl/RentalOrderPeriodsControl';

const Root = styled.div<{ $disabled: boolean }>`
  display: flex;
  align-items: center;

  ${p => p.$disabled && `pointer-events: none`};
`;

const DeleteButtonWrapper = styled.div`
  margin-left: 16px;
`;

export interface CardRentalProductsOrderBlockHeaderProps {
  disabled: boolean;
  statusesSelectProps: RentalOrderStatusSelectProps;
  rentalOrderPeriodsControlProps: RentalOrderPeriodsControlProps;
  warehouseSelectProps?: ProductWarehousesSelectProps<Nullable<number>>;
  onDelete?: () => void;
}

const SELECT_TITLE_WIDTH = '224px';

const CardRentalProductsOrderBlockHeader = (props: CardRentalProductsOrderBlockHeaderProps) => {
  const {
    disabled,
    statusesSelectProps,
    rentalOrderPeriodsControlProps,
    warehouseSelectProps,
    onDelete,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_rental_products_order_component.ui.card_rental_products_order_block_header',
  });

  return (
    <Root $disabled={disabled}>
      {warehouseSelectProps && (
        <ProductWarehousesSelect
          titleWidth={SELECT_TITLE_WIDTH}
          placeholder={t('placeholders.select_order_warehouse')}
          {...warehouseSelectProps}
        />
      )}

      <RentalOrderPeriodsControl
        margin="0 0 0 16px"
        titleWidth={SELECT_TITLE_WIDTH}
        {...rentalOrderPeriodsControlProps}
      />

      <RentalOrderStatusSelect
        // for smooth appearance animation
        margin={statusesSelectProps.visible ? '0 0 0 16px' : 0}
        {...statusesSelectProps}
      />

      {onDelete && (
        <DeleteButtonWrapper>
          <DeleteButton size="medium" onClick={onDelete} />
        </DeleteButtonWrapper>
      )}
    </Root>
  );
};

export { CardRentalProductsOrderBlockHeader };

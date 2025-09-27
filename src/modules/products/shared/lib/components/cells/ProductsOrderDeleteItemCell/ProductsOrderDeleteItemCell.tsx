import { authStore } from '@/modules/auth';
import { MyTooltip, PermissionObjectType } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { OrderStore, RentalOrderStore } from '../../../../../store';
import { DeleteIcon } from '../../../../assets';
import { CardOrderColumnsSizes } from '../../../models';

const Root = styled.button`
  width: ${CardOrderColumnsSizes.actions}px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path,
  rect {
    transition: var(--transition-200);
  }

  &:not(:disabled):hover {
    svg {
      rect {
        stroke: var(--button-text-red-hover);
      }

      path {
        fill: var(--button-text-red-hover);
      }
    }
  }

  &:not(:disabled):active {
    svg {
      rect {
        stroke: var(--button-text-red-active);
      }

      path {
        fill: var(--button-text-red-active);
      }
    }
  }

  &:disabled {
    cursor: default;

    opacity: 0.5;
  }
`;

interface Props {
  orderStore: OrderStore | RentalOrderStore;
  disabled?: boolean;
  onDelete: () => void;
  showDeleteOrderOrClearItemsWarningModal: () => void;
}

const ProductsOrderDeleteItemCell = observer((props: Props) => {
  const { orderStore, disabled, onDelete, showDeleteOrderOrClearItemsWarningModal } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common',
  });

  const { user: currentUser } = authStore;

  const { orderItemRows, orderId } = orderStore;

  const canDeleteOrder = currentUser?.canDelete(PermissionObjectType.PRODUCTS_ORDER, orderId);

  const handler =
    orderItemRows.length === 1 && orderId
      ? canDeleteOrder
        ? showDeleteOrderOrClearItemsWarningModal
        : onDelete
      : onDelete;

  return (
    <MyTooltip withinPortal disabled={!disabled} label={t('readonly_delete')}>
      <Root disabled={disabled} onClick={disabled ? undefined : handler}>
        <DeleteIcon />
      </Root>
    </MyTooltip>
  );
});

ProductsOrderDeleteItemCell.displayName = 'ProductsOrderDeleteItemCell';
export { ProductsOrderDeleteItemCell };

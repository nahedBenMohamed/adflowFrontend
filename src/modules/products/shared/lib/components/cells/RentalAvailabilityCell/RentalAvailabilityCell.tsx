import type { Nullable } from '@/shared';
import { Transition } from '@mantine/core';
import { memo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RentalStatus } from '../../../models';

interface RootProps {
  $bgColor: CSSProperties['backgroundColor'];
  $inactive?: boolean;
}

const Root = styled.div<RootProps>`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  padding: 2px 8px 3px;
  background-color: ${p => p.$bgColor};
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${p => p.$inactive && `opacity: 0.65`};
`;

interface Props {
  status: Nullable<RentalStatus>;
  inactive?: boolean;
}

interface StatusProps {
  title: string;
  bgColor: CSSProperties['backgroundColor'];
}

const RentalAvailabilityCell = memo((props: Props) => {
  const { status, inactive } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_rental_products_order_component.ui.rental_availability_cell',
  });

  const statusProps: Record<RentalStatus, StatusProps> = {
    [RentalStatus.RESERVED]: { title: t('reserved'), bgColor: 'var(--button-text-red-default)' },
    [RentalStatus.AVAILABLE]: {
      title: t('available'),
      bgColor: 'var(--primary-statuses-malachite-480)',
    },
    [RentalStatus.RENTED]: { title: t('rent'), bgColor: 'var(--button-text-green-default)' },
  };

  return (
    <Transition mounted={Boolean(status)} transition="scale">
      {transitionStyles =>
        status ? (
          <Root
            style={{ ...transitionStyles }}
            $bgColor={statusProps[status].bgColor}
            $inactive={inactive}
          >
            {statusProps[status].title}
          </Root>
        ) : (
          <span />
        )
      }
    </Transition>
  );
});

RentalAvailabilityCell.displayName = 'RentalAvailabilityCell';
export { RentalAvailabilityCell };

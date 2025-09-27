import type { OrderItem } from '@/modules/products';
import { MyHoverCard, type Currency } from '@/shared';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { AppointmentHistoryServicesTable } from './components';

const Title = styled.div<{ $hoverable: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
`;

const Counter = styled.div`
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 10px;
  font-weight: 500;
  line-height: 12px;
  color: var(--button-text-graphite-secondary-text);

  border-radius: 1em;
  padding: 1px 5px 2px 4px;
  border: 1px solid var(--button-text-graphite-secondary-text);
`;

interface Props {
  currency: Currency;
  orderItems: OrderItem[];
}

const AppointmentsHistoryServicesCell = (props: Props) => {
  const { currency, orderItems } = props;

  const renderTitle = (): ReactNode => (
    <Title $hoverable={orderItems.length > 1}>
      {orderItems[0] ? orderItems[0].productInfo.name : null}

      {orderItems.length > 1 ? <Counter>+{orderItems.length}</Counter> : null}
    </Title>
  );

  if (!orderItems[0]) return null;

  if (orderItems.length === 1) return renderTitle();

  return (
    <MyHoverCard withinPortal target={renderTitle()}>
      <AppointmentHistoryServicesTable orderItems={orderItems} currency={currency} />
    </MyHoverCard>
  );
};

export { AppointmentsHistoryServicesCell };

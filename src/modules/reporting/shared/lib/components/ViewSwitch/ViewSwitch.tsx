import { MySwitch } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Title = styled.span<{ $active: boolean }>`
  font-weight: 400;
  font-size: 14px;
  line-height: 160%;

  color: ${p =>
    p.$active
      ? 'var(--button-text-graphite-primary-text)'
      : 'var(--button-text-graphite-secondary-text)'};
`;

interface Props {
  isActiveAmount: boolean;
  salesChart?: boolean;
  handleChange: (value: boolean) => void;
}

const ViewSwitch = memo((props: Props) => {
  const { isActiveAmount, salesChart, handleChange } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.switch',
  });

  return (
    <Root>
      <Title $active={!isActiveAmount}>{t(salesChart ? 'deals_count' : 'orders_count')}</Title>

      <MySwitch checked={isActiveAmount} variant="mono" onChange={handleChange} />

      <Title $active={isActiveAmount}>{t(salesChart ? 'sales_value' : 'orders_value')}</Title>
    </Root>
  );
});

ViewSwitch.displayName = 'ViewSwitch';
export { ViewSwitch };

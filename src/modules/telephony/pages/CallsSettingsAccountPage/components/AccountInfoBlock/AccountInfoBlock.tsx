import { generalSettingsStore } from '@/app';
import { Currency, currencyFormatterHelper } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 16px;
  border-radius: 6px;
  border: 1px solid var(--graphite-graphite-80);
`;

const Label = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  i {
    font-weight: 400;
    color: var(--button-text-graphite-secondary-text);
  }
`;

const AmountBlock = styled.div`
  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-priory-text);

  padding-bottom: 12px;
`;

interface Props {
  amount: number;
  label: ReactNode;
  Controls: ReactNode;
}

const AccountInfoBlock = (props: Props) => {
  const { amount, label, Controls } = props;

  return (
    <Root>
      <Label>{label}</Label>

      <AmountBlock>
        {currencyFormatterHelper.format({
          value: amount,
          currency: generalSettingsStore.accountSettings?.currency ?? Currency.USD,
        })}
      </AmountBlock>

      {Controls}
    </Root>
  );
};

export { AccountInfoBlock };

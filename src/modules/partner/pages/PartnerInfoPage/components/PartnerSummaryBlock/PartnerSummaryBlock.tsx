/* eslint-disable i18next/no-literal-string */

import { generalSettingsStore } from '@/app';
import { Currency, currencyFormatterHelper } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { PartnerIcon, type PartnerSummary } from '../../../../shared';
import { Block } from '../Block/Block';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  color: var(--button-text-graphite-priory-text);

  padding-bottom: 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const ContentGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
`;

const ContentGroupLabel = styled.span`
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);
`;

const ContentGroupValue = styled.span`
  font-weight: 500;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  summary: PartnerSummary;
}

const PartnerSummaryBlock = observer((props: Props) => {
  const { summary } = props;

  const { name, registrationsCount, payingLeadsCount, totalPartnerBonus, totalPayments } = summary;

  const { accountSettings } = generalSettingsStore;
  const currency = accountSettings?.currency || Currency.USD;

  return (
    <Block>
      <Header>
        <PartnerIcon />

        {name}
      </Header>

      <Content>
        <ContentGroup>
          <ContentGroupLabel>Number of registrations:</ContentGroupLabel>
          <ContentGroupValue>{registrationsCount}</ContentGroupValue>
        </ContentGroup>

        <ContentGroup>
          <ContentGroupLabel>Number of paying customers:</ContentGroupLabel>
          <ContentGroupValue>{payingLeadsCount}</ContentGroupValue>
        </ContentGroup>

        <ContentGroup>
          <ContentGroupLabel>Total payments :</ContentGroupLabel>
          <ContentGroupValue>
            {currencyFormatterHelper.format({ value: totalPayments, currency })}
          </ContentGroupValue>
        </ContentGroup>

        <ContentGroup>
          <ContentGroupLabel>Partner bonus total:</ContentGroupLabel>
          <ContentGroupValue>
            {currencyFormatterHelper.format({ value: totalPartnerBonus, currency })}
          </ContentGroupValue>
        </ContentGroup>
      </Content>
    </Block>
  );
});

PartnerSummaryBlock.displayName = 'PartnerSummaryBlock';
export { PartnerSummaryBlock };

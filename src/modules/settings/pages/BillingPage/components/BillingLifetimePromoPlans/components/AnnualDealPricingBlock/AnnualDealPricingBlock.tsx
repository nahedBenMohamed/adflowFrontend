import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { LifetimeDealPricingPlan } from '../../../../../../shared';
import { PricingBlockWithUsersSelector } from '../PricingBlockWithUsersSelector/PricingBlockWithUsersSelector';

const Root = styled.div`
  width: 100%;

  padding: 20px 24px;
  background: #f4f8f2;
  border-radius: 14px;
  border: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  plans: LifetimeDealPricingPlan[];
  priceKey: keyof LifetimeDealPricingPlan;
  priceMonthlyKey: keyof LifetimeDealPricingPlan;
  savingsKey: keyof LifetimeDealPricingPlan;
}

const AnnualDealPricingBlock = (props: Props) => {
  const { plans, priceKey, priceMonthlyKey, savingsKey } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page.lifetime_promo_plans.annual_deal_pricing_block',
  });

  return (
    <Root>
      <PricingBlockWithUsersSelector
        blackPeriod
        plans={plans}
        priceKey={priceKey}
        savingsKey={savingsKey}
        period={t('annual_subscription')}
        priceMonthlyKey={priceMonthlyKey}
      />
    </Root>
  );
};

export { AnnualDealPricingBlock };

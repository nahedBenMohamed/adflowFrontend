import type { Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { CurrentDiscount, LifetimeDealPricingPlan } from '../../../../../../shared';
import { PricingBlockWithUsersSelector } from '../PricingBlockWithUsersSelector/PricingBlockWithUsersSelector';

const Root = styled.div<{ $fullRounded?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 21px;

  padding: 28px;

  background: #dcf8c9;
  border-bottom-right-radius: 14px;
  border-bottom-left-radius: 14px;

  ${p => p.$fullRounded && `border-radius: 14px`};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Heading = styled.h2`
  font-size: 34px;
  line-height: 43px;
  color: var(--graphite-graphite-840);
  font-family: 'Geologica', sans-serif;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 24px;
  color: var(--graphite-graphite-840);
  font-family: 'Nunito SemiBold', sans-serif;
`;

const SelectorWrapper = styled.div`
  width: 100%;
  padding: 20px 24px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
`;

interface Props {
  name: string;
  description: string;
  plans: LifetimeDealPricingPlan[];
  discount: Nullable<CurrentDiscount>;
  priceKey: keyof LifetimeDealPricingPlan;
  oldPriceKey: keyof LifetimeDealPricingPlan;
}

const LifetimeDealPlanBlock = (props: Props) => {
  const { name, description, discount, plans, priceKey, oldPriceKey } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page.lifetime_promo_plans.lifetime_deal_plan_block',
  });

  return (
    <Root $fullRounded={!discount}>
      <Content>
        <Heading>{name}</Heading>

        <Description>{description}</Description>
      </Content>

      <SelectorWrapper>
        <PricingBlockWithUsersSelector
          isLifetime
          plans={plans}
          discount={discount}
          priceKey={priceKey}
          oldPriceKey={oldPriceKey}
          period={t('lifetime_subscription')}
        />
      </SelectorWrapper>
    </Root>
  );
};

export { LifetimeDealPlanBlock };

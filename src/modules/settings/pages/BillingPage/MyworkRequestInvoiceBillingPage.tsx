import { type Nullable, WholePageLoaderWithLogo } from '@/shared';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetBillingLifetimePromoPrices } from '../../api';
import {
  type LifetimeDealPricingPlan,
  SettingsPageTitle,
  useGetCurrentDiscount,
} from '../../shared';
import { SettingsPageTemplate } from '../../templates';
import { MyworkRequestInvoiceForm } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const MyworkRequestInvoiceBillingPage = () => {
  const [searchParams] = useSearchParams();

  const { data: lifetimePlans } = useGetBillingLifetimePromoPrices();
  const { data: currentDiscount, isLoading: isCurrentDiscountLoading } = useGetCurrentDiscount();

  const [selectedPlan, setSelectedPlan] = useState<Nullable<LifetimeDealPricingPlan>>(null);

  const plan = searchParams.get('plan');
  const users = searchParams.get('users');

  useEffect(() => {
    if (lifetimePlans) {
      const foundPlan = lifetimePlans.find(
        p => p.users === Number(users) && p[plan as keyof LifetimeDealPricingPlan] !== undefined
      );

      if (!foundPlan)
        throw new Error('Failed to get selected plan: invalid plan or users count provided.');

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setSelectedPlan(foundPlan);
    }
  }, [plan, lifetimePlans, users]);

  return (
    <SettingsPageTemplate pageTitleKey="settings.billing">
      {selectedPlan && lifetimePlans && !isCurrentDiscountLoading ? (
        <Root>
          <SettingsPageTitle>{'Покупка лицензии Mywork'}</SettingsPageTitle>

          <Description>
            {`Используйте форму ниже для генерации счета или оплатите подписку через QR-код.`}
          </Description>

          <MyworkRequestInvoiceForm
            plan={selectedPlan}
            plans={lifetimePlans}
            discount={currentDiscount ?? null}
            planKey={plan as keyof LifetimeDealPricingPlan}
          />
        </Root>
      ) : (
        <WholePageLoaderWithLogo ensureHeader />
      )}
    </SettingsPageTemplate>
  );
};

export { MyworkRequestInvoiceBillingPage };

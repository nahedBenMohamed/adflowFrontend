import { routes, subscriptionStore } from '@/app';
import {
  Currency,
  CurrencyFormatterHelper,
  envUtil,
  MyInputNumber,
  NumberModel,
  PrimaryButton,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { type ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 21px;

  width: 100%;
  padding: 20px 24px;

  background: #f4f8f2;
  border-radius: 14px;
  border: 1px solid var(--graphite-graphite-80);

  .workspace__PrimaryButton--Root {
    width: 100%;
    height: auto;

    justify-content: center;

    font-size: 16px;
  }
`;

const Heading = styled.span`
  display: block;

  width: 100%;
  padding-bottom: 10px;

  font-size: 25px;
  line-height: 36px;
  color: var(--graphite-graphite-840);
  font-family: 'Geologica', sans-serif;

  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputLabel = styled.label`
  font-size: 16px;
  line-height: 22px;
  color: var(--graphite-graphite-840);
  font-family: 'Geologica', sans-serif;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 216px;
`;

const Price = styled.span`
  font-size: 36px;
  line-height: 45px;
  color: var(--graphite-graphite-840);
  font-family: 'Geologica', sans-serif;
`;

const MonthlyPrice = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: var(--graphite-graphite-840);
  font-family: 'Nunito', sans-serif;
`;

const PriceDescription = styled.span`
  font-size: 12px;
  line-height: 18px;
  color: var(--button-text-graphite-primary-text);
  font-family: Nunito, sans-serif;
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 154px;
  max-width: 162px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

interface Props {
  price: number;
  icon: ReactNode;
  plan: 'business_month' | 'advanced_month';
}

const MonthlyDealPricingBlock = observer((props: Props) => {
  const { plan, price, icon } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page.lifetime_promo_plans.monthly_deal_pricing_block',
  });

  const [isBuying, setIsBuying] = useState(false);

  const isMywork = envUtil.appName === 'Mywork';
  const defaultUserCount = isMywork ? 5 : 3;

  const usersModel = useLocalObservable(() => NumberModel.create(defaultUserCount));

  const navigate = useNavigate();

  const formatCurrency = useCallback(
    (value: number) => {
      const helper = new CurrencyFormatterHelper(0);

      const currency = isMywork ? Currency.RUB : Currency.USD;

      return helper.format({ value, currency });
    },
    [isMywork]
  );

  const handleBuy = useCallback(async () => {
    if (isMywork) {
      navigate(routes.settingsBillingMyworkRequestInvoice({ plan, users: 10 }));
    } else {
      if (usersModel.valueOrZero < 1) {
        usersModel.setValue(1);
      }

      setIsBuying(true);

      try {
        const subscriptionPlans = await subscriptionStore.getSubscriptionPlans();

        const subscriptionPlan =
          plan === 'business_month'
            ? subscriptionPlans.find(sp => sp.name === 'Starter')
            : subscriptionPlans.find(sp => sp.name === 'Business');

        if (!subscriptionPlan) throw new Error('Unable to find subscription plan');

        const price = subscriptionPlan.prices.find(p => p.interval === 'month');

        if (!price)
          throw new Error(
            'Unable to find monthly subscription price in plan ' + subscriptionPlan.name
          );

        const checkoutUrl = await subscriptionStore.getCheckoutUrl({
          productId: subscriptionPlan.id,
          priceId: price.id,
          numberOfUsers: usersModel.value ?? 1,
        });

        window.location.href = checkoutUrl;
      } catch (e) {
        console.error(`Failed to buy monthly subscription: ${e}`);
      } finally {
        setIsBuying(false);
      }
    }
  }, [isMywork, navigate, plan, usersModel]);

  const amount = isMywork ? price : Math.max(price, price * usersModel.valueOrZero);

  return (
    <Root>
      <Heading>{t('monthly_subscription')}</Heading>

      {!isMywork && (
        <InputWrapper>
          <InputLabel>{t('number_of_users')}</InputLabel>

          <MyInputNumber variant="outlined-tall" model={usersModel} min={1} />
        </InputWrapper>
      )}

      <Content>
        <PriceWrapper>
          <Price>{formatCurrency(amount)}</Price>

          <MonthlyPrice>{`${formatCurrency(price)}${t('per_user')}`}</MonthlyPrice>

          <PriceDescription>{t('minimum_period')}</PriceDescription>
        </PriceWrapper>

        <IconWrapper>{icon}</IconWrapper>
      </Content>

      <PrimaryButton padding="16px" loading={isBuying} onClick={handleBuy}>
        {t('buy')}
      </PrimaryButton>
    </Root>
  );
});

MonthlyDealPricingBlock.displayName = 'MonthlyDealPricingBlock';
export { MonthlyDealPricingBlock };

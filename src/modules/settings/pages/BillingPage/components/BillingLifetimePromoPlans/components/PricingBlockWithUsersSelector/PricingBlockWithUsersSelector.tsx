import { routes, subscriptionStore } from '@/app';
import {
  BillingPath,
  calculateEndOfWordIdxByNumber,
  Currency,
  CurrencyFormatterHelper,
  envUtil,
  MySelect,
  type Nullable,
  type Option,
  PrimaryButton,
  SelectModel,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import type { CurrentDiscount, LifetimeDealPricingPlan } from '../../../../../../shared';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;

  .workspace__PrimaryButton--Root {
    width: 100%;
    height: auto;

    justify-content: center;

    font-size: 16px;
  }
`;

const Period = styled.span<{ $black?: boolean }>`
  width: 100%;

  display: block;

  font-size: 25px;
  line-height: 36px;
  font-family: 'Geologica', sans-serif;
  color: var(--button-text-green-active);

  padding-bottom: 10px;
  border-bottom: 1px solid var(--graphite-graphite-80);

  ${p =>
    p.$black &&
    css`
      color: var(--graphite-graphite-840);
    `}
`;

const SelectLabel = styled.label`
  font-size: 16px;
  line-height: 22px;
  color: var(--graphite-graphite-840);
  font-family: 'Geologica', sans-serif;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Price = styled.span<{ $smaller?: boolean }>`
  font-size: 36px;
  line-height: 45px;
  color: var(--graphite-graphite-840);
  font-family: 'Geologica', sans-serif;

  ${p =>
    p.$smaller &&
    css`
      font-size: 34px;
      line-height: 43px;
    `}
`;

const PriceDescription = styled.span`
  font-size: 12px;
  line-height: 18px;
  color: var(--button-text-graphite-primary-text);
  font-family: Nunito, sans-serif;
`;

const MonthlyPrice = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: var(--graphite-graphite-840);
  font-family: Nunito, sans-serif;
`;

const OldPrice = styled.span`
  font-size: 18px;
  line-height: 25px;
  color: var(--button-text-graphite-primary-text);
  text-decoration: line-through;
`;

const SavingsWrapper = styled.div`
  max-width: 162px;

  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;

  padding: 6px 14px;

  background: var(--primary-statuses-yellow-400);
  border-radius: 8px;
`;

const Delimiter = styled.hr`
  height: 1px;
  width: 100%;

  flex-shrink: 0;

  background: var(--graphite-graphite-840);
`;

const Savings = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: var(--graphite-graphite-840);
  text-align: center;
  font-family: 'Nunito SemiBold', sans-serif;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

interface Props {
  period: string;
  plans: LifetimeDealPricingPlan[];
  isLifetime?: boolean;
  discount?: Nullable<CurrentDiscount>;
  priceKey: keyof LifetimeDealPricingPlan;
  savingsKey?: keyof LifetimeDealPricingPlan;
  oldPriceKey?: keyof LifetimeDealPricingPlan;
  priceMonthlyKey?: keyof LifetimeDealPricingPlan;
  blackPeriod?: boolean;
}

const PricingBlockWithUsersSelector = observer((props: Props) => {
  const {
    period,
    plans,
    priceKey,
    isLifetime,
    priceMonthlyKey,
    savingsKey,
    oldPriceKey,
    blackPeriod,
    discount,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page.lifetime_promo_plans.pricing_block_with_users_selector',
  });

  const [isBuying, setIsBuying] = useState(false);

  const navigate = useNavigate();

  const usersPlanModel = useLocalObservable(() => SelectModel.create(plans[0]));

  const availablePlans = useMemo<LifetimeDealPricingPlan[]>(
    () => plans.filter(p => typeof p[priceKey] === 'number'),
    [plans, priceKey]
  );

  const defaultUserCount = envUtil.appRUSegment ? 5 : 3;

  const finalAmount = discount
    ? usersPlanModel.value[priceKey] * (1 - discount.percent / 100)
    : usersPlanModel.value[priceKey];

  const availablePlansOptions = useMemo<Option[]>(
    () =>
      availablePlans.map(p => {
        const idx = calculateEndOfWordIdxByNumber(p.users);

        return {
          value: p,
          label: `${p.users} ${t(`users.${idx}`)}`,
        };
      }),
    [availablePlans, t]
  );

  useEffect(() => {
    if (availablePlans) {
      const idx = availablePlans.findIndex(p => p.users === defaultUserCount);

      if (idx !== -1) {
        usersPlanModel.setValue(availablePlans[idx]);
      } else {
        usersPlanModel.setValue(availablePlans[0]);
      }
    }
  }, [availablePlans, usersPlanModel, defaultUserCount]);

  const handleBuy = useCallback(async () => {
    if (envUtil.billingPath === BillingPath.INVOICE) {
      navigate(
        routes.settingsBillingMyworkRequestInvoice({
          plan: priceKey,
          users: usersPlanModel.value.users,
        })
      );
    } else {
      setIsBuying(true);

      try {
        const subscriptionPlans = await subscriptionStore.getSubscriptionPlans();

        const subscriptionPlan = priceKey.includes('business')
          ? subscriptionPlans.find(sp => sp.code === 'starter')
          : subscriptionPlans.find(sp => sp.code === 'business');

        if (!subscriptionPlan) throw new Error('Unable to find subscription plan');

        let checkoutUrl: string;

        if (priceKey.includes('year')) {
          const price = subscriptionPlan.prices.find(p => p.interval === 'year');

          if (!price)
            throw new Error(
              'Unable to find monthly subscription price in plan ' + subscriptionPlan.name
            );

          checkoutUrl = await subscriptionStore.getCheckoutUrl({
            productId: subscriptionPlan.id,
            priceId: price.id,
            numberOfUsers: usersPlanModel.value.users,
          });
        } else {
          checkoutUrl = await subscriptionStore.getCheckoutUrl({
            productId: subscriptionPlan.id,
            amount: usersPlanModel.value[priceKey],
            couponId: discount?.code ?? undefined,
            numberOfUsers: usersPlanModel.value.users,
          });
        }

        window.location.href = checkoutUrl;
      } catch (e) {
        console.error(`Failed to buy monthly subscription: ${e}`);
      } finally {
        setIsBuying(false);
      }
    }
  }, [navigate, priceKey, usersPlanModel.value, discount?.code]);

  const productNameForBank = useMemo<string>(() => {
    const period = priceKey.includes('ltd')
      ? 'Бессрочная подписка Mywork'
      : 'Подписка Mywork на 1 год';

    const plan = priceKey.includes('advanced') ? 'тариф «Продвинутый»' : 'тариф «Бизнес»';

    const usersText = usersPlanModel.value?.users <= 3 ? 'пользователя' : 'пользователей';

    return `${period}, ${plan} на ${usersPlanModel.value?.users} ${usersText}`;
  }, [usersPlanModel.value?.users, priceKey]);

  const formatCurrency = useCallback((value: number) => {
    const helper = new CurrencyFormatterHelper(0);

    const currency = envUtil.appRUSegment ? Currency.RUB : Currency.USD;

    return helper.format({ value, currency });
  }, []);

  const hasMonthlyPrice = Boolean(
    priceMonthlyKey && usersPlanModel.value?.[priceMonthlyKey] !== undefined
  );
  const hasOldPrice = Boolean(
    oldPriceKey &&
      usersPlanModel.value?.[oldPriceKey] !== undefined &&
      usersPlanModel.value?.[oldPriceKey] !== null &&
      discount
  );
  const hasSavings = Boolean(savingsKey && usersPlanModel.value?.[savingsKey] !== undefined);

  if (!usersPlanModel.value) return null;

  return (
    <Root>
      <Period $black={blackPeriod}>{period}</Period>

      <SelectWrapper>
        <SelectLabel>{t('packages')}</SelectLabel>

        <MySelect
          variant="outlined-tall"
          searchBar={false}
          model={usersPlanModel}
          options={availablePlansOptions}
          labelPostfix={isLifetime ? t('lifetime_postfix') : undefined}
        />
      </SelectWrapper>

      <PriceWrapper>
        <PriceContent>
          {hasOldPrice && (
            <OldPrice>{formatCurrency(usersPlanModel.value[oldPriceKey!] ?? 0)}</OldPrice>
          )}

          <Price $smaller={hasMonthlyPrice}>{formatCurrency(finalAmount ?? 0)}</Price>

          {hasMonthlyPrice && (
            <>
              <MonthlyPrice>
                {`${formatCurrency(
                  // @ts-expect-error: checks in hasMonthlyPrice
                  usersPlanModel.value[priceMonthlyKey]
                )}${t('per_user')}`}
              </MonthlyPrice>

              <PriceDescription>{t('price_description')}</PriceDescription>
            </>
          )}
        </PriceContent>

        <SavingsWrapper>
          <Savings>{t('fix_price')}</Savings>

          <Delimiter />

          <Savings>
            {!hasSavings
              ? t('big_savings')
              : `${t('savings')}${formatCurrency(
                  // @ts-expect-error: checks in hasSavings
                  usersPlanModel.value[savingsKey]
                )}`}
          </Savings>
        </SavingsWrapper>
      </PriceWrapper>

      <ButtonsWrapper>
        <PrimaryButton padding="16px" onClick={handleBuy} loading={isBuying}>
          {t('buy')}
        </PrimaryButton>

        {envUtil.billingShowCreditButton && (
          <>
            {/* T-Bank credit button */}
            <Helmet>
              <script src="https://forma.tinkoff.ru/static/onlineScript.js" />
            </Helmet>

            {createElement('tinkoff-create-button', {
              size: 'M',
              shopId: '2e253176-5d95-489b-890a-823b81e41e14',
              showcaseId: 'e30dfa40-4dd9-49dd-9d83-c1c9929814c8',
              'ui-data': 'productType=installment&useReturnLinks=true&view=newTab',
              'payment-data': `sum=${finalAmount}&items.0.name=${productNameForBank}&items.0.quantity=1&items.0.price=${finalAmount}`,
            })}
          </>
        )}
      </ButtonsWrapper>
    </Root>
  );
});

PricingBlockWithUsersSelector.displayName = 'PricingBlockWithUsersSelector';
export { PricingBlockWithUsersSelector };

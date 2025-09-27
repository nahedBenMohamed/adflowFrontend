import { envUtil } from '@/shared';
import { useTranslation } from 'react-i18next';
import { useGetBillingLifetimePromoPrices } from '../../../../api';
import { KeyIcon, PriceLabelIcon, useGetCurrentDiscount } from '../../../../shared';
import {
  AnnualDealPricingBlock,
  BlackText,
  HeaderCallout,
  Highlight,
  LifetimeDealPlanBlock,
  LifetimeDealPricingBlockSkeleton,
  MonthlyDealPricingBlock,
  PlansGrid,
  PriceRiseCounter,
  PricingBlockSkeleton,
  PromoHeader,
  Root,
} from './components';

const BillingLifetimePromoPlans = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page.lifetime_promo_plans',
  });

  const { data: plans, isLoading: arePlansLoading } = useGetBillingLifetimePromoPrices();
  const { data: currentDiscount, isLoading: isCurrentDiscountLoading } = useGetCurrentDiscount();

  const isAppRuSegment = envUtil.appRUSegment;
  const businessMonthlyPrice = isAppRuSegment ? 499 : 6;
  const advancedMonthlyPrice = isAppRuSegment ? 999 : 11;

  return (
    <Root>
      {currentDiscount && (
        <PromoHeader>
          <HeaderCallout>
            <Highlight>{t('discount', { percent: currentDiscount.percent })}</Highlight>

            {` ${t('lifetime_subscription')} `}

            <BlackText>{t('black_text')}</BlackText>

            <Highlight>
              &nbsp;
              {`${t('until')} ${currentDiscount.endAt.displayLongWithoutYear()}`}
            </Highlight>
          </HeaderCallout>

          <PriceRiseCounter endDate={currentDiscount.endAt} />
        </PromoHeader>
      )}

      <PlansGrid>
        {arePlansLoading || isCurrentDiscountLoading ? (
          <>
            <LifetimeDealPricingBlockSkeleton $fullRounded={!currentDiscount} />
            <LifetimeDealPricingBlockSkeleton $fullRounded={!currentDiscount} />

            <PricingBlockSkeleton />
            <PricingBlockSkeleton />

            <PricingBlockSkeleton />
            <PricingBlockSkeleton />
          </>
        ) : (
          plans && (
            <>
              <LifetimeDealPlanBlock
                plans={plans}
                name={t('business_plan')}
                discount={currentDiscount ?? null}
                priceKey="ltd_business_old_price"
                oldPriceKey="ltd_business_old_price"
                description={t('business_plan_description')}
              />
              <LifetimeDealPlanBlock
                plans={plans}
                name={t('advanced_plan')}
                discount={currentDiscount ?? null}
                priceKey="ltd_advanced_old_price"
                oldPriceKey="ltd_advanced_old_price"
                description={t('advanced_plan_description')}
              />

              <AnnualDealPricingBlock
                plans={plans}
                priceKey="business_year"
                priceMonthlyKey="business_month"
                savingsKey="business_savings"
              />
              <AnnualDealPricingBlock
                plans={plans}
                priceKey="advanced_year"
                priceMonthlyKey="advanced_month"
                savingsKey="advanced_savings"
              />

              <MonthlyDealPricingBlock
                plan="business_month"
                price={businessMonthlyPrice}
                icon={<PriceLabelIcon />}
              />
              <MonthlyDealPricingBlock
                plan="advanced_month"
                price={advancedMonthlyPrice}
                icon={<KeyIcon />}
              />
            </>
          )
        )}
      </PlansGrid>
    </Root>
  );
};

export { BillingLifetimePromoPlans };

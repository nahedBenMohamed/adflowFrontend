import { appStore, routes, subscriptionStore } from '@/app';
import { BillingPath, envUtil, type Nullable, PrimaryButton, UrlUtil } from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SettingsPageTemplate } from '../../templates';
import { BillingLifetimePromoPlans, PaymentResultModal } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ManageSubscriptionAnnotation = styled.h4`
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const StripeBillingPage = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page',
  });

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (envUtil.billingPath !== BillingPath.STRIPE) navigate(routes.settingsBillingCommon());
  }, [navigate]);

  const { subscription, isGettingPortalUrl } = subscriptionStore;

  const [paymentResult, setPaymentResult] = useState<Nullable<string>>(null);

  const openPortal = async (): Promise<void> => {
    const checkoutUrl = await subscriptionStore.getPortalUrl();

    if (checkoutUrl) window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        // check to see whether this is a redirect back from checkout
        const query = new URLSearchParams(window.location.search);

        let paymentSuccess = false;

        if (query.get('success')) {
          paymentSuccess = true;

          setPaymentResult(t('payment_success'));
        }

        if (!paymentSuccess && subscription && !subscription.isTrial) openPortal();
      }
    );
  }, [subscription, t]);

  const closeModal = () => {
    setPaymentResult(null);

    UrlUtil.clearURLQueryParams();
  };

  return (
    <SettingsPageTemplate pageTitleKey="settings.billing">
      <Root>
        {subscription?.isTrial ? (
          <BillingLifetimePromoPlans />
        ) : (
          <>
            <ManageSubscriptionAnnotation>
              {t('manage_your_subscription')}
            </ManageSubscriptionAnnotation>
            <PrimaryButton
              loading={isGettingPortalUrl}
              disabled={isGettingPortalUrl}
              onClick={openPortal}
            >
              {t('open_stripe_portal')}
            </PrimaryButton>
          </>
        )}
      </Root>

      {paymentResult && (
        <PaymentResultModal
          text={paymentResult}
          isOpened={Boolean(paymentResult)}
          onClose={closeModal}
        />
      )}
    </SettingsPageTemplate>
  );
});

export { StripeBillingPage };

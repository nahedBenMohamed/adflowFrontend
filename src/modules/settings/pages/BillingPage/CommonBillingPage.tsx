import { routes, subscriptionStore } from '@/app';
import { BillingPath, envUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSumoTierData } from '../../shared';
import { SettingsPageTemplate } from '../../templates';
import { BillingLifetimePromoPlans, CurrentSubscriptionBlock } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const CommonBillingPage = observer(() => {
  const navigate = useNavigate();

  const { subscription, isSubscriptionLoaded } = subscriptionStore;

  const appSumoTierData = useAppSumoTierData(subscription?.planName);

  // Loading state in handled in the SettingsPageTemplate
  if (!isSubscriptionLoaded) return null;

  // Normally there is a subscription, but in some cases it can be inexistant due to manual database mutations or
  // partner providers mistakes / edge cases, case when billing path is not stripe is handled in
  // CurrentSubscriptionBlock
  if (!subscription && envUtil.billingPath === BillingPath.STRIPE) {
    navigate(routes.settingsBillingStripe());

    return null;
  }

  return (
    <SettingsPageTemplate pageTitleKey="settings.billing">
      <Root>
        <CurrentSubscriptionBlock subscription={subscription} appSumoTierData={appSumoTierData} />

        {!appSumoTierData && <BillingLifetimePromoPlans />}
      </Root>
    </SettingsPageTemplate>
  );
});

CommonBillingPage.displayName = 'CommonBillingPage';
export { CommonBillingPage };

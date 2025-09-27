import { type Nullable, type Subscription, UtcDate } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  type AppSumoTierData,
  RequestSetupFormButton,
  SettingsPageTitle,
} from '../../../../shared';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const CaptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Caption = styled.div<{ $gray?: boolean }>`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${p =>
    p.$gray
      ? 'var(--button-text-graphite-primary-text)'
      : 'var(--button-text-graphite-priory-text)'};
`;

const FeaturesList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding-left: 16px;
`;

const Feature = styled.li`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  subscription: Nullable<Subscription>;
  appSumoTierData: Nullable<AppSumoTierData>;
}

const CurrentSubscriptionBlock = (props: Props) => {
  const { subscription, appSumoTierData } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page',
  });

  const daysLeft = subscription
    ? subscription.expiredAt
      ? Math.ceil(subscription.expiredAt.diffDays(UtcDate.now()))
      : 0
    : 0;

  const isTrialOver = subscription
    ? subscription.isTrial && (!subscription.isValid || daysLeft <= 0)
    : false;

  const isSubscriptionOver = subscription ? !subscription.isValid || daysLeft <= 0 : true;

  const getSubscriptionPlanName = (): string => {
    if (!subscription) return t('subscription_over');

    // if appSumo tier data is available, we want to display it, Mywork accounts can not be created from AppSumo
    if (appSumoTierData) return subscription.planName;

    if (isTrialOver) return t('trial_over');

    if (isSubscriptionOver) return t('subscription_over');

    if (subscription.isTrial) return t('trial_in_progress');

    return subscription.planName;
  };

  if (!subscription) return null;

  return (
    <>
      <SettingsPageTitle>{getSubscriptionPlanName()}</SettingsPageTitle>

      <Content>
        {appSumoTierData ? (
          <FeaturesList>
            {appSumoTierData.features.map((f, idx) => (
              <Feature key={`${f}-${idx}`}>{f}</Feature>
            ))}
          </FeaturesList>
        ) : (
          <>
            {subscription.createdAt && (
              <CaptionWrapper>
                <Caption $gray>{t('started_in')}</Caption>

                <Caption>{subscription.createdAt.displayShort()}</Caption>
              </CaptionWrapper>
            )}

            {subscription.expiredAt && (
              <CaptionWrapper>
                <Caption $gray>{t('expires_in')}</Caption>
                <Caption>{subscription.expiredAt.displayShort()}</Caption>
              </CaptionWrapper>
            )}

            {/* No specific need to hide users limit when trial is over but it is done not to confuse users, because as of the moment of writing trial account can have up to 50 users and this value will be displayed here even if the trial is already ended */}
            {subscription.userLimit && !isTrialOver && (
              <CaptionWrapper>
                <Caption $gray>{t('users_limit')}</Caption>
                <Caption>{subscription.userLimit}</Caption>
              </CaptionWrapper>
            )}
          </>
        )}

        <RequestSetupFormButton titleKey="request_billing_help" />
      </Content>
    </>
  );
};

export { CurrentSubscriptionBlock };

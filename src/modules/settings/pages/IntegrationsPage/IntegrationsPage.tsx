import { authStore } from '@/modules/auth';
import { PBX_GROUP_ID, RequestSetupFormButton } from '@/modules/settings';
import { envUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SettingsPageTemplate } from '../../templates';
import {
  AlbatoItem,
  ApixDriveItem,
  FbMessengerItem,
  GoogleCalendarItem,
  IntegrationsGroup,
  MakeItem,
  OneCItem,
  ProvidersSipRegistrationItemsList,
  RequestIntegrationItem,
  SalesforceItem,
  TelephonyIntegrationGuide,
  TildaItem,
  TwilioWhatsAppItem,
  WazzupItem,
  WordpressItem,
} from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 0 16px 16px;
`;

const TitleWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: var(--button-text-graphite-priory-text);
`;

const IntegrationsPage = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page',
  });

  const { user: currentUser } = authStore;

  const showMessengersGroup = useMemo<boolean>(
    () =>
      envUtil.integrationsShowTwilio ||
      envUtil.integrationsShowFbMessenger ||
      envUtil.integrationsShowWazzup,
    []
  );

  const showAutomationsGroup = useMemo<boolean>(
    () =>
      envUtil.integrationsShowMake ||
      envUtil.integrationsShowApixDrive ||
      envUtil.integrationsShowAlbato,
    []
  );

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  return (
    <SettingsPageTemplate pageTitleKey="settings.integrations">
      <Root>
        <TitleWrapper>
          <Title>{t('integrations')}</Title>

          <RequestSetupFormButton titleKey="request_setup" />
        </TitleWrapper>

        {/* Non-admin integrations */}
        <IntegrationsGroup label={t('calendars_and_tasks')}>
          <GoogleCalendarItem />
        </IntegrationsGroup>

        {/* Admin integrations */}
        {currentUser && currentUser.isAdmin() && (
          <>
            {showAutomationsGroup && (
              <IntegrationsGroup label={t('process_automation')}>
                {envUtil.integrationsShowMake && <MakeItem />}
                {envUtil.integrationsShowApixDrive && <ApixDriveItem />}
                {envUtil.integrationsShowAlbato && <AlbatoItem />}
                <RequestIntegrationItem />
              </IntegrationsGroup>
            )}

            {showMessengersGroup && (
              <IntegrationsGroup label={t('messenger')}>
                {envUtil.integrationsShowTwilio && <TwilioWhatsAppItem />}
                {envUtil.integrationsShowFbMessenger && <FbMessengerItem />}
                {envUtil.integrationsShowWazzup && <WazzupItem />}
                <RequestIntegrationItem />
              </IntegrationsGroup>
            )}

            {envUtil.integrationsShowPbx && (
              <IntegrationsGroup
                id={PBX_GROUP_ID}
                label={t('telephony_and_pbx')}
                Controls={<TelephonyIntegrationGuide />}
              >
                <ProvidersSipRegistrationItemsList />
                <RequestIntegrationItem />
              </IntegrationsGroup>
            )}

            <IntegrationsGroup label={t('site_forms')}>
              <TildaItem />
              <WordpressItem />
              <RequestIntegrationItem />
            </IntegrationsGroup>

            {envUtil.integrationsShowSalesforce && (
              <IntegrationsGroup label={t('crm')}>
                <SalesforceItem />
                <RequestIntegrationItem />
              </IntegrationsGroup>
            )}

            {envUtil.integrationsShow1C && (
              <IntegrationsGroup label="1С">
                <OneCItem />
              </IntegrationsGroup>
            )}
          </>
        )}
      </Root>
    </SettingsPageTemplate>
  );
});

IntegrationsPage.displayName = 'IntegrationsPage';
export { IntegrationsPage };

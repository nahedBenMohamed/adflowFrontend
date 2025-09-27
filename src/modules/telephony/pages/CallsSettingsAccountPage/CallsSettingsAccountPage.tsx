import {
  RequestSetupFormButton,
  SettingsPageTemplate,
  SettingsPageTitle,
  TelephonyIntegrationGuide,
} from '@/modules/settings';
import { PrimaryButton, envUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { voximplantConnectorStore } from '../../store';
import { VoximplantBalance, VoximplantNumbersBlock, VoximplantSubscriptionFee } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ApproveInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ApproveInfo = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const StyledLink = styled(Link)`
  display: inline;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

interface ContentProps {
  $fullHeight?: boolean;
  $contentCentered?: boolean;
}

const Content = styled.div<ContentProps>`
  height: ${p => p.$fullHeight && `calc(100dvh - var(--header-height) - 16px * 2)`};

  display: flex;
  flex-direction: column;
  gap: 24px;

  ${p =>
    p.$contentCentered &&
    css`
      align-items: center;
      justify-content: center;
    `}

  padding: 16px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

const AccountInfosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const ConnectTelephonyBlock = styled.div`
  max-width: 480px;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 32px;

  padding-bottom: 20%;
`;

const ConnectTelephonyTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);
`;

const ConnectTelephonyWarning = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);

  padding: 12px 16px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
`;

const ConnectTelephonyWarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const CallsSettingsAccountPage = observer(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page',
  });

  const { account, isCreatingAccount, getBillingManagementLink, createVoximplantAccount } =
    voximplantConnectorStore;

  const billingManagementLink = getBillingManagementLink();

  return (
    <SettingsPageTemplate
      Controls={<RequestSetupFormButton titleKey="request_telephony" />}
      pageTitleKey="settings.calls.account"
    >
      <Root>
        {account ? (
          <>
            <TitleWrapper>
              <SettingsPageTitle>{t('account')}</SettingsPageTitle>

              <ApproveInfoBlock>
                <p>
                  <ApproveInfo>{t('not_approved_annotation')}</ApproveInfo>{' '}
                  {billingManagementLink && (
                    <StyledLink
                      target="_blank"
                      rel="noopener noreferrer"
                      to={billingManagementLink}
                    >
                      {t('approve')}
                    </StyledLink>
                  )}
                </p>
              </ApproveInfoBlock>
            </TitleWrapper>

            <Content>
              <AccountInfosGrid>
                <VoximplantBalance rechargeLink={billingManagementLink} />
                <VoximplantSubscriptionFee />
              </AccountInfosGrid>
            </Content>

            <VoximplantNumbersBlock />
          </>
        ) : (
          <Content $fullHeight $contentCentered>
            <ConnectTelephonyBlock>
              <ConnectTelephonyTitle>
                {t('connect_telephony_title', { company: envUtil.appName })}
              </ConnectTelephonyTitle>

              <PrimaryButton
                loading={isCreatingAccount}
                disabled={isCreatingAccount}
                onClick={createVoximplantAccount}
              >
                {t('connect')}
              </PrimaryButton>

              <ConnectTelephonyWarningWrapper>
                <ConnectTelephonyWarning>
                  {t('connect_telephony_warning', { company: envUtil.appName })}
                </ConnectTelephonyWarning>

                <TelephonyIntegrationGuide buttonVariant="link" />
              </ConnectTelephonyWarningWrapper>
            </ConnectTelephonyBlock>
          </Content>
        )}
      </Root>
    </SettingsPageTemplate>
  );
});

CallsSettingsAccountPage.displayName = 'CallsSettingsAccountPage';
export { CallsSettingsAccountPage };

import { appStore, iconStore, routes, subscriptionStore } from '@/app';
import { authStore } from '@/modules/auth';
import { BuilderTabs } from '@/modules/builder';
import { voximplantConnectorStore } from '@/modules/telephony';
import {
  BillingPath,
  DefaultHeader,
  type DefaultHeaderModuleIconProps,
  envUtil,
  IconName,
  LeftNavTemplate,
  MediaBreakpoints,
  type Nullable,
  TutorialProductType,
  useTitle,
  WholePageLoaderWithLogo,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  SettingsSidebar,
  type SettingsSidebarGroupIcon,
  SettingsSidebarItem,
  SettingsSidebarItemGroup,
} from '../../shared';

const Root = styled.div`
  display: flex;
`;

const Content = styled.div<{ $noMarginTop: boolean }>`
  max-width: 1440px;
  width: calc(100% - var(--settings-sidebar-width) - 16px);

  margin-top: ${p => (p.$noMarginTop ? 0 : '16px')};
  margin-left: calc(var(--settings-sidebar-width) + 16px);

  @media ${MediaBreakpoints.SM} {
    margin-left: 16px;
  }
`;

interface Props {
  children: ReactNode;
  pageTitleKey?: string;
  Controls?: ReactNode;
  noMarginTop?: boolean;
  hideControlsDelimiter?: boolean;
}

const SettingsPageTemplate = observer((props: Props) => {
  const { children, pageTitleKey, Controls, noMarginTop = false, hideControlsDelimiter } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.settings_page_template',
  });

  useTitle({ titleTranslationKey: pageTitleKey });

  const { pathname } = useLocation();

  const isAdmin = authStore.isAdmin();
  const isSuperadmin = authStore.user?.isPlatformAdmin;
  const { subscription } = subscriptionStore;

  const [billingPageRoute, setBillingPageRoute] = useState<Nullable<string>>(null);

  useLayoutEffect(() => {
    if (subscription)
      setBillingPageRoute(
        // stripe is not available in RU segment
        subscription.isExternal || subscription.isTrial
          ? envUtil.billingPath === BillingPath.INVOICE
            ? routes.settingsBillingCommon()
            : routes.settingsBillingStripe()
          : routes.settingsBillingCommon()
      );
  }, [subscription]);

  const { account } = voximplantConnectorStore;

  const callsSettingsGroupItems = useMemo<SettingsSidebarGroupIcon[]>(() => {
    const defaultGroupsItems: SettingsSidebarGroupIcon[] = [
      {
        name: t('account'),
        to: routes.settingsCallsAccount(),
      },
      {
        name: t('sip_registrations'),
        to: routes.settingsCallsSipRegistrations({}),
      },
    ];

    if (account)
      defaultGroupsItems.push(
        {
          name: t('users'),
          to: routes.settingsCallsUsers(),
        },
        {
          name: t('configuring_scenarios'),
          to: routes.settingsCallsScenarios(),
        }
      );

    return defaultGroupsItems;
  }, [account, t]);

  const moduleIconProps = useMemo<DefaultHeaderModuleIconProps>(
    () => ({
      icon: iconStore.getByName(IconName.SETTINGS_2).icon,
      color: iconStore.systemModuleColor,
    }),
    []
  );

  const showIntegrations = useMemo<boolean>(
    () =>
      envUtil.integrationsShow1C ||
      envUtil.integrationsShowSalesforce ||
      envUtil.integrationsShowWazzup ||
      envUtil.integrationsShowFbMessenger ||
      envUtil.integrationsShowTwilio ||
      envUtil.integrationsShowPbx,
    []
  );

  if (!appStore.isLoaded || !subscription) {
    return (
      <LeftNavTemplate
        rootWidth="100%"
        contentMarginLeft={0}
        Header={
          <DefaultHeader
            Controls={Controls}
            moduleName={t('title')}
            moduleIconProps={moduleIconProps}
            hideControlsDelimiter={hideControlsDelimiter}
          />
        }
      >
        <WholePageLoaderWithLogo ensureHeaderWithOffset />
      </LeftNavTemplate>
    );
  }

  return (
    <LeftNavTemplate
      rootWidth="100%"
      contentMarginLeft={0}
      Header={
        <DefaultHeader
          Controls={Controls}
          moduleName={t('title')}
          moduleIconProps={moduleIconProps}
          productType={TutorialProductType.SETTINGS}
          hideControlsDelimiter={hideControlsDelimiter}
        />
      }
    >
      <Root>
        <SettingsSidebar>
          {isAdmin && (
            <>
              <SettingsSidebarItem to={routes.settingsGeneral()}>
                {t('general')}
              </SettingsSidebarItem>

              <SettingsSidebarItem to={routes.builder(BuilderTabs.WORKSPACE)}>
                {t('modules_settings')}
              </SettingsSidebarItem>

              {billingPageRoute && (
                <SettingsSidebarItem
                  active={pathname.includes(routes.settingsBillingMyworkRequestInvoiceBase())}
                  contrast
                  to={billingPageRoute}
                >
                  {t('billing')}
                </SettingsSidebarItem>
              )}

              <SettingsSidebarItemGroup
                groupName={t('users')}
                groupItems={[
                  {
                    name: t('configure_users'),
                    to: routes.settingsUsers(),
                    active:
                      pathname === routes.settingsUsersAdd() ||
                      pathname.includes('settings/users/list'),
                  },
                  {
                    name: t('groups'),
                    to: routes.settingsDepartments(),
                  },
                ]}
              />
            </>
          )}

          <SettingsSidebarItem to={routes.settingsMailing()}>{t('email')}</SettingsSidebarItem>

          {showIntegrations && (
            <SettingsSidebarItem to={routes.settingsIntegrations()}>
              {t('integrations')}
            </SettingsSidebarItem>
          )}

          {isAdmin && (
            <>
              {envUtil.voximplantShowTelephony && (
                <SettingsSidebarItemGroup
                  groupName={t('calls')}
                  groupItems={callsSettingsGroupItems}
                />
              )}

              <SettingsSidebarItem to={routes.settingsApiKeys()}>
                {t('api_access')}
              </SettingsSidebarItem>

              <SettingsSidebarItemGroup
                groupName={t('documents')}
                groupItems={[
                  {
                    name: t('document_templates'),
                    to: routes.settingsDocumentTemplates(),
                  },
                  {
                    name: t('document_creation_fields'),
                    to: routes.settingsDocumentCreationFields(),
                  },
                ]}
              />

              {isSuperadmin && (
                <SettingsSidebarItem to={routes.settingsSuperadmin()}>
                  {t('superadmin')}
                </SettingsSidebarItem>
              )}
            </>
          )}
        </SettingsSidebar>

        <Content $noMarginTop={noMarginTop}>{children}</Content>
      </Root>
    </LeftNavTemplate>
  );
});

SettingsPageTemplate.displayName = 'SettingsPageTemplate';
export { SettingsPageTemplate };

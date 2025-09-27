import { generalSettingsStore, userStore } from '@/app';
import { MySwitchWithModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RequestSetupFormButton } from '../../shared';
import { departmentsSettingsStore } from '../../store';
import { SettingsPageTemplate } from '../../templates';
import {
  GeneralSettingsPageFormGroup,
  GeneralSettingsPageMainBlock,
  GeneralSettingsPageTopBlock,
  SettingsBlock,
} from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GeneralSettingsPage = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.general_settings_page',
  });

  // this is not necessary, just to make sure that global
  // users and departments cache is up-to-date
  useEffect(() => {
    setTimeout(() => {
      userStore.invalidateUsersCache();
      departmentsSettingsStore.invalidateDepartmentsCache();
    });
  }, []);

  const { generalSettingsForm, isLoaded, updateAccountSettings } = generalSettingsStore;

  return (
    <SettingsPageTemplate
      Controls={<RequestSetupFormButton titleKey="request_setup" />}
      pageTitleKey="settings.general_settings"
    >
      {isLoaded && (
        <Root>
          <GeneralSettingsPageTopBlock />

          <GeneralSettingsPageMainBlock />

          <SettingsBlock>
            <GeneralSettingsPageFormGroup
              text={t('contact_duplicates')}
              gridTemplateColumns="1fr auto"
              hint={t('contact_duplicates_hint')}
            >
              <MySwitchWithModel
                inverted
                label={t('enable')}
                model={generalSettingsForm.allowDuplicates}
                onChange={updateAccountSettings}
              />
            </GeneralSettingsPageFormGroup>
          </SettingsBlock>
        </Root>
      )}
    </SettingsPageTemplate>
  );
});

GeneralSettingsPage.displayName = 'GeneralSettingsPage';
export { GeneralSettingsPage };

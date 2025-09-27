import { appStore } from '@/app';
import { SettingsPageTemplate, SettingsPageTitle } from '@/modules/settings';
import { DefaultLoader } from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { VoximplantScenariosStore } from '../../store';
import {
  ConfiguringScenariosHeaderControls,
  IncomingCallsBlock,
  OutgoingCallsBlock,
} from './components';

const Root = styled.div`
  min-width: fit-content;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-bottom: 16px;
`;

const LoaderWrapper = styled.div`
  margin-top: 240px;
`;

const CallsConfiguringScenariosPage = observer(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_configuring_scenarios_page',
  });

  const voximplantScenariosStore = useMemo(
    () => new VoximplantScenariosStore(t('failed_to_reach')),
    [t]
  );

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => voximplantScenariosStore.loadData()
    );
  }, [voximplantScenariosStore]);

  const { isLoaded } = voximplantScenariosStore;

  return (
    <SettingsPageTemplate
      hideControlsDelimiter
      pageTitleKey="settings.calls.scenarios"
      Controls={
        <ConfiguringScenariosHeaderControls voximplantScenariosStore={voximplantScenariosStore} />
      }
    >
      <Root>
        {appStore.isLoaded && isLoaded ? (
          <>
            <SettingsPageTitle>{t('title')}</SettingsPageTitle>

            <IncomingCallsBlock voximplantScenariosStore={voximplantScenariosStore} />
            <OutgoingCallsBlock voximplantScenariosStore={voximplantScenariosStore} />
          </>
        ) : (
          <LoaderWrapper>
            <DefaultLoader />
          </LoaderWrapper>
        )}
      </Root>
    </SettingsPageTemplate>
  );
});

CallsConfiguringScenariosPage.displayName = 'CallsConfiguringScenariosPage';
export { CallsConfiguringScenariosPage };

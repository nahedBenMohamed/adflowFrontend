import { appStore } from '@/app';
import { WholePageLoaderWithLogo, useTitle } from '@/shared';
import { Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { BuilderTabs } from '../../shared';
import { BuilderPageTemplate } from '../../templates';
import { BuilderJourneyPicker, WorkspaceEditor } from './components';

const BuilderHomePage = observer(() => {
  useTitle({ titleTranslationKey: 'builder.builder' });

  return (
    <BuilderPageTemplate>
      {appStore.isLoaded ? (
        <>
          <Tabs.Panel value={BuilderTabs.JOURNEY}>
            <BuilderJourneyPicker />
          </Tabs.Panel>

          <Tabs.Panel value={BuilderTabs.WORKSPACE}>
            <WorkspaceEditor />
          </Tabs.Panel>
        </>
      ) : (
        <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="16px" />
      )}
    </BuilderPageTemplate>
  );
});

export { BuilderHomePage };

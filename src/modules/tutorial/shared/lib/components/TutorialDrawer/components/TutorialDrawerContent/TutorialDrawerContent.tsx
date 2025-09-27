import { SettingsStore } from '@/app';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import {
  TUTORIAL_GROUPS_SETTINGS_KEY,
  type TutorialGroup,
  type TutorialGroupsSettings,
} from '../../../../models';
import { TutorialGroupBlock } from './components';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 24px 16px;
`;

interface Props {
  tutorialGroups: TutorialGroup[];
  lastOpenedDate?: string;
}

const { settings } = SettingsStore.getSettingsStore<TutorialGroupsSettings>(
  TUTORIAL_GROUPS_SETTINGS_KEY
);

if (!settings.groups) settings.groups = [];

const TutorialDrawerContent = observer((props: Props) => {
  const { tutorialGroups, lastOpenedDate } = props;

  return (
    <Root>
      {tutorialGroups.map((g, idx) => (
        <TutorialGroupBlock
          key={g.id}
          tutorialGroup={g}
          settings={settings}
          isFirstGroup={idx === 0}
          lastOpenedDate={lastOpenedDate}
        />
      ))}
    </Root>
  );
});

export { TutorialDrawerContent };

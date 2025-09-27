import { SpanWithEllipsis, TruncateMixin, type Optional } from '@/shared';
import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { CaretDownIcon } from '../../../../../../../assets';
import type {
  TutorialGroup,
  TutorialGroupSettings,
  TutorialGroupsSettings,
} from '../../../../../../models';
import { TutorialItemBlock } from '../TutorialItemBlock/TutorialItemBlock';

const Root = styled.li`
  width: 100%;

  display: flex;
  flex-direction: column;

  ${TruncateMixin}
`;

const Title = styled.button`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  &:hover {
    cursor: pointer;
  }

  ${TruncateMixin}
`;

const CaretIconWrapper = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: rotate(${p => (p.$active ? 180 : 0)}deg);
  transition: var(--transition-200);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding-top: 16px;
`;

interface Props {
  isFirstGroup: boolean;
  tutorialGroup: TutorialGroup;
  settings: TutorialGroupsSettings;
  lastOpenedDate?: string;
}

const TutorialGroupBlock = observer((props: Props) => {
  const {
    isFirstGroup,
    tutorialGroup: { id, name, items },
    lastOpenedDate,
    settings,
  } = props;

  const groupSettings = useMemo<Optional<TutorialGroupSettings>>(
    () => settings.groups.find(g => g.groupId === id),
    [id, settings]
  );

  const [opened, { toggle }] = useDisclosure(groupSettings ? groupSettings.opened : isFirstGroup);

  const handleToggle = useCallback(() => {
    toggle();

    const groupSettings = settings.groups.find(g => g.groupId === id);

    if (groupSettings) {
      settings.groups = settings.groups.map<TutorialGroupSettings>(g =>
        g.groupId === id ? { ...groupSettings, opened: !opened } : g
      );
    } else {
      settings.groups = [
        ...settings.groups,
        {
          groupId: id,
          opened: !opened,
        },
      ];
    }
  }, [settings, id, opened, toggle]);

  return items.length > 0 ? (
    <Root>
      <Title type="button" onClick={handleToggle}>
        <CaretIconWrapper $active={opened}>
          <CaretDownIcon />
        </CaretIconWrapper>

        <SpanWithEllipsis text={name} />
      </Title>

      <Collapse in={opened}>
        <Content>
          {items.map(i => (
            <TutorialItemBlock key={i.id} tutorialItem={i} lastOpenedDate={lastOpenedDate} />
          ))}
        </Content>
      </Collapse>
    </Root>
  ) : null;
});

TutorialGroupBlock.displayName = 'TutorialGroupBlock';
export { TutorialGroupBlock };

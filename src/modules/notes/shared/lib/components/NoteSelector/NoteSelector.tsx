import { useWindowEvent } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { noteStore } from '../../../../store';
import { NoteGroup } from './components';

const Root = styled.div<{ $hidden?: boolean }>`
  width: 332px;
  min-width: 332px;
  min-height: 100%;
  max-height: calc(100dvh - var(--header-height));

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
  border-right: 1px solid var(--graphite-graphite-80);
  overflow-y: auto;
  transition: var(--transition-200);

  ${p =>
    p.$hidden &&
    css`
      width: 0;
      min-width: 0;

      overflow: hidden;
      padding: 0;
      border: none;
    `}
`;

interface Props {
  isModal?: boolean;
  selectorHidden?: boolean;
}

const NoteSelector = observer((props: Props) => {
  const { isModal, selectorHidden } = props;

  const { groupedNotes: notes } = noteStore;

  const { t } = useTranslation('module.notes', {
    keyPrefix: 'notes.selector',
  });

  const location = useLocation();

  const handleCreate = () => {
    if (isModal) {
      noteStore.createNote(t('new_note_heading'), {
        location: location.pathname,
        title: document.title,
      });
    } else {
      noteStore.createNote(t('new_note_heading'));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // 'т' -> N on cyrillic layout
      switch (e.key) {
        case 'n':
        case 'N':
        case 'т':
        case 'Т': {
          e.preventDefault();
          handleCreate();

          break;
        }

        default:
          break;
      }
    }
  };

  useWindowEvent('keydown', handleKeyDown);

  return (
    <Root $hidden={selectorHidden}>
      <NoteGroup isModal={isModal} notes={notes.pinned} title={t('pinned')} />
      <NoteGroup isModal={isModal} notes={notes.today} title={t('today')} />
      <NoteGroup isModal={isModal} notes={notes.yesterday} title={t('yesterday')} />
      <NoteGroup isModal={isModal} notes={notes.earlier} title={t('earlier')} />
    </Root>
  );
});

NoteSelector.displayName = 'NoteSelector';
export { NoteSelector };

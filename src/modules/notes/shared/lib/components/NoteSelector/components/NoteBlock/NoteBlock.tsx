import { LinkedEntityTag, TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { noteStore } from '../../../../../../store';
import { MoreIcon, PinFilledIcon, PinIcon } from '../../../../../assets';
import { formatNoteDate, getNoteHeading, shortenQuickNoteTitle } from '../../../../helpers';
import type { Note } from '../../../../models';
import { NotesActionDropdown } from '../../../NotesActionDropdown/NotesActionDropdown';

const NoteActionButton = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--border-radius-element);
  opacity: 0;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--graphite-graphite-40);
  }

  &:active {
    background: var(--graphite-graphite-80);
  }
`;

const Root = styled.div<{ $active?: boolean }>`
  outline: none;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 12px 16px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  border: 1px solid var(--primary-statuses-white-0);
  box-shadow:
    0 1px 2px 0 #d0daeb,
    0 0 2px 0 #eef4fe;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    ${NoteActionButton} {
      opacity: 1;
    }
  }

  ${p =>
    p.$active &&
    css`
      background: var(--background-fuchsia-20);
      border: 1px solid var(--primary-statuses-fuchsia-400);
    `}
`;

const TextContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;

  overflow: hidden;
`;

const HeadingWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 4px;
`;

const Heading = styled.p`
  max-width: 100%;

  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const FirstLine = styled.p`
  max-width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const UpdatedAt = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
  color: var(--button-text-graphite-primary-text);

  white-space: nowrap;
`;

interface Props {
  note: Note;
  isActive?: boolean;
  isModal?: boolean;
}

const NoteBlock = observer((props: Props) => {
  const { note, isActive, isModal } = props;

  const { t } = useTranslation('module.notes', {
    keyPrefix: 'notes',
  });

  const handlePin = useCallback(() => {
    noteStore.togglePin(note.id);
  }, [note.id]);

  const handleSelectNote = useCallback(() => {
    noteStore.selectNote(note.id);
  }, [note.id]);

  const textContent = getNoteHeading(note.content, t('block.unnamed_note'));

  return (
    <Root $active={isActive} tabIndex={0} onClick={handleSelectNote}>
      <TextContentWrapper>
        <HeadingWrapper>
          <Heading>{textContent.heading}</Heading>

          <IconsWrapper>
            <NotesActionDropdown note={note}>
              <NoteActionButton type="button">
                <MoreIcon />
              </NoteActionButton>
            </NotesActionDropdown>

            <NoteActionButton type="button" onClick={handlePin}>
              {note.isPinned ? <PinFilledIcon /> : <PinIcon />}
            </NoteActionButton>
          </IconsWrapper>
        </HeadingWrapper>

        <FirstLine>{textContent.firstLine}</FirstLine>
      </TextContentWrapper>

      <Info>
        {note.quickNote && !isModal && (
          <LinkedEntityTag to={note.quickNote.location}>
            {shortenQuickNoteTitle(note.quickNote.title)}
          </LinkedEntityTag>
        )}

        <UpdatedAt>
          {formatNoteDate({ date: note.updatedAt, justNow: t('editor.recently_edited') })}
        </UpdatedAt>
      </Info>
    </Root>
  );
});

NoteBlock.displayName = 'NoteBlock';
export { NoteBlock };

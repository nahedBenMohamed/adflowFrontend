import { LinkedEntityTag, MenuIcon } from '@/shared';
import { memo, useCallback, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { noteStore } from '../../../../../../store';
import { CloseIcon, RemoveQuickPropertyIcon } from '../../../../../assets';
import { formatNoteDate, shortenQuickNoteTitle } from '../../../../helpers';
import type { Note } from '../../../../models';

const Root = styled.div<{ $modal?: boolean }>`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  align-self: stretch;

  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef6;

  ${p => p.$modal && `cursor: move`};
`;

const GroupWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;

  padding: 4px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--graphite-graphite-40);
  }

  &:active {
    background: var(--graphite-graphite-80);
  }
`;

const StyledMenuIcon = styled(MenuIcon)`
  width: 20px;
  height: 20px;

  flex-shrink: 0;
`;

const RemoveQuickPropertyButton = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 2px 0 0 2px;

  svg path,
  svg g path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg {
      path {
        fill: var(--button-text-red-active);
      }

      g path {
        stroke: var(--primary-statuses-white-0);
      }
    }
  }
`;

const UpdatedAt = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

interface Props {
  note: Note;
  isModal?: boolean;
  handleRemoveQuickProperty: () => void;
  toggleSelector?: () => void;
}

const TopNoteInfo = memo((props: Props) => {
  const { note, isModal, handleRemoveQuickProperty, toggleSelector } = props;

  const { t } = useTranslation('module.notes', {
    keyPrefix: 'notes.editor',
  });

  const handleRemoveQuickPropertyClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.preventDefault();
      e.stopPropagation();

      handleRemoveQuickProperty();

      return false;
    },
    [handleRemoveQuickProperty]
  );

  return (
    <Root className="workspace__TopNoteInfo--Root" $modal={isModal}>
      <GroupWrapper>
        <MenuButton type="button" onClick={toggleSelector}>
          <StyledMenuIcon />
        </MenuButton>

        {note.quickNote && (
          <LinkedEntityTag to={note.quickNote.location} $maxWidth="200px">
            {shortenQuickNoteTitle(note.quickNote.title)}

            <RemoveQuickPropertyButton type="button" onClick={handleRemoveQuickPropertyClick}>
              <RemoveQuickPropertyIcon />
            </RemoveQuickPropertyButton>
          </LinkedEntityTag>
        )}
      </GroupWrapper>

      <GroupWrapper>
        <UpdatedAt>
          {formatNoteDate({
            date: note.updatedAt,
            justNow: t('recently_edited'),
            prefix: t('last_changed'),
          })}
        </UpdatedAt>

        {isModal && (
          <CloseButton type="button" onClick={noteStore.toggleModal}>
            <CloseIcon />
          </CloseButton>
        )}
      </GroupWrapper>
    </Root>
  );
});

TopNoteInfo.displayName = 'TopNoteInfo';
export { TopNoteInfo };

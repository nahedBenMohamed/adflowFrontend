import { MyDropdown } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { noteStore } from '../../../../store';
import { DeleteIcon, DuplicateIcon, InsertIcon } from '../../../assets';
import type { Note } from '../../models';

const StyledMyDropdown = styled(MyDropdown)`
  .workspace__MyDropdown--StyledDropdown {
    display: flex;
    flex-direction: column;

    padding: 8px;
  }
`;

const ActionName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const ActionButton = styled.button<{ $dangerous?: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 12px 8px 8px;
  transition: var(--transition-200);
  border-radius: var(--border-radius-element);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background: #f4f8f2;

    ${ActionName} {
      color: var(--button-text-green-active);
    }

    svg path {
      stroke: var(--button-text-green-active);
    }
  }

  &:active {
    background: #e9f1e4;

    ${ActionName} {
      color: var(--button-text-green-hover);
    }

    svg path {
      stroke: var(--button-text-green-hover);
    }
  }

  ${p =>
    p.$dangerous &&
    css`
      ${ActionName} {
        color: var(--primary-statuses-red-360);
      }

      &:hover {
        background: var(--background-red-20);

        ${ActionName} {
          color: var(--primary-statuses-red-360);
        }

        svg path {
          stroke: none;
          fill: var(--primary-statuses-red-360);
        }
      }

      &:active {
        background: var(--neutral-red-100);

        ${ActionName} {
          color: var(--primary-statuses-red-360);
        }

        svg path {
          stroke: none;
          fill: var(--primary-statuses-red-360);
        }
      }
    `}
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
`;

interface Props {
  children: ReactNode;
  note: Note;
}

const NotesActionDropdown = (props: Props) => {
  const { children, note } = props;

  const { t } = useTranslation('module.notes', {
    keyPrefix: 'notes.editor',
  });

  const [isDropdownOpened, { open, close }] = useDisclosure(false);

  const handleDuplicate = useCallback(() => {
    close();

    noteStore.duplicateNote(note.id);
  }, [note.id, close]);

  const handleDelete = useCallback(() => {
    close();

    noteStore.deleteNote(note.id);
  }, [note.id, close]);

  const handleRestore = useCallback(() => {
    close();

    noteStore.restoreNote(note.id);
  }, [note.id, close]);

  return (
    <StyledMyDropdown
      withinPortal
      Button={children}
      opened={isDropdownOpened}
      show={open}
      hide={close}
    >
      {!note.isDeleted && (
        <ActionButton type="button" onClick={handleDuplicate}>
          <IconWrapper>
            <DuplicateIcon />
          </IconWrapper>

          <ActionName>{t('duplicate')}</ActionName>
        </ActionButton>
      )}

      {note.isDeleted && (
        <ActionButton type="button" onClick={handleRestore}>
          <IconWrapper>
            <InsertIcon />
          </IconWrapper>

          <ActionName>{t('put_into_folder')}</ActionName>
        </ActionButton>
      )}

      <ActionButton $dangerous type="button" onClick={handleDelete}>
        <IconWrapper>
          <DeleteIcon />
        </IconWrapper>

        <ActionName>{t('delete')}</ActionName>
      </ActionButton>
    </StyledMyDropdown>
  );
};

export { NotesActionDropdown };

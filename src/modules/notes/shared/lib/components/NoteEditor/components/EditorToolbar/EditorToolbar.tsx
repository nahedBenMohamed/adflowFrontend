import { routes } from '@/app';
import type { Nullable } from '@/shared';
import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { noteStore } from '../../../../../../store';
import {
  BoldIcon,
  BulletListIcon,
  ExpandIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  MinimizeIcon,
  MoreIcon,
  OrderedListIcon,
  RedoIcon,
  StrikethroughIcon,
  TextIcon,
  UnderlinedIcon,
  UndoIcon,
} from '../../../../../assets';
import type { Note } from '../../../../models';
import type { FormattingType } from '../../../../types';
import { NotesActionDropdown } from '../../../NotesActionDropdown/NotesActionDropdown';

const Root = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
`;

const ToolsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const ToolGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

interface ToolButtonProps {
  $danger?: boolean;
  $active?: boolean;
}

const ToolButton = styled.button<ToolButtonProps>`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

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

  ${p =>
    p.$danger &&
    css`
      &:hover {
        svg path {
          fill: var(--primary-statuses-red-360);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      background: var(--primary-statuses-green-520);

      svg path {
        fill: var(--primary-statuses-white-0);
      }

      &:hover {
        cursor: pointer;

        background: var(--primary-statuses-green-520);
      }

      &:active {
        background: var(--primary-statuses-green-520);
      }
    `}
`;

const Divider = styled.hr`
  height: 20px;
  width: 1px;

  background: var(--graphite-graphite-120);
`;

interface Props {
  note: Note;
  editor: Nullable<Editor>;
  isModal?: boolean;
}

const EditorToolbar = (props: Props) => {
  const { note, editor, isModal } = props;

  const { t } = useTranslation('module.notes', {
    keyPrefix: 'notes.toolbar',
  });

  const navigate = useNavigate();

  const quickNoteLocation = note.quickNote?.location;

  const handleMinimize = useCallback(() => {
    if (!quickNoteLocation)
      throw new Error(
        `Failed to handleMinimize, unable to get quickNote location for note ${note.id}`
      );

    navigate(quickNoteLocation);

    noteStore.toggleModal();
  }, [navigate, note.id, quickNoteLocation]);

  const setFormat = useCallback(
    (type: FormattingType): void => {
      if (!editor) return;

      switch (type) {
        case 'bold': {
          editor.chain().focus().toggleBold().run();

          break;
        }

        case 'italic': {
          editor.chain().focus().toggleItalic().run();

          break;
        }

        case 'underline': {
          editor.chain().focus().toggleUnderline().run();

          break;
        }

        case 'strike': {
          editor.chain().focus().toggleStrike().run();

          break;
        }

        case 'text': {
          editor.chain().focus().setParagraph().run();

          break;
        }

        case 'heading': {
          editor.chain().focus().toggleHeading({ level: 1 }).run();

          break;
        }

        case 'subheading': {
          editor.chain().focus().toggleHeading({ level: 2 }).run();

          break;
        }

        case 'heading-3': {
          editor.chain().focus().toggleHeading({ level: 3 }).run();

          break;
        }

        case 'bulletList': {
          editor.chain().focus().toggleBulletList().run();

          break;
        }

        case 'orderedList': {
          editor.chain().focus().toggleOrderedList().run();

          break;
        }
      }
    },
    [editor]
  );

  const getFormatHandler = useCallback(
    (type: FormattingType) => () => setFormat(type),
    [setFormat]
  );

  if (!editor) return <Root />;

  return (
    <Root>
      <ToolsGroup>
        <ToolGroup>
          <ToolButton type="button" title={t('undo')} onClick={editor.commands.undo}>
            <UndoIcon />
          </ToolButton>

          <ToolButton type="button" title={t('redo')} onClick={editor.commands.redo}>
            <RedoIcon />
          </ToolButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolButton
            type="button"
            title={t('bold')}
            $active={editor.isActive('bold')}
            onClick={getFormatHandler('bold')}
          >
            <BoldIcon />
          </ToolButton>

          <ToolButton
            type="button"
            title={t('italic')}
            $active={editor.isActive('italic')}
            onClick={getFormatHandler('italic')}
          >
            <ItalicIcon />
          </ToolButton>

          <ToolButton
            type="button"
            title={t('underline')}
            $active={editor.isActive('underline')}
            onClick={getFormatHandler('underline')}
          >
            <UnderlinedIcon />
          </ToolButton>

          <ToolButton
            type="button"
            title={t('strike')}
            $active={editor.isActive('strike')}
            onClick={getFormatHandler('strike')}
          >
            <StrikethroughIcon />
          </ToolButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolButton
            type="button"
            title={t('bullet_list')}
            $active={editor.isActive('bulletList')}
            onClick={getFormatHandler('bulletList')}
          >
            <BulletListIcon />
          </ToolButton>

          <ToolButton
            type="button"
            title={t('ordered_list')}
            $active={editor.isActive('orderedList')}
            onClick={getFormatHandler('orderedList')}
          >
            <OrderedListIcon />
          </ToolButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolButton type="button" title={t('text')} onClick={getFormatHandler('text')}>
            <TextIcon />
          </ToolButton>

          <ToolButton type="button" title={t('heading')} onClick={getFormatHandler('heading')}>
            <H1Icon />
          </ToolButton>

          <ToolButton
            type="button"
            title={t('subheading')}
            onClick={getFormatHandler('subheading')}
          >
            <H2Icon />
          </ToolButton>

          <ToolButton type="button" title={t('heading_3')} onClick={getFormatHandler('heading-3')}>
            <H3Icon />
          </ToolButton>
        </ToolGroup>
      </ToolsGroup>

      <ToolsGroup>
        <ToolGroup>
          <NotesActionDropdown note={note}>
            <ToolButton type="button" title={t('more')}>
              <MoreIcon />
            </ToolButton>
          </NotesActionDropdown>

          {isModal ? (
            <ToolButton as={Link} to={routes.notes} title={t('expand')}>
              <ExpandIcon />
            </ToolButton>
          ) : (
            quickNoteLocation && (
              <ToolButton onClick={handleMinimize} title={t('minimize')}>
                <MinimizeIcon />
              </ToolButton>
            )
          )}
        </ToolGroup>
      </ToolsGroup>
    </Root>
  );
};

export { EditorToolbar };

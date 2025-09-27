import { debounce, UtcDate } from '@/shared';
import { useWindowEvent } from '@mantine/hooks';
import TipTapLink from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { startNote, type Note } from '../../../../shared';
import { noteStore } from '../../../../store';
import { EditorToolbar, TopNoteInfo } from './components';

const TOOLBAR_HEIGHT = '133px';

const Root = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100dvh - var(--header-height));

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
`;

const EditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;

  border-radius: var(--border-radius-block);
  box-shadow:
    0 1px 2px 0 #d0daeb,
    0 0 2px 0 #eef4fe;
  overflow-y: auto;
`;

const StyledEditorContent = styled(EditorContent)<{ $modal?: boolean }>`
  width: 100%;

  & > div {
    min-height: calc(100dvh - var(--header-height) - ${TOOLBAR_HEIGHT});
    max-width: 100%;

    // To make text at most 760px wide
    padding: 24px max(24px, calc((100% - 760px) / 2));
    background: var(--primary-statuses-white-0);
    outline: none;
  }

  p {
    font-size: 18px;
  }

  em {
    font-style: italic;
  }

  strong {
    font-weight: 800;
  }

  ul li {
    list-style-type: disc;
    margin-left: 24px;
  }

  ol li {
    list-style-type: decimal;
    margin-left: 24px;
  }

  h1 {
    font-size: 40px;
    line-height: 52px;
    margin-top: 18px;
  }

  h2 {
    font-size: 32px;
    line-height: 40px;
    margin-top: 12px;
  }

  h3 {
    font-size: 26px;
    line-height: 32px;
    margin-top: 8px;
  }

  a {
    cursor: pointer;
  }

  ${p =>
    p.$modal &&
    css`
      & > div {
        min-height: 400px;
      }
    `}
`;

interface Props {
  isModal?: boolean;
  toggleSelector?: () => void;
}

const NoteEditor = observer((props: Props) => {
  const { isModal, toggleSelector } = props;

  const { notes, selectedNote } = noteStore;

  const [note, setNote] = useState<Note>(startNote);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchedNote = noteStore.getCurrentlySelectedNote();

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setNote(fetchedNote);
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setContent(fetchedNote.content);
  }, [notes, selectedNote]);

  const handleSaveNote = () => {
    const newContent = editor?.getHTML() ?? '';

    if (newContent === content) return;

    const updatedNote = { ...note, content: newContent, updatedAt: UtcDate.now() };
    noteStore.updateNote(updatedNote);
  };

  const debouncedHandleSaveNote = debounce(handleSaveNote, 1000);

  const editor = useEditor(
    {
      extensions: [TipTapLink, Underline, StarterKit],
      onUpdate: ({ editor }) => {
        if (editor) debouncedHandleSaveNote();
      },
      content: content,
    },
    [note]
  );

  const handleRemoveQuickProperty = useCallback(() => {
    noteStore.removeQuickProperty(note);

    const fetchedNote = noteStore.getCurrentlySelectedNote();
    setNote(fetchedNote);
  }, [note]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
        case 'S':
        case 'ы':
        case 'Ы': {
          e.preventDefault();
          handleSaveNote();

          break;
        }

        default:
          break;
      }
    }
  };

  useWindowEvent('keydown', handleKeyDown);

  return (
    <Root>
      <TopNoteInfo
        note={note}
        isModal={isModal}
        toggleSelector={toggleSelector}
        handleRemoveQuickProperty={handleRemoveQuickProperty}
      />

      <EditorToolbar editor={editor} isModal={isModal} note={note} />

      <EditorWrapper>
        <StyledEditorContent $modal={isModal} editor={editor} />
      </EditorWrapper>
    </Root>
  );
});

NoteEditor.displayName = 'NoteEditor';
export { NoteEditor };

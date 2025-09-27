import { appStore } from '@/app';
import { getDefaultModalBounds } from '@/modules/multichat';
import { DraggableResizableControl, type DraggableResizableControlBounds } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NoteSelector } from '../../../../shared';
import { noteStore } from '../../../../store';
import { NoteEditor } from '../NoteEditor/NoteEditor';

const Root = styled.div`
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;

  pointer-events: none;
  z-index: var(--modal-z-index);
`;

const Content = styled.div`
  width: 100%;

  display: flex;
`;

const NotesModal = observer(() => {
  const [opened, setOpened] = useState(false);

  const { modalOpened } = noteStore;

  const [modalBounds, setModalBounds] = useState<DraggableResizableControlBounds>(() =>
    getDefaultModalBounds()
  );

  const [selectorHidden, { toggle: toggleSelector }] = useDisclosure(false);

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        noteStore.loadData();
      }
    );
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setOpened(noteStore.modalState);
  }, [modalOpened]);

  if (!opened) return null;

  const isNarrowModal = Number(modalBounds.size.width) < 750;

  return (
    <Root>
      <DraggableResizableControl
        modalBounds={modalBounds}
        dragHandleClassName="workspace__TopNoteInfo--Root"
        setModalBounds={setModalBounds}
      >
        <Content>
          <NoteSelector isModal selectorHidden={selectorHidden || isNarrowModal} />
          <NoteEditor isModal toggleSelector={toggleSelector} />
        </Content>
      </DraggableResizableControl>
    </Root>
  );
});

export { NotesModal };

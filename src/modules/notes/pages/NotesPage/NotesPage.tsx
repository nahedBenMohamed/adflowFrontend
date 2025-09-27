import { appStore } from '@/app';
import { LeftNavTemplate, useTitle } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { useEffect } from 'react';
import styled from 'styled-components';
import { NoteEditor, NoteFolderSelector, NoteSelector, NotesPageHeader } from '../../shared';
import { noteStore } from '../../store';

const Root = styled.div`
  width: 100%;
  height: calc(100dvh - var(--header-height));

  display: flex;
`;

const NotesPage = () => {
  const { loadData, ensureCloseModal } = noteStore;

  useTitle({ titleTranslationKey: 'notes' });

  const [selectorHidden, { toggle: toggleSelector }] = useDisclosure(false);

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        loadData();
        ensureCloseModal();
      }
    );
  }, [ensureCloseModal, loadData]);

  return (
    <LeftNavTemplate Header={<NotesPageHeader />}>
      <Root>
        <NoteFolderSelector selectorHidden={selectorHidden} />
        <NoteSelector selectorHidden={selectorHidden} />
        <NoteEditor toggleSelector={toggleSelector} />
      </Root>
    </LeftNavTemplate>
  );
};

export { NotesPage };

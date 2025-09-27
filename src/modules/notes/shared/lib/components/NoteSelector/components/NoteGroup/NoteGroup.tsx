import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { noteStore } from '../../../../../../store';
import type { Note } from '../../../../models';
import { NoteBlock } from '../NoteBlock/NoteBlock';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const NoteGroupTitle = styled.p`
  min-width: 0;

  color: var(--button-text-graphite-primary-text);
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

const NotesList = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  notes: Note[];
  title: string;
  isModal?: boolean;
}

const NoteGroup = observer((props: Props) => {
  const { notes, title, isModal } = props;

  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    listRef.current && autoAnimate(listRef.current);
  }, [notes.length]);

  const isActive = useCallback(
    (id: number): boolean => noteStore.currentlySelectedNoteId === id,
    []
  );

  if (notes.length === 0) return null;

  return (
    <Root>
      <NoteGroupTitle>{title}</NoteGroupTitle>

      <NotesList ref={listRef}>
        {notes.map(n => (
          <NoteBlock key={n.id} isModal={isModal} note={n} isActive={isActive(n.id)} />
        ))}
      </NotesList>
    </Root>
  );
});

NoteGroup.displayName = 'NoteGroup';
export { NoteGroup };

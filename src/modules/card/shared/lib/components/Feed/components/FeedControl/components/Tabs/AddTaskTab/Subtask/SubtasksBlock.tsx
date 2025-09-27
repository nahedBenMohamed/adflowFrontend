import type { Subtask } from '@/modules/tasks';
import { AddSquareIcon, MathUtil } from '@/shared';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SubtasksList } from './SubtasksList';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

const AddButton = styled.button`
  position: relative;

  width: fit-content;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-hover);

    svg rect {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    color: var(--button-text-green-active);

    svg rect {
      fill: var(--button-text-green-active);
    }
  }

  &:disabled {
    pointer-events: none;

    color: var(--button-text-graphite-secondary-text);
  }
`;

interface Props {
  subtasks: Subtask[];
  inDrawer?: boolean;
  preventFocusOnMount?: boolean;
}

const SubtasksBlock = observer((props: Props) => {
  const { subtasks, inDrawer, preventFocusOnMount = false } = props;

  const { t } = useTranslation();

  const [preventFocus, setPreventFocus] = useState(preventFocusOnMount);

  const handleAdd = useCallback(() => {
    if (preventFocus) setPreventFocus(false);

    const emptySubtask = subtasks.find(s => s.text.trim().length === 0);

    if (emptySubtask) return;

    const id = MathUtil.minOrZero(subtasks.map<number>(s => s.id)) - 1;
    const maxSortOrder = MathUtil.maxOrZero(subtasks.map<number>(s => s.sortOrder)) + 1;

    subtasks.splice(subtasks.length, 0, {
      id,
      text: '',
      resolved: false,
      sortOrder: maxSortOrder,
    });
  }, [preventFocus, subtasks]);

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination || destination.index === source.index) return;

      const [moved] = subtasks.splice(source.index, 1);

      if (!moved) {
        console.error('Failed to end drag in SubtasksBlock, nothing was moved');

        return;
      }

      subtasks.splice(destination.index, 0, moved);

      subtasks.forEach((s, idx) => (s.sortOrder = idx));
    },
    [subtasks]
  );

  return (
    <Root>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="workspace__SubtasksBlock--List">
          {provided => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              <SubtasksList
                inDrawer={inDrawer}
                subtasks={subtasks}
                preventFocus={preventFocus}
                droppableProvided={provided}
                handleAdd={handleAdd}
              />
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <AddButton onClick={handleAdd}>
        <AddSquareIcon />

        {t('buttons.add')}
      </AddButton>
    </Root>
  );
});

SubtasksBlock.displayName = 'SubtasksBlock';
export { SubtasksBlock };

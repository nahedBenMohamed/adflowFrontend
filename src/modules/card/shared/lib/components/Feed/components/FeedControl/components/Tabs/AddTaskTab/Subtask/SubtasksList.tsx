import type { Subtask } from '@/modules/tasks';
import { HEADER_HEIGHT, SUBHEADER_HEIGHT } from '@/shared';
import { Draggable, type DraggingStyle, type DroppableProvided } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import { SubtaskItem } from './SubtaskItem';

const ListItem = styled.li<{ $dragging: boolean }>`
  // to prevent issues when drag occurs in a container with fixed position (MyDrawer)
  // https://github.com/atlassian/react-beautiful-dnd/issues/1881#issuecomment-1464944428
  left: auto !important;

  width: 100%;

  margin-bottom: 10px;
  transition: opacity var(--transition-200);

  ${p => p.$dragging && `opacity: 0.5`};
`;

interface Props {
  subtasks: Subtask[];
  preventFocus: boolean;
  droppableProvided: DroppableProvided;
  inDrawer?: boolean;
  handleAdd: () => void;
}

const SubtasksList = observer((props: Props) => {
  const { subtasks, preventFocus, droppableProvided, inDrawer, handleAdd } = props;

  const getDeleteHandler = useCallback(
    (subtaskId: number) => () => {
      const idx = subtasks.findIndex(s => s.id === subtaskId);

      if (idx === -1)
        throw new Error(
          `Subtask with id ${subtaskId} was not found in subtasks list, failed to delete`
        );

      subtasks.splice(idx, 1);
    },
    [subtasks]
  );

  return (
    <>
      {subtasks
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s, idx) => (
          <Draggable key={s.id} index={idx} draggableId={String(s.id)}>
            {(provided, { isDragging }) => {
              // drawer has a fixed position, we need to adjust the top of the draggable
              if (inDrawer) {
                // https://github.com/atlassian/react-beautiful-dnd/issues/1881#issuecomment-691237307
                const draggingStyle = provided.draggableProps.style as DraggingStyle;

                if (isDragging && draggingStyle)
                  (provided.draggableProps.style as DraggingStyle).top =
                    draggingStyle.top - HEADER_HEIGHT - SUBHEADER_HEIGHT;
              }

              return (
                <ListItem
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  $dragging={isDragging}
                >
                  <SubtaskItem
                    key={s.id}
                    subtask={s}
                    dragHandleProps={provided.dragHandleProps}
                    autoFocus={idx === subtasks.length - 1 && !preventFocus}
                    onEnter={handleAdd}
                    onDelete={getDeleteHandler(s.id)}
                  />
                </ListItem>
              );
            }}
          </Draggable>
        ))}

      {droppableProvided.placeholder}
    </>
  );
});

SubtasksList.displayName = 'SubtasksList';
export { SubtasksList };

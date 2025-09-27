import { Draggable } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import type { MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';
import { type BaseTask } from '../../shared';

const Root = styled.div<{ $dragging: boolean }>`
  position: relative;

  width: 255px;

  margin-bottom: 8px;

  &:nth-last-child(2) {
    margin-bottom: 0;
  }

  ${p => p.$dragging && `margin-bottom: 0`};
`;

const TaskCard = styled.div<{ $dragging: boolean }>`
  position: relative;

  min-height: 46px;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 10px;

  font-size: 14px;

  padding: 10px;
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  ${p => p.$dragging && `opacity: 0.4`};
`;

interface Props {
  baseTask: BaseTask;
  children: ReactNode;
  idx: number;
  canEdit: boolean;
  dragDisabledTitle: string;
  handleMouseUp?: MouseEventHandler<HTMLDivElement>;
  handleMouseDown?: MouseEventHandler<HTMLDivElement>;
}

const ItemTemplate = observer((props: Props) => {
  const { baseTask, children, idx, canEdit, dragDisabledTitle, handleMouseUp, handleMouseDown } =
    props;

  return (
    <Draggable
      key={baseTask.id}
      index={idx}
      isDragDisabled={!canEdit}
      draggableId={String(baseTask.id)}
    >
      {(dragProvided, dragSnapshot) => (
        <Root
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          $dragging={dragSnapshot.isDragging}
          title={canEdit ? undefined : dragDisabledTitle}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
          <TaskCard $dragging={dragSnapshot.isDragging} draggable={canEdit}>
            {children}
          </TaskCard>
        </Root>
      )}
    </Draggable>
  );
});

ItemTemplate.displayName = 'ItemTemplate';
export { ItemTemplate };

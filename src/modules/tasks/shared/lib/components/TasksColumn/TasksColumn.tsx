import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  ColumnCount,
  ColumnCountGhost,
  MediaBreakpoints,
  NoSelectMixin,
  PencilButton,
  PermissionObjectType,
  Scrollbar,
  SpanWithEllipsis,
  StageCode,
  TruncateMixin,
  type Nullable,
} from '@/shared';
import { Droppable } from '@hello-pangea/dnd';
import { Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, type MouseEventHandler } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { useIntersectionObserver } from 'usehooks-ts';
import type { CreateTaskDto } from '../../../../api';
import type { TasksGroupStore } from '../../../../store';
import { PlusIcon } from '../../../assets';
import { DeadlineType, type Activity, type Task, type TaskGroup } from '../../models';
import { ActivityItem } from '../TaskItem/ActivityItem/ActivityItem';
import { TaskItem } from '../TaskItem/TaskItem/TaskItem';
import { ADD_QUICK_TASK_CONTROL_CLASS, AddQuickTaskBlock, TimeAllocationCard } from './components';

const ColumnRoot = styled.div`
  position: relative;

  width: 279px;
  min-width: 279px;

  display: flex;
  flex-direction: column;

  border-radius: 6px;
  padding-top: 4px;

  @media ${MediaBreakpoints.SM} {
    width: calc(100vw - var(--sidebar-width) - 32px);
  }

  ${NoSelectMixin}
`;

const pencilPop = keyframes`
  0% {
    opacity: 0;
    scale: 0;
  }

  100% {
    opacity: 1;
    scale: 1;   
  }
`;

const ColumnHeader = styled.div<{ $hoverable?: boolean }>`
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  padding: 0 4px;
  margin-right: 16px;
  margin-bottom: 8px;

  .workspace__PencilButton--Root {
    display: none;
  }

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;

        .workspace__PencilButton--Root {
          display: flex;

          animation-delay: var(--transition-200);
          animation: ${pencilPop} var(--transition-200);
        }
      }
    `}
`;

interface ColumnTitleProps {
  $color?: string;
  $editMode?: boolean;
}

const ColumnTitle = styled.div<ColumnTitleProps>`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${p => p.$color || 'var(--button-text-graphite-priory-text)'};

  ${p =>
    p.$editMode &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${TruncateMixin}
`;

const ColumnHeaderGroup = styled.div<{ $truncate?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  ${p =>
    p.$truncate &&
    css`
      ${TruncateMixin}
    `}
`;

const TimeAllocationCardWrapper = styled.div`
  width: fit-content;
  height: fit-content;

  flex-shrink: 0;
`;

const TaskListDroppableWrapper = styled.div`
  min-height: 100%;

  @media ${MediaBreakpoints.SM} {
    overflow-x: hidden;
  }
`;

const TaskList = styled.div<{ $empty: boolean }>`
  position: relative;

  width: 263px;

  display: flex;
  flex-direction: column;

  padding: 4px;
  margin-right: 16px;
  border-radius: 12px;
  background: var(--background-blue-20);
  transition: var(--transition-200);

  &:hover {
    background: var(--background-blue-40);
  }

  ${p => p.$empty && `padding: 0`};

  @media ${MediaBreakpoints.SM} {
    width: 100%;
  }

  ${NoSelectMixin}
`;

const PlusIconWrapper = styled.button<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  border-radius: var(--border-radius-element);
  transform: rotate(0deg);
  transition: var(--transition-200);

  svg {
    transform: rotate(0deg);
    transition: var(--transition-200);

    path {
      transition: var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-80);

    svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    background-color: var(--graphite-graphite-80);

    svg path {
      fill: var(--button-text-blue-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      background-color: var(--graphite-graphite-80);

      svg {
        transform: rotate(45deg);
      }
    `}
`;

const LoadMoreObserver = styled.div`
  pointer-events: none;

  position: absolute;
  bottom: 0;

  width: 100%;
  height: 450px;
`;

interface Props {
  taskGroup: TaskGroup;
  taskGroupStore: TasksGroupStore;
  canEditBoard: boolean;
  metaLoaded: boolean;
  entityId: Nullable<number>;
  entityTypeId?: number;
  boardId?: number;
  currentPageEncodedUrl?: string;
  addTaskCard?: (taskCard: CreateTaskDto) => Promise<void>;
  handleMouseUpOnCard?: MouseEventHandler<HTMLDivElement>;
  handleMouseDownOnCard?: MouseEventHandler<HTMLDivElement>;
}

const TasksColumn = observer((props: Props) => {
  const {
    taskGroup,
    taskGroupStore,
    entityId,
    canEditBoard,
    metaLoaded,
    entityTypeId,
    boardId,
    currentPageEncodedUrl,
    addTaskCard,
    handleMouseUpOnCard,
    handleMouseDownOnCard,
  } = props;

  const { tasks, timeAllocation } = taskGroup;

  const { isIntersecting, ref: lastElement } = useIntersectionObserver({});

  useEffect(() => {
    if (isIntersecting) taskGroup.loadMore();
  }, [isIntersecting, taskGroup]);

  const currentUser = authStore.user;
  const canCreate = currentUser?.canCreate(PermissionObjectType.TASK, null);

  const [hasQuickTask, setHasQuickTask] = useState(true);
  const [quickTaskBlockShown, { toggle: toggleQuickTaskBlockShown, close: hideQuickTaskBlock }] =
    useDisclosure(false);
  const [quickTaskAdding, setQuickTaskAdding] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      taskGroup.code === StageCode.DONE ||
      taskGroup.code === DeadlineType.RESOLVED ||
      taskGroup.code === DeadlineType.OVERDUE ||
      pathname === routes.activities
    )
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setHasQuickTask(false);
  }, [pathname, taskGroup.code]);

  const handleAddQuickTask = async (dto: CreateTaskDto): Promise<void> => {
    if (!addTaskCard) return;

    try {
      setQuickTaskAdding(true);

      if (boardId) {
        dto.boardId = boardId;
        dto.stageId = taskGroup.id;
      }

      await addTaskCard(dto);
    } catch (e) {
      throw new Error(`Error while adding quick task ${dto.title}: ${e}`);
    } finally {
      setQuickTaskAdding(false);
    }
  };

  const titleColor = taskGroup?.titleColor || 'var(--button-text-graphite-secondary-text)';

  const showTimeAllocation = Boolean(
    timeAllocation && timeAllocation.reduce((acc, a) => acc + a.plannedTime, 0) > 0
  );

  return (
    <ColumnRoot>
      <ColumnHeader $hoverable={canEditBoard}>
        <ColumnHeaderGroup $truncate>
          <Transition mounted={showTimeAllocation} transition="pop">
            {transitionStyles => (
              <TimeAllocationCardWrapper style={{ ...transitionStyles }}>
                {timeAllocation && <TimeAllocationCard timeAllocation={timeAllocation} />}
              </TimeAllocationCardWrapper>
            )}
          </Transition>

          <ColumnTitle $color={titleColor}>
            <SpanWithEllipsis text={taskGroup.name} />
          </ColumnTitle>
        </ColumnHeaderGroup>

        <ColumnHeaderGroup>
          {boardId && canEditBoard && (
            <PencilButton
              linkProps={{
                to: routes.taskBoardSettings({
                  boardId,
                  entityTypeId,
                  from: currentPageEncodedUrl,
                  entityId: entityId ?? undefined,
                }),
              }}
            />
          )}

          {hasQuickTask && canCreate && (
            <PlusIconWrapper
              $active={quickTaskBlockShown}
              className={`${ADD_QUICK_TASK_CONTROL_CLASS}-${taskGroup.id}`}
              onClick={toggleQuickTaskBlockShown}
            >
              <PlusIcon />
            </PlusIconWrapper>
          )}

          {metaLoaded ? <ColumnCount count={taskGroup.count} /> : <ColumnCountGhost $medium />}
        </ColumnHeaderGroup>
      </ColumnHeader>

      <Scrollbar>
        <Droppable droppableId={String(taskGroup.id)} isDropDisabled={taskGroup.dropForbidden}>
          {dropProvided => (
            <TaskListDroppableWrapper ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              {(tasks.length > 0 || hasQuickTask) && (
                <TaskList $empty={!tasks.length && !quickTaskBlockShown}>
                  {quickTaskBlockShown && (
                    <AddQuickTaskBlock
                      id={taskGroup.id}
                      groupCode={taskGroup.code}
                      loading={quickTaskAdding}
                      entityId={entityId}
                      onTaskAdd={handleAddQuickTask}
                      hide={hideQuickTaskBlock}
                    />
                  )}

                  {tasks.map((t, idx) => {
                    if (t.isActivityView())
                      return (
                        <ActivityItem
                          key={t.id}
                          idx={idx}
                          activity={t as Activity}
                          taskGroupStore={taskGroupStore}
                          currentPageEncodedUrl={currentPageEncodedUrl}
                          handleMouseDown={handleMouseDownOnCard}
                          handleMouseUp={handleMouseUpOnCard}
                        />
                      );

                    if (t.isTaskView())
                      return (
                        <TaskItem
                          key={t.id}
                          idx={idx}
                          task={t as Task}
                          taskGroupStore={taskGroupStore}
                          handleMouseDown={handleMouseDownOnCard}
                          handleMouseUp={handleMouseUpOnCard}
                        />
                      );

                    return null;
                  })}

                  <LoadMoreObserver ref={lastElement} />
                </TaskList>
              )}

              {dropProvided.placeholder}
            </TaskListDroppableWrapper>
          )}
        </Droppable>
      </Scrollbar>
    </ColumnRoot>
  );
});

TasksColumn.displayName = 'TasksColumn';
export { TasksColumn };

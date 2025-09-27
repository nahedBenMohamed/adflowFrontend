import { boardApiUtil, iconStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  DefaultHeader,
  IconName,
  PermissionObjectType,
  TasksBoardPicker,
  TutorialProductType,
  type DefaultHeaderModuleIconProps,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { CreateTaskDto, TaskSettingsIdentifier, UserTimeAllocation } from '../../../../api';
import { TasksFilterType, type TaskBoardFilter } from '../../models';
import { AddTaskButton } from '../AddTaskButton/AddTaskButton';
import { BoardParticipants } from '../BoardParticipants/BoardParticipants';
import { TimeAllocationCard } from '../TasksColumn/components';
import { TasksFilterButton } from '../TasksFilterButton/TasksFilterButton';

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  boardId: Nullable<number>;
  isCalendar?: boolean;
  filter?: TaskBoardFilter;
  filterType?: TasksFilterType;
  entityId?: Nullable<number>;
  identifier?: TaskSettingsIdentifier;
  timeAllocation?: UserTimeAllocation[];
  handleAddTask?: (dto: CreateTaskDto) => Promise<void>;
  loadData?: (filter: TaskBoardFilter) => Promise<void>;
}

const TasksPageHeader = observer((props: Props) => {
  const {
    filter,
    isCalendar,
    filterType,
    identifier,
    boardId,
    timeAllocation,
    handleAddTask,
    loadData,
  } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_page_header',
  });

  const { user: currentUser } = authStore;

  const { data: boards } = boardApiUtil.useGetTasksBoards();

  const showTotalTimeAllocation = timeAllocation && timeAllocation.some(ta => ta.plannedTime > 0);

  const moduleIconProps = useMemo<DefaultHeaderModuleIconProps>(
    () => ({
      icon: iconStore.getByName(IconName.TICK_1).icon,
      color: iconStore.systemModuleColor,
    }),
    []
  );

  return (
    <DefaultHeader
      moduleName={t('title')}
      moduleIconProps={moduleIconProps}
      productType={TutorialProductType.TASK}
      hideControlsDelimiter={filterType === TasksFilterType.ACTIVITY_CARDS_FILTER}
      Controls={
        <>
          {boardId && <BoardParticipants board={boards?.find(board => board.id === boardId)} />}

          {showTotalTimeAllocation && (
            <TimeAllocationCard
              bigTarget
              hoverCardPosition="bottom-end"
              timeAllocation={timeAllocation}
            />
          )}

          {currentUser?.canCreate(PermissionObjectType.TASK) && identifier && handleAddTask && (
            <AddTaskButton
              identifier={identifier}
              entityId={null}
              boardId={boardId}
              handleAddTask={handleAddTask}
            />
          )}

          {filter && filterType && loadData && !isCalendar && (
            <TasksFilterButton
              filter={filter}
              filterType={filterType}
              boardId={boardId}
              loadData={loadData}
            />
          )}
        </>
      }
    >
      <LeftBlock>
        <TasksBoardPicker boards={boards ?? []} activeBoardId={boardId} />
      </LeftBlock>
    </DefaultHeader>
  );
});

TasksPageHeader.displayName = 'TasksPageHeader';
export { TasksPageHeader };

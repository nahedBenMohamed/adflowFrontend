import { authStore } from '@/modules/auth';
import {
  AddTaskButton,
  TimeAllocationCard,
  type CreateTaskDto,
  type TaskSettingsIdentifier,
  type UserTimeAllocation,
} from '@/modules/tasks';
import { PermissionObjectType } from '@/shared';
import { memo } from 'react';

interface Props {
  entityId: number;
  boardId: number;
  identifier: TaskSettingsIdentifier;
  timeAllocation?: UserTimeAllocation[];
  handleAddTask: (dto: CreateTaskDto) => Promise<void>;
}

const CardPageTasksProjectHeaderControls = memo((props: Props) => {
  const { entityId, boardId, identifier, timeAllocation, handleAddTask } = props;

  const { user: currentUser } = authStore;

  const showTotalTimeAllocation = timeAllocation && timeAllocation.some(ta => ta.plannedTime > 0);

  const canCreate = currentUser?.canCreate(PermissionObjectType.TASK);

  return (
    <>
      {showTotalTimeAllocation && (
        <TimeAllocationCard
          bigTarget
          hoverCardPosition="bottom-end"
          timeAllocation={timeAllocation}
        />
      )}

      {canCreate && (
        <AddTaskButton
          identifier={identifier}
          boardId={boardId}
          entityId={entityId}
          handleAddTask={handleAddTask}
        />
      )}
    </>
  );
});

CardPageTasksProjectHeaderControls.displayName = 'CardPageTasksProjectHeaderControls';
export { CardPageTasksProjectHeaderControls };

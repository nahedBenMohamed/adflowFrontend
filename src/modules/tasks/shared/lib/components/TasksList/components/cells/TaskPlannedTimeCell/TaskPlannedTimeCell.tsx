import { UpdateTaskDto } from '@/modules/tasks/api';
import { tasksStore } from '@/modules/tasks/store';
import { PlannedTimePicker, debounce, type Nullable } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import type { TaskRow } from '../../../../../models';

interface Props {
  cellContext: CellContext<TaskRow, Nullable<number>>;
}

const TaskPlannedTimeCell = observer((props: Props) => {
  const { cellContext } = props;

  const {
    plannedTime,
    originalTask: {
      id: taskId,
      userRights: { canEdit },
    },
    setPlannedTime,
  } = cellContext.row.original;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedChangePlannedTime = useCallback(
    debounce(async (plannedTime: number): Promise<void> => {
      if (!canEdit) return;

      setPlannedTime(plannedTime);

      try {
        await tasksStore.updateTask({
          taskId,
          dto: UpdateTaskDto.create({ plannedTime }),
        });
      } catch (e) {
        throw new Error(
          `Error while changing task's ${taskId} plannedTime to ${plannedTime}: ${e}`
        );
      }
    }, 500),
    [canEdit, taskId]
  );

  return (
    <PlannedTimePicker
      minified
      disabled={!canEdit}
      defaultValue={plannedTime}
      changeValue={handleDebouncedChangePlannedTime}
    />
  );
});

TaskPlannedTimeCell.displayName = 'TaskPlannedTimeCell';
export { TaskPlannedTimeCell };

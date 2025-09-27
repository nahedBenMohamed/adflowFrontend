import { userStore } from '@/app';
import { UserPicker, type User } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { UpdateTaskDto } from '../../../../../../../api';
import { tasksStore } from '../../../../../../../store';
import type { TaskRow } from '../../../../../models';

interface Props {
  cellContext: CellContext<TaskRow, number>;
}

const TaskResponsibleCell = observer((props: Props) => {
  const { cellContext } = props;

  const {
    responsibleUserId,
    originalTask: {
      id: taskId,
      userRights: { canEdit },
    },
    setResponsibleUserId,
  } = cellContext.row.original;

  const handleChangeResponsibleUser = useCallback(
    async (responsibleUser: User): Promise<void> => {
      if (!canEdit) return;

      const responsibleUserId = responsibleUser.id;

      setResponsibleUserId(responsibleUserId);

      try {
        await tasksStore.updateTask({
          taskId,
          dto: UpdateTaskDto.create({ responsibleUserId }),
        });
      } catch (e) {
        throw new Error(
          `Error while changing task's ${taskId} responsible user to ${responsibleUserId}: ${e}`
        );
      }
    },
    [canEdit, taskId, setResponsibleUserId]
  );

  return (
    <UserPicker
      withinPortal
      disabled={!canEdit}
      users={userStore.activeUsers}
      selectedId={responsibleUserId}
      onSelect={handleChangeResponsibleUser}
    />
  );
});

TaskResponsibleCell.displayName = 'TaskResponsibleCell';
export { TaskResponsibleCell };

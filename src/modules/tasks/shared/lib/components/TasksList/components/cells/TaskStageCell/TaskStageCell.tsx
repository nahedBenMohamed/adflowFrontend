import { stageApiUtil } from '@/app';
import { FieldSelectWrapper } from '@/modules/fields';
import { MySelectColored, type Option, type SelectModel } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { UpdateTaskDto } from '../../../../../../../api';
import { tasksStore } from '../../../../../../../store';
import type { TaskRow } from '../../../../../models';

interface Props {
  boardId: number;
  cellContext: CellContext<TaskRow, SelectModel>;
}

const TaskStageCell = observer((props: Props) => {
  const { boardId, cellContext } = props;

  const stageModel = cellContext.getValue();
  const { originalTask } = cellContext.row.original;
  const {
    userRights: { canEdit },
  } = originalTask;

  const handleChangeStage = useCallback(
    async (stageId: number): Promise<void> => {
      if (!canEdit) return;

      originalTask.stageId = stageId;

      try {
        await tasksStore.updateTask({
          taskId: originalTask.id,
          dto: UpdateTaskDto.create({ stageId, boardId }),
        });
      } catch (e) {
        throw new Error(`Error while changing task's ${originalTask.id} stage to ${stageId}: ${e}`);
      }
    },
    [canEdit, originalTask, boardId]
  );

  const { data: stages, isLoading: areStagesLoading } = stageApiUtil.useGetStagesByBoardId({
    boardId,
  });

  const stagesOptions = useMemo<Option<number, { bgColor: string }>[]>(
    () =>
      stages?.map(s => ({
        label: s.name,
        value: s.id,
        extra: {
          bgColor: s.color,
        },
      })) ?? [],
    [stages]
  );

  return (
    <FieldSelectWrapper>
      <MySelectColored
        withinPortal
        model={stageModel}
        disabled={!canEdit}
        options={stagesOptions}
        dropdownMinWidth="256px"
        loading={areStagesLoading}
        handleChange={handleChangeStage}
      />
    </FieldSelectWrapper>
  );
});

TaskStageCell.displayName = 'TaskStageCell';
export { TaskStageCell };

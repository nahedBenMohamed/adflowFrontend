import { InputModel, SelectModel } from '@/shared';
import { useMemo } from 'react';
import { TaskRow, type Task } from '../../models';

export const useGetTasksListData = (tasks: Task[]) =>
  useMemo<TaskRow[]>(
    () =>
      tasks.map<TaskRow>(
        t =>
          new TaskRow({
            originalTask: t,
            createdBy: t.createdBy,
            entityInfo: t.entityInfo,
            isResolved: t.isResolved,
            plannedTime: t.plannedTime,
            responsibleUserId: t.responsibleUserId,
            endDate: SelectModel.create(t.endDate),
            startDate: SelectModel.create(t.startDate),
            title: InputModel.create(t.title).required(),
            stageId: SelectModel.create(t.stageId).required(),
          })
      ),
    [tasks]
  );

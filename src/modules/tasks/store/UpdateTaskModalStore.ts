import { EntityApiUtil, type Nullable, UtcDate, type UtcDateValue } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { type CreateSubtaskDto, taskApi, type UpdateSubtaskDto, UpdateTaskDto } from '../api';
import type { Task } from '../shared';
import { tasksStore } from './TasksStore';

export class UpdateTaskModalStore {
  task: Nullable<Task> = null;

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadTask = async (id: number): Promise<void> => {
    try {
      this.isLoading = true;

      this.task = await taskApi.getTask(id);
    } catch (e) {
      throw new Error(`Failed to load task with id ${id}: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  updateTitle = async (title: string): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateTitle');

    this.task.title = title;

    await tasksStore.updateTask({ taskId: this.task.id, dto: UpdateTaskDto.create({ title }) });
  };

  updateText = async (text: string): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateText');

    this.task.text = text;

    await tasksStore.updateTask({ taskId: this.task.id, dto: UpdateTaskDto.create({ text }) });
  };

  updatePlannedTime = async (plannedTime: number): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updatePlannedTime');

    this.task.plannedTime = plannedTime;

    await tasksStore.updateTask({
      taskId: this.task.id,
      dto: UpdateTaskDto.create({ plannedTime }),
    });
  };

  updateEntity = async (entityId: number): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateEntity');

    this.task.entityInfo = await EntityApiUtil.getInfoById(entityId);

    this.task = await tasksStore.updateTask({
      taskId: this.task.id,
      dto: UpdateTaskDto.create({ entityId }),
    });
  };

  unpinEntity = async (): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to unpinEntity');

    this.task.entityInfo = null;

    this.task = await tasksStore.updateTask({
      taskId: this.task.id,
      dto: UpdateTaskDto.create({ entityId: null }),
    });
  };

  updateBoard = async (boardId: number): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateBoard');

    this.task.boardId = boardId;

    this.task = await tasksStore.updateTask({
      taskId: this.task.id,
      dto: UpdateTaskDto.create({ boardId }),
    });
  };

  updateResponsibleUser = async (responsibleUserId: number): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateAssignee');

    this.task.responsibleUserId = responsibleUserId;

    await tasksStore.updateTask({
      taskId: this.task.id,
      dto: UpdateTaskDto.create({ responsibleUserId }),
    });
  };

  updateStartDate = async (startDate: UtcDateValue): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateStartDate');

    this.task.startDate = startDate;

    await tasksStore.updateTask({
      taskId: this.task.id,
      dto: UpdateTaskDto.create({ startDate: startDate ? startDate.formatISO() : null }),
    });
  };

  updateEndDate = async (endDate: UtcDateValue): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateEndDate');

    this.task.endDate = endDate;

    await tasksStore.updateTask({
      taskId: this.task.id,
      dto: UpdateTaskDto.create({ endDate: endDate ? endDate.formatISO() : null }),
    });
  };

  updateFiles = async (filedIds: string[]): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateFiles');

    const fileIds: string[] = [
      ...this.task.fileLinks.map<string>(f => f.fileInfo.fileId),
      ...filedIds,
    ];

    const dto = UpdateTaskDto.create({ fileIds });

    const updatedTask = await tasksStore.updateTask({ taskId: this.task.id, dto });
    this.task.fileLinks = updatedTask.fileLinks;
  };

  updateResolved = async (isResolved: boolean): Promise<void> => {
    if (!this.task) throw new Error('Task is not loaded, failed to updateResolved');

    this.task.isResolved = isResolved;
    this.task.resolvedDate = isResolved ? UtcDate.now() : null;

    const dto = UpdateTaskDto.create({
      isResolved: this.task.isResolved,
    });

    this.task = await tasksStore.updateTask({ taskId: this.task.id, dto });
  };

  updateSubtasks = async ({
    taskId,
    subtasks,
  }: {
    taskId: number;
    subtasks: (CreateSubtaskDto | UpdateSubtaskDto)[];
  }): Promise<Task> => {
    return await taskApi.updateTask({
      taskId,
      dto: UpdateTaskDto.create({ subtasks }),
    });
  };
}

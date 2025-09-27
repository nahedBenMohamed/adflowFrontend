import type { DataStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  CreateTaskSettingsDto,
  TaskSettingsIdentifier,
  taskSettingsApi,
  type UpdateTaskSettingsDto,
} from '../api';
import { allTaskFieldCodes, type TaskSettings } from '../shared';

class TaskSettingsStore implements DataStore {
  taskSettingsList: TaskSettings[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.taskSettingsList = await taskSettingsApi.getTaskSettingsList();
    } catch (e) {
      throw new Error(`Failed to load task settings: ${e}`);
    }
  };

  invalidateTaskSettingsInCache = async (): Promise<void> => {
    this.taskSettingsList = await taskSettingsApi.getTaskSettingsList();
  };

  getById = (id: number): TaskSettings => {
    const taskSettings = this.taskSettingsList.find(t => t.id === id);

    if (!taskSettings) throw new Error(`Task settings with id ${id} was not found`);

    return taskSettings;
  };

  updateTaskSettings = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateTaskSettingsDto;
  }): Promise<TaskSettings> => {
    const updatedTaskSettings = await taskSettingsApi.updateTaskSettings({ id, dto });

    this.taskSettingsList = this.taskSettingsList.map(t =>
      t.id === updatedTaskSettings.id ? updatedTaskSettings : t
    );

    return updatedTaskSettings;
  };

  createTaskSettings = async (dto: CreateTaskSettingsDto): Promise<TaskSettings> => {
    const createdTaskSettings = await taskSettingsApi.createTaskSettings(dto);

    this.taskSettingsList = [...this.taskSettingsList, createdTaskSettings];

    return createdTaskSettings;
  };

  findByEntityTypeId = async (entityTypeId: number): Promise<TaskSettings> => {
    const identifier = TaskSettingsIdentifier.forEntityType(entityTypeId);

    return await this.findOrCreateByIdentifier(identifier);
  };

  findOrCreateByIdentifier = async (identifier: TaskSettingsIdentifier): Promise<TaskSettings> => {
    const taskSettings = this.taskSettingsList.find(t => t.identifier.equals(identifier));

    if (!taskSettings) {
      const dto = new CreateTaskSettingsDto({
        type: identifier.type,
        recordId: identifier.recordId,
        activeFields: allTaskFieldCodes,
      });

      return await this.createTaskSettings(dto);
    }

    return taskSettings;
  };

  reset = (): void => {
    this.taskSettingsList = [];
  };
}

export const taskSettingsStore = new TaskSettingsStore();

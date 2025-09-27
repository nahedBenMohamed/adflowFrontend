import { type TasksBoardType } from '@/modules/tasks';
import { type Nullable } from '../types';
import { storageService } from './StorageService';

interface TasksBoardParams {
  tasksType: TasksBoardType;
  boardId?: number;
}

const KEY = 'LastTasksBoard';

class LastTasksBoardService {
  getLastTasksBoardParams(): Nullable<TasksBoardParams> {
    const board = storageService.get<TasksBoardParams>(KEY);

    return board;
  }

  setLastTasksBoardParams({
    tasksType,
    boardId,
  }: {
    tasksType: TasksBoardType;
    boardId?: number;
  }): void {
    const board = { tasksType, boardId };

    storageService.set(KEY, board);
  }
}

export const lastTasksBoardService = new LastTasksBoardService();

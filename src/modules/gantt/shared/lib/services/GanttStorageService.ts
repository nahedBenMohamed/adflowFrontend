import { storageService, type Nullable } from '@/shared';

const TABLE_WIDTH_KEY = 'GanttTableWidth';

class GanttStorageService {
  getTableWidth = (): Nullable<number> => {
    return storageService.get<number>(TABLE_WIDTH_KEY);
  };

  storeTableWidth = (tableWidth: number): void => {
    storageService.set(TABLE_WIDTH_KEY, tableWidth);
  };
}

export const ganttStorageService = new GanttStorageService();

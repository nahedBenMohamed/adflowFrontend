import type { EntityInfo, MultiselectModel, SelectModel } from '@/shared';

export interface TaskCalendarFilterForm {
  viewSelectModel: SelectModel;
  usersSelectModel: MultiselectModel<number>;
  taskTypeSelectModel: SelectModel;
  entityInfos: EntityInfo[];
  stageIds: MultiselectModel<number>;
  colorSelectModel: SelectModel;
  saveFilterSettings: boolean;
}

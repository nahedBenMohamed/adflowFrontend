import type { BooleanModel, InputModel, MultiselectModel, SelectModel } from '@/shared';

export interface GoogleCalendarConnectModalInitialForm {
  title: InputModel;
  externalId: SelectModel;
  taskBoardId: SelectModel;
  scheduleId: SelectModel;
  calendarTypeRadio: InputModel;
  responsibleUserId: SelectModel;
  linkedIds: MultiselectModel<number>;
  processAll: InputModel;
  syncEvents: BooleanModel;
}

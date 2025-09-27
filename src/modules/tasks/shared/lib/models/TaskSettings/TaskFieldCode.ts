export enum TaskFieldCode {
  PLANNED_TIME = 'planned_time',
  BOARD_NAME = 'board_name',
  START_DATE = 'start_date',
  END_DATE = 'end_date',
  DESCRIPTION = 'description',
  SUBTASKS = 'subtasks',
}

export const allTaskFieldCodes: TaskFieldCode[] = [
  TaskFieldCode.PLANNED_TIME,
  TaskFieldCode.BOARD_NAME,
  TaskFieldCode.START_DATE,
  TaskFieldCode.END_DATE,
  TaskFieldCode.DESCRIPTION,
  TaskFieldCode.SUBTASKS,
];

export const GANTT_TABLE_RESIZE_EVENT = 'gantt-table-resize';

export class TableResizeEvent extends UIEvent {
  constructor() {
    super(GANTT_TABLE_RESIZE_EVENT, { bubbles: true });
  }
}

export class TaskCalendarMeta {
  total: number;

  constructor({ total }: TaskCalendarMeta) {
    this.total = total;
  }

  static fromDto(dto: { total: number }) {
    return new TaskCalendarMeta(dto);
  }
}

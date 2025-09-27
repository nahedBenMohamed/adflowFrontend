export class TasksCount {
  notResolved: number;
  overdue: number;
  today: number;
  resolved: number;

  constructor({ notResolved, overdue, today, resolved }: TasksCount) {
    this.notResolved = notResolved;
    this.overdue = overdue;
    this.today = today;
    this.resolved = resolved;
  }
}

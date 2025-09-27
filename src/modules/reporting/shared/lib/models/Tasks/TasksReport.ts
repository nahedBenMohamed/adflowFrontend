import type { TasksSummaryReport } from '../../../../api';

export class TasksReport {
  total: number;
  completed: number;
  expired: number;
  noTask: number;

  constructor({ total, completed, expired, noTask }: TasksSummaryReport) {
    this.total = total;
    this.completed = completed;
    this.expired = expired;
    this.noTask = noTask;
  }

  static fromDto(dto: TasksSummaryReport): TasksReport {
    return new TasksReport({
      total: dto.total,
      completed: dto.completed,
      expired: dto.expired,
      noTask: dto.noTask,
    });
  }
}

export class SchedulerEvent {
  accountId: number;
  userId: number;
  scheduleId: number;

  constructor({ accountId, userId, scheduleId }: SchedulerEvent) {
    this.accountId = accountId;
    this.userId = userId;
    this.scheduleId = scheduleId;
  }
}

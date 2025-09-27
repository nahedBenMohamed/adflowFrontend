import { serverEventService, type SubscriberStore } from '@/shared';
import { deleteScheduleInCache, getSchedule, upsertScheduleToCache } from '../api';
import { SchedulerEvents, type SchedulerEvent } from '../shared';

class SchedulerEventHandlerStore implements SubscriberStore {
  subscribe = async (): Promise<void> => {
    serverEventService.on<SchedulerEvent>(
      SchedulerEvents.SCHEDULE_CREATED,
      async (...args: SchedulerEvent[]): Promise<void> => {
        if (args[0]) this.handleScheduleCreatedEvent(args[0]);
      }
    );
    serverEventService.on<SchedulerEvent>(
      SchedulerEvents.SCHEDULE_UPDATED,
      async (...args: SchedulerEvent[]): Promise<void> => {
        if (args[0]) this.handleScheduleUpdatedEvent(args[0]);
      }
    );
    serverEventService.on<SchedulerEvent>(
      SchedulerEvents.SCHEDULE_DELETED,
      async (...args: SchedulerEvent[]): Promise<void> => {
        if (args[0]) this.handleScheduleDeletedEvent(args[0]);
      }
    );
  };

  unsubscribe = async (): Promise<void> => {
    serverEventService.off(SchedulerEvents.SCHEDULE_CREATED);
    serverEventService.off(SchedulerEvents.SCHEDULE_UPDATED);
    serverEventService.off(SchedulerEvents.SCHEDULE_DELETED);
  };

  handleScheduleCreatedEvent = async (event: SchedulerEvent): Promise<void> => {
    const schedule = await getSchedule(event.scheduleId);
    if (schedule) upsertScheduleToCache(schedule);
  };

  handleScheduleUpdatedEvent = async (event: SchedulerEvent): Promise<void> => {
    const schedule = await getSchedule(event.scheduleId);
    if (schedule) upsertScheduleToCache(schedule);
  };

  handleScheduleDeletedEvent = async (event: SchedulerEvent): Promise<void> => {
    deleteScheduleInCache(event.scheduleId);
  };
}

export const schedulerEventHandlerStore = new SchedulerEventHandlerStore();

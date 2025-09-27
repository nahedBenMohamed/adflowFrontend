import { generalSettingsStore } from '@/app';
import { FULL_CALENDAR_LICENSE_KEY } from '@/modules/products';
import {
  Language,
  type Nullable,
  useGetLocalBusinessHours,
  UtcDate,
  WholePageLoaderWithLogo,
} from '@/shared';
import type {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventSourceInput,
  PluginDef,
} from '@fullcalendar/core';
import { type EventImpl } from '@fullcalendar/core/internal';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import type { ResourceSourceInput } from '@fullcalendar/resource';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import scrollgridPlugin from '@fullcalendar/scrollgrid';
import { observer } from 'mobx-react-lite';
import { type Ref, useCallback, useMemo } from 'react';
import {
  generateAppointmentEvents,
  generatePerformersResources,
  type ScheduleAppointment,
  type SchedulePerformer,
  useGetSchedulerPerformersBusinessHours,
} from '../../../../shared';
import { AppointmentEventComponent } from '../AppointmentEventComponent/AppointmentEventComponent';
import { PerformerResourceLabel } from '../PerformerResourceLabel/PerformerResourceLabel';

interface FCWorkingTimeInterval {
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}

type FCWorkingTime = FCWorkingTimeInterval | FCWorkingTimeInterval[];

const plugins: PluginDef[] = [resourceTimeGridPlugin, scrollgridPlugin, interactionPlugin];

interface Props {
  ref?: Ref<FullCalendar>;
  performers: SchedulePerformer[];
  productsSectionId: Nullable<number>;
  appointments: ScheduleAppointment[];
  canAddAppointment?: boolean;
  handleSelectEvent: (id: number) => void;
  handleCreateEvent: (args: DateSelectArg) => void;
  handleUpdateEventDnd: (newEvent: EventImpl) => void;
}

const calendarStyles = {
  dayMinWidth: 240,
} satisfies CalendarOptions;

const minutesSlotDuration = 15;

const VisitsScheduler = observer((props: Props) => {
  const {
    ref,
    appointments,
    performers,
    productsSectionId,
    canAddAppointment,
    handleCreateEvent,
    handleSelectEvent,
    handleUpdateEventDnd,
  } = props;

  const businessHours = useGetLocalBusinessHours();

  const {
    businessHours: performersBusinessHours,
    areBusinessHoursLoading: arePerformanceBusinessHoursLoading,
  } = useGetSchedulerPerformersBusinessHours({ performers });

  const performersResources = useMemo<ResourceSourceInput>(
    () => generatePerformersResources({ performers, performersBusinessHours }),
    [performers, performersBusinessHours]
  );

  const appointmentsEvents = useMemo<EventSourceInput>(
    () => generateAppointmentEvents(appointments),
    [appointments]
  );

  const handleSelect = useCallback(
    (args: EventClickArg) => {
      const { event } = args;
      const eventId = Number(event.id);

      const currentAppointment = appointments.find(a => a.id === eventId);

      if (!currentAppointment?.userRights.canEdit) return;

      handleSelectEvent(eventId);
    },
    [appointments, handleSelectEvent]
  );

  const workingTime = useMemo<FCWorkingTime>(() => {
    // if business hours end jumps to another day, split them into two intervals
    // like 12:00 to 01:00 -> ['12:00 to 23:59', '0:00 to 01:00']
    if (businessHours.to < businessHours.from)
      return [
        {
          startTime: businessHours.from,
          endTime: '23:59',
          daysOfWeek: generalSettingsStore.workingDaysAsNumberArray ?? [1, 2, 3, 4, 5],
        },
        {
          startTime: '00:00',
          endTime: businessHours.to,
          daysOfWeek: generalSettingsStore.workingDaysAsNumberArray ?? [1, 2, 3, 4, 5],
        },
      ];

    return {
      startTime: businessHours.from,
      endTime: businessHours.to,
      daysOfWeek: generalSettingsStore.workingDaysAsNumberArray ?? [1, 2, 3, 4, 5],
    };
  }, [businessHours.from, businessHours.to]);

  if (arePerformanceBusinessHoursLoading) return <WholePageLoaderWithLogo ensureSubheader />;

  return (
    <FullCalendar
      ref={ref}
      editable
      selectable={canAddAppointment}
      selectMirror
      dayMaxEvents
      nowIndicator
      plugins={plugins}
      allDaySlot={false}
      {...calendarStyles}
      eventOverlap={false}
      headerToolbar={false}
      scrollTimeReset={false}
      slotEventOverlap={false}
      eventStartEditable={false}
      events={appointmentsEvents}
      datesAboveResources={false}
      eventDurationEditable={false}
      eventResizableFromStart={false}
      resources={performersResources}
      initialView="resourceTimeGridDay"
      slotDuration={{
        minute: minutesSlotDuration,
      }}
      slotLabelInterval={{
        hour: 1,
      }}
      eventConstraint="businessHours"
      selectConstraint="businessHours"
      businessHours={workingTime}
      eventClassNames="workspace__AppointmentEventComponent"
      schedulerLicenseKey={FULL_CALENDAR_LICENSE_KEY}
      firstDay={generalSettingsStore.startOfWeekAsNumber}
      locale={generalSettingsStore.accountSettings?.language ?? Language.ENGLISH}
      resourceLabelContent={({ resource }) => (
        <PerformerResourceLabel performer={resource.extendedProps.performer} />
      )}
      eventContent={({ event }) => (
        <AppointmentEventComponent
          title={event.title}
          productsSectionId={productsSectionId}
          minutesSlotDuration={minutesSlotDuration}
          appointment={event.extendedProps.appointment}
          endDate={UtcDate.fromNullableDate(event.end)}
          startDate={UtcDate.fromNullableDate(event.start)}
        />
      )}
      select={handleCreateEvent}
      eventClick={handleSelect}
      eventChange={({ event }) => handleUpdateEventDnd(event)}
    />
  );
});

export { VisitsScheduler };

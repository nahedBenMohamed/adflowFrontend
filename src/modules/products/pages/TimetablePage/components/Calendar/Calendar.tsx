import { generalSettingsStore } from '@/app';
import { CalendarView, type BooleanModel } from '@/shared';
import type { CalendarApi, CalendarOptions, PluginDef, ViewApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import scrollgridPlugin from '@fullcalendar/scrollgrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useDidUpdate } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import type { Ref } from 'react';
import {
  CalendarGridView,
  ResourceViewMode,
  type CalendarEvent,
  type CalendarResource,
  type ProductsSection,
  type Rental,
} from '../../../../shared';
import { FULL_CALENDAR_LICENSE_KEY } from '../../../../shared/lib/models/fullCalendarLicenseKey';
import { CalendarResourceHeader, CalendarResourceLabel, RentEvent } from '../../components';
import { CalendarDateCell } from '../CalendarDateCell/CalendarDateCell';

const plugins: PluginDef[] = [
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  scrollgridPlugin,
  resourceTimelinePlugin,
  resourceDayGridPlugin,
  resourceTimeGridPlugin,
];

interface Props {
  ref?: Ref<FullCalendar>;
  calendarApi: CalendarApi;
  rentals: Rental[];
  events: CalendarEvent[];
  resources: CalendarResource[];
  currentGridPeriod: CalendarView;
  resourceViewMode: ResourceViewMode;
  hideEmptyResourcesModel: BooleanModel;
  productsSection?: ProductsSection;
  setCalendarPeriodTitle: (title: string) => void;
  initializeDates: (calendarViewApi: ViewApi) => void;
}

const views = {
  resourceTimelineWeek: {
    type: 'resourceTimeline',
    duration: {
      week: 1,
    },
  },
  resourceDayGridWeek: {
    type: 'resourceDayGrid',
    duration: {
      week: 3,
    },
  },
  resourceTimelineMonth: {
    type: 'resourceTimeline',
    duration: {
      month: 1,
    },
  },
  resourceDayGridMonth: {
    type: 'resourceDayGrid',
    duration: {
      month: 1,
    },
  },
};

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

const calendarStyles = {
  dayMinWidth: 100,
  slotMinWidth: 100,
  resourceAreaWidth: 240,
  height: '100%',
} satisfies CalendarOptions;

const Calendar = observer((props: Props) => {
  const {
    ref,
    calendarApi,
    currentGridPeriod,
    events,
    resources,
    rentals,
    resourceViewMode,
    hideEmptyResourcesModel,
    productsSection,
    setCalendarPeriodTitle,
    initializeDates,
  } = props;

  useDidUpdate(() => {
    // we need to queueMicrotask because calendarApi is using flushSync under the hood
    // and it is not possible to flush sync state in the lifecycle methods
    queueMicrotask(() => {
      const { view: calendarViewApi } = calendarApi;

      if (currentGridPeriod === CalendarView.MONTH) {
        calendarApi.changeView(
          resourceViewMode === ResourceViewMode.COLUMN
            ? CalendarGridView.VERTICAL_MONTH
            : CalendarGridView.HORIZONTAL_MONTH
        );
      } else if (currentGridPeriod === CalendarView.WEEK) {
        calendarApi.changeView(
          resourceViewMode === ResourceViewMode.COLUMN
            ? CalendarGridView.VERTICAL_WEEK
            : CalendarGridView.HORIZONTAL_WEEK
        );
      }

      initializeDates(calendarViewApi);
      setCalendarPeriodTitle(calendarViewApi.title);
    });
  }, [resourceViewMode, currentGridPeriod]);

  return (
    <FullCalendar
      ref={ref}
      editable
      selectable
      expandRows
      selectMirror
      dayMaxEvents
      views={views}
      events={events}
      plugins={plugins}
      {...calendarStyles}
      resources={resources}
      headerToolbar={false}
      slotDuration={{ days: 1 }}
      eventStartEditable={false}
      datesAboveResources={false}
      eventDurationEditable={false}
      eventResizableFromStart={false}
      initialView={CalendarGridView.HORIZONTAL_WEEK}
      schedulerLicenseKey={FULL_CALENDAR_LICENSE_KEY}
      firstDay={generalSettingsStore.startOfWeekAsNumber}
      filterResourcesWithEvents={hideEmptyResourcesModel.value}
      slotLabelContent={slot => <CalendarDateCell slot={slot} />}
      eventContent={e => <RentEvent fcEvent={e} events={rentals} />}
      resourceLabelContent={args => <CalendarResourceLabel label={args.resource.title} />}
      resourceAreaColumns={[
        {
          headerContent: <CalendarResourceHeader productSection={productsSection} />,
        },
      ]}
    />
  );
});

export { Calendar };

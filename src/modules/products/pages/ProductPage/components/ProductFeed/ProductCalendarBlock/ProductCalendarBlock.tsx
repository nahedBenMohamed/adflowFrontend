import { generalSettingsStore } from '@/app';
import { ScrollbarArrowIcon, UtcDate } from '@/shared';
import type { CalendarApi } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetProductRentals } from '../../../../../api';
import type { EventShort, Rental } from '../../../../../shared';
import { ProductCalendarBlockStyles } from './ProductCalendarBlock.styles';

const Root = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;

  padding: 16px;
`;

const CalendarToolbarWrapper = styled.div`
  margin: 0;
  background: var(--primary-statuses-white-0);
  padding: 12px 16px 16px 0;
`;

const CalendarToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const CalendarToolbarNavBar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CalendarToolbarTitle = styled.div`
  min-width: 80px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 2px 8px 3px;
  border: 1px solid var(--graphite-graphite-200);
  border-radius: var(--border-radius-element);
`;

const NavControlButton = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg path {
    fill: var(--button-text-graphite-secondary-text);
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-20);

    svg path {
      fill: var(--button-text-graphite-primary-text);
    }
  }

  &:active {
    background-color: var(--graphite-graphite-40);

    svg path {
      fill: var(--button-text-graphite-secondary-text);
    }
  }
`;

const ButtonArrowIconPrev = styled(ScrollbarArrowIcon)`
  transform: rotate(180deg);
`;

interface Props {
  sectionId: number;
  productId: number;
}

let calendarApi: CalendarApi;

const DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

const ProductCalendarBlock = observer((props: Props) => {
  const { sectionId, productId } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.calendar',
  });

  const [startDate, setStartDate] = useState<string>(() => UtcDate.now().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(() => UtcDate.now().format('YYYY-MM-DD'));

  const calendarRef = useRef<FullCalendar>(null);

  const { data } = useGetProductRentals({
    sectionId,
    productId,
    queryParams: {
      startDate: UtcDate.fromDate(new Date(`${startDate.split('-')[0]}-01-01`)).formatISO(),
      endDate: UtcDate.fromDate(new Date(`${endDate.split('-')[0]}-12-31T23:59:59`)).formatISO(),
    },
  });

  const handleOnPrevYear = () => {
    calendarApi.prev();

    setStartDate(calendarApi?.view.activeEnd.toISOString() || '');
    setEndDate(calendarApi?.view.activeEnd.toISOString() || '');
  };

  const handleOnNextYear = () => {
    calendarApi.next();

    setStartDate(calendarApi?.view.activeEnd.toISOString() || '');
    setEndDate(calendarApi?.view.activeEnd.toISOString() || '');
  };

  const transformEvents = (events: Rental[]): EventShort[] =>
    events.map(e => ({
      id: String(e.id),
      status: e.status,
      start: e.startDate,
      end: e.endDate,
      className: e.status,
    }));

  useLayoutEffect(() => {
    if (calendarRef.current) {
      calendarApi = calendarRef.current.getApi();

      calendarApi.view.activeStart.toISOString();

      setEndDate(UtcDate.nowISO());

      setStartDate(UtcDate.nowISO());
    }
  }, [calendarRef, setStartDate, setEndDate]);

  const events = useMemo(() => (data ? transformEvents(data) : []), [data]);

  return (
    <Root>
      <ProductCalendarBlockStyles>
        <CalendarToolbarWrapper>
          <CalendarToolbarContainer>
            <CalendarToolbarNavBar>
              <NavControlButton onClick={handleOnPrevYear}>
                <ButtonArrowIconPrev width={10} height={10} />
              </NavControlButton>

              <CalendarToolbarTitle>{startDate.split('-')[0]}</CalendarToolbarTitle>

              <NavControlButton onClick={handleOnNextYear}>
                <ScrollbarArrowIcon width={10} height={10} />
              </NavControlButton>
            </CalendarToolbarNavBar>
          </CalendarToolbarContainer>
        </CalendarToolbarWrapper>

        <FullCalendar
          ref={calendarRef}
          selectMirror
          height={420}
          events={events}
          eventDisplay="block"
          headerToolbar={false}
          moreLinkContent={null}
          dayMaxEventRows={false}
          multiMonthMinWidth={322}
          multiMonthMaxColumns={3}
          initialView="multiMonthYear"
          eventStartEditable={false}
          plugins={[multiMonthPlugin]}
          eventDurationEditable={false}
          eventResizableFromStart={false}
          firstDay={generalSettingsStore.startOfWeekAsNumber}
          dayHeaderContent={d => t(`days.short.${DAYS[d.date.getDay()]}`)}
        />
      </ProductCalendarBlockStyles>
    </Root>
  );
});

export { ProductCalendarBlock };

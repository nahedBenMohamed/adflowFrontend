import { HideScrollbarMixin } from '@/shared';
import styled from 'styled-components';

export const CalendarComponentStyles = styled.div`
  /* change some fc global vars  */
  --fc-today-bg-color: var(--graphite-graphite-40);

  padding: calc(var(--header-height) + 8px) 0 16px;

  /* hide duplicate symmetric scrollbars */
  tbody[role='rowgroup'] {
    td[role='presentation']:first-child {
      .fc-scroller {
        scrollbar-color: transparent transparent;
      }
      .fc-scroller::-webkit-scrollbar {
        background-color: transparent;
      }
    }
  }

  .fc-scroller {
    &:has(.fc-timeline-header) {
      ${HideScrollbarMixin}
    }
  }

  .fc {
    height: calc(
      100dvh - var(--header-height) - var(--header-with-subheader-height) - 16px - 8px
    ) !important;

    .fc-resource-timeline-divider {
      visibility: hidden;
    }

    .fc-resourceTimelineWeek-view,
    .fc-resourceTimelineMonth-view,
    .fc-resourceDayGridWeek-view,
    .fc-resourceDayGridMonth-view {
      padding: 16px;
      background: var(--primary-statuses-white-0);
      border-radius: var(--border-radius-block);

      box-shadow:
        0 1px 2px 0 #d0daeb,
        0 0 2px 0 #eef4fe;

      .fc-scrollgrid {
        border: 0;

        thead[role='rowgroup'] {
          th[role='presentation']:last-child {
            border-right: none;
          }
        }

        tbody[role='rowgroup'] {
          td[role='presentation']:last-child {
            border-right: none;
          }
        }

        .fc-scrollgrid-section-body > td {
          border-bottom: none;
        }
      }
    }

    .fc-event {
      background: none !important;
      border: none !important;

      min-height: 52px;

      padding: 0;
      cursor: default;

      &::before,
      &::after {
        display: none;
      }
    }
  }

  .fc-theme-standard th {
    border-color: var(--graphite-graphite-80);
  }

  .fc-theme-standard td {
    border-color: var(--graphite-graphite-80);
  }

  /* subheader, vertical resources view */
  .fc-col-header-cell-cushion {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: var(--button-text-graphite-primary-text);
  }

  /* day on the right top of the cell */
  .fc-daygrid-day-number {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--button-text-graphite-priory-text);
  }

  /* current day */
  .fc-day-today {
    background-color: transparent;
  }

  /* days which are not a part of current period */
  .fc .fc-day-other .fc-daygrid-day-top {
    opacity: 0.5;
  }

  /* calendar cells (min-height is set to prevent shrinking on the initial render) */
  .fc-timeline-lane-frame,
  .fc-datagrid-cell-frame {
    min-height: 56px !important;
  }
`;

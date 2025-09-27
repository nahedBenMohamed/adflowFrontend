import { HideScrollbarMixin, TableScrollbarMixin } from '@/shared';
import styled, { css } from 'styled-components';

export const TasksCalendarStylesWrapper = styled.div<{ $loading?: boolean }>`
  /* change some fc global vars  */
  --fc-today-bg-color: var(--graphite-graphite-40);
  --fc-now-indicator-color: var(--button-text-graphite-priory-text);
  --fc-border-color: var(--graphite-graphite-80);
  --fc-event-bg-color: transparent;
  --fc-event-border-color: transparent;
  --fc-highlight-color: transparent;
  --fc-non-business-color: rgba(170, 183, 212, 0.1);

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
    td[role='presentation']:last-child {
      border-right: none;
    }
  }

  .fc-scroller {
    overflow-x: hidden !important;
    max-width: 100%;

    ${TableScrollbarMixin};

    &:has(.fc-timeline-header),
    &:has(.fc-timegrid-axis-chunk) {
      ${HideScrollbarMixin}
    }
  }

  .fc-col-header-cell {
    border-right: none;
  }

  /* main calendar body element */
  .fc {
    height: calc(100dvh - var(--header-height) - 2 * 16px - 8px) !important;
    width: 100%;

    background: var(--primary-statuses-white-0);

    ${p =>
      p.$loading &&
      css`
        opacity: 0.9;

        &:hover {
          cursor: wait;
        }
      `}

    /* set background color */
    .fc-timegrid-body {
      background: var(--graphite-graphite-20);

      /* disable borders on minor timeslots to lower visual noise */
      .fc-timegrid-slot-minor {
        border: none;
      }
    }

    /* disable parasite horizontal scroll */
    .fc-scroller-liquid-absolute {
      overflow-x: hidden !important;
    }

    /* disable right border on top of timeslots */
    .fc-timeGridDay-view {
      .fc-scrollgrid-section th {
        border-right-width: 0;
      }
    }

    /* disable default event component styles */
    .fc-event {
      background: none !important;
      border: none !important;
      box-shadow: none;
      cursor: default;

      padding: 0;

      &::before,
      &::after {
        display: none;
      }
    }

    /* remove underline on links hover */
    a[data-navlink]:hover {
      text-decoration: none;
    }

    /* more link on day and week views */
    .fc-timegrid-more-link {
      position: relative;
      max-height: 25px;
    }

    /* remove strange hover state on more link */
    .fc-daygrid-more-link:hover {
      background-color: unset;
    }

    /* to remove outer border */
    .fc-scrollgrid {
      border: 0;
    }

    /* left hours labels */
    .fc-timegrid-slot-label-cushion.fc-scrollgrid-shrink-cushion {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      text-align: center;
      color: var(--button-text-graphite-primary-text);
    }

    /* current day */
    .fc-day-today {
      background-color: transparent;
    }

    /* set border color inside calendar */
    .fc-theme-standard th,
    td {
      border-color: var(--graphite-graphite-80);
    }

    /* subheader */
    .fc-col-header-cell-cushion {
      width: 100%;

      padding: 0;
      text-transform: capitalize;
    }

    /* hover cursor on day grids in month view */
    .fc-daygrid-day-frame:hover {
      cursor: pointer;
    }

    /* now indicator circle (above time labels) */
    .fc-timegrid-now-indicator-arrow {
      display: none;
    }

    /* now indicator line (above calendar itself) */
    .fc-timegrid-now-indicator-line {
      position: relative;

      border-width: 2px 0 0;
      transform: translateX(8px);
      pointer-events: none;

      /* bulb next to now indicator */
      &::before {
        position: relative;
        display: block;
        top: -7px;
        left: -7px;

        width: 12px;
        height: 12px;

        content: '';
        border: none;
        border-radius: 50%;
        background: var(--fc-now-indicator-color);
      }
    }

    /* days which are not a part of current period */
    .fc .fc-day-other .fc-daygrid-day-top {
      opacity: 0.5;
    }

    /* remove header bottom border in month view + set background color */
    .fc-dayGridMonth-view {
      background: var(--graphite-graphite-20);

      .fc-col-header-cell {
        border-bottom: none;
      }

      .fc-scrollgrid table {
        border-bottom-width: 0;
      }
    }

    /* disable event time in agenda view */
    .fc-list-event-time,
    .fc-list-event-graphic {
      display: none;
    }

    /* to prevent linked entity tags inherit task title color */
    .fc-list-event-title a {
      color: var(--primary-statuses-white-0);
    }

    /* popover (shown on click on more link) */
    .fc-popover {
      max-width: 280px;

      padding: 8px;
      border-radius: var(--border-radius-element);
      border: 1px solid var(--graphite-graphite-80);
      background: var(--primary-statuses-white-0);
      box-shadow: 0 0 12px 0 rgba(35, 40, 47, 0.08);

      .fc-more-popover-misc {
        visibility: hidden;
      }

      .fc-popover-header {
        background: var(--primary-statuses-white-0);
      }

      .fc-popover-body {
        max-height: 226px;

        overflow: auto;
        padding: 0;
      }

      .fc-popover-title {
        font-weight: 500;
        color: var(--button-text-graphite-priory-text);
      }
    }

    /* all-day slot title */
    .fc-timegrid-axis-cushion.fc-scrollgrid-shrink-cushion.fc-scrollgrid-sync-inner {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      text-align: center;
      color: var(--button-text-graphite-primary-text);
    }

    /* all-day slot divider */
    .fc-timegrid-divider {
      background: var(--graphite-graphite-80);
    }

    /* equal-height rows in month view */
    .fc-dayGridMonth-view {
      .fc-daygrid-day-frame {
        height: 160px;
      }
    }
  }
`;

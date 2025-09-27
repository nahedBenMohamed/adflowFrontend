import { MediaBreakpoints } from '@/shared';
import styled from 'styled-components';

export const VisitsSchedulerComponentStyles = styled.div<{ $noStatistics?: boolean }>`
  /* change some fc global vars  */
  --fc-today-bg-color: var(--graphite-graphite-40);
  --fc-now-indicator-color: var(--button-text-red-default);
  --fc-border-color: var(--graphite-graphite-80);
  --fc-event-bg-color: transparent;
  --fc-event-border-color: transparent;
  --fc-highlight-color: transparent;
  --fc-today-bg-color: transparent;
  --fc-non-business-color: rgba(170, 183, 212, 0.1);

  padding: calc(var(--header-height) + 8px) 0 16px;

  .fc {
    .fc-event {
      cursor: default;
    }

    height: calc(
      100dvh - var(--header-height) * 2 - var(--subheader-height) - 16px - 8px -
        ${p => (p.$noStatistics ? '0px' : 'var(--scheduler-statistics-height)')}
    );

    @media ${MediaBreakpoints.SM} {
      width: calc(100vw - var(--sidebar-width) - 32px);
    }

    /* to remove outer border */
    .fc-scrollgrid {
      border: 0;

      thead[role='rowgroup'] {
        th[role='presentation']:last-child {
          border-right: none;
        }

        .fc-scroller::-webkit-scrollbar {
          background-color: transparent;
        }
      }

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

          .fc-scroller {
            overflow: auto scroll !important;
          }
        }
      }

      .fc-scrollgrid-section-header {
        th[role='presentation']:last-child {
          border-right: none;
          scrollbar-color: transparent transparent;
        }
      }

      .fc-scrollgrid-section-body > td {
        border-bottom: none;
      }
    }

    /* left hours labels */
    .fc-timegrid-slot-label-cushion.fc-scrollgrid-shrink-cushion {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: var(--button-text-graphite-priory-text);

      @media ${MediaBreakpoints.SM} {
        font-size: 12px;
        line-height: 18px;
      }
    }

    .fc-resourceTimeGridDay-view {
      padding: 16px;
      background: var(--primary-statuses-white-0);
      border-radius: var(--border-radius-block);

      box-shadow:
        0 1px 2px 0 #d0daeb,
        0 0 2px 0 #eef4fe;

      @media ${MediaBreakpoints.SM} {
        padding: 8px;
      }
    }

    /* events */
    .fc-event {
      box-shadow: none;
    }

    .fc-event-main {
      padding: 0;
    }
  }
`;

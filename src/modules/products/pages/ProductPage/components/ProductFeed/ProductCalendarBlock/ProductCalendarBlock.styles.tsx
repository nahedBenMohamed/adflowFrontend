import styled from 'styled-components';

export const ProductCalendarBlockStyles = styled.div`
  .fc {
    min-height: 420px;

    table {
      height: auto !important;
    }

    th,
    td {
      width: 34px;
      height: 34px;
    }

    td {
      border: 1px solid var(--graphite-graphite-80);
    }

    .fc-daygrid-more-link {
      display: none !important;
    }

    .fc-multimonth-title {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: var(--button-text-graphite-primary-text);

      padding: 0 0 8px;
    }

    .fc-col-header-cell {
      border: none;

      vertical-align: middle;

      font-size: 10px;
      font-weight: 600;
      text-align: center;

      border-bottom: 1px solid var(--graphite-graphite-80);

      a {
        color: var(--button-text-graphite-priory-text);
      }
    }

    .fc-daygrid-body {
      border-left: 1px solid var(--graphite-graphite-80);
      border-right: 1px solid var(--graphite-graphite-80);
    }

    .fc-day.fc-day-disabled {
      background-color: transparent;
    }

    .fc-day-today {
      background-color: transparent;
    }

    .fc-multimonth {
      border: none;

      gap: 16px;

      .fc-multimonth-month {
        max-width: 240px !important;

        .fc-multimonth-title {
          text-align: left;
        }
      }

      .fc-event-time {
        display: none;
      }

      .fc-daygrid-day-frame {
        position: relative;

        width: 100%;
        height: 100%;
        min-height: 32px;
      }

      .fc-daygrid-day-top {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;

        align-items: center;
        justify-content: center;

        .fc-daygrid-day-number {
          color: var(--button-text-graphite-priory-text);
        }
      }
    }

    /* for multiple day events */
    .fc-daygrid-day-events {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      z-index: -1;

      margin: 0;

      .fc-daygrid-event-harness {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        .fc-h-event {
          height: 100%;

          border: none;
          margin: 0;

          &.fc-event-start {
            border-top-left-radius: 17px;
            border-bottom-left-radius: 17px;
          }

          &.fc-event-end {
            border-top-right-radius: 17px;
            border-bottom-right-radius: 17px;
          }

          &.reserved {
            background-color: var(--secondary-noun-240);
          }

          &.rented {
            background-color: var(--primary-statuses-pink-360);
          }
        }

        .fc-event-main {
          height: 100%;
        }
      }
    }

    /* for single day events */
    .fc-event.fc-event-start.fc-event-end.fc-daygrid-event.fc-daygrid-dot-event {
      width: 35px;
      height: 35px;

      .fc-daygrid-event-dot {
        display: none;
      }

      margin: 0 2px 0 0;
      border-radius: 50%;

      &.reserved {
        background-color: var(--secondary-noun-240);
      }

      &.rented {
        background-color: var(--primary-statuses-pink-360);
      }
    }
  }
`;

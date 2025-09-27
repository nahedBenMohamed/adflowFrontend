import styled, { css } from 'styled-components';

interface CalendarPeriodControlTitleProps {
  $active?: boolean;
  $clickable?: boolean;
}

export const CalendarPeriodControlTitle = styled.div<CalendarPeriodControlTitleProps>`
  min-width: 168px;
  height: fit-content;

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

  ${p =>
    p.$clickable &&
    css`
      transition: var(--transition-200);

      &:hover {
        cursor: pointer;

        border-color: var(--button-text-graphite-secondary-text);
      }

      &:active {
        border-color: var(--button-text-graphite-secondary-text);
      }
    `}

  ${p =>
    p.$active &&
    css`
      border-color: var(--button-text-graphite-primary-text);

      &:hover {
        border-color: var(--button-text-graphite-primary-text);
      }
    `}
`;

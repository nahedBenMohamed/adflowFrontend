import { DatePicker } from '@mantine/dates';
import styled from 'styled-components';

export const StyledDatePicker = styled(DatePicker)`
  .mantine-UnstyledButton-root {
    color: var(--button-text-graphite-priory-text);
    transition: background-color var(--transition-200);

    &[data-outside] {
      color: var(--graphite-graphite-360);
    }

    &[data-disabled] {
      color: var(--graphite-graphite-360);

      background-color: var(--graphite-graphite-20);

      &:hover {
        background-color: var(--graphite-graphite-20);
      }
    }

    &[data-in-range],
    &[data-selected] {
      color: var(--primary-statuses-white-0);

      background-color: var(--button-text-green-default);

      &:hover {
        background-color: var(--button-text-green-hover);
      }
    }

    &:hover {
      background-color: #f3fded;
    }
  }

  .mantine-DatePicker-weekday {
    color: var(--button-text-graphite-secondary-text);
  }
`;

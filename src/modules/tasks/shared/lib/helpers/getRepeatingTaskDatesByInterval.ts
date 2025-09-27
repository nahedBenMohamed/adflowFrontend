import { generalSettingsStore } from '@/app';
import { UtcDate } from '@/shared';
import type { CreateTaskDto } from '../../../api';
import { RepeatingTaskInterval } from '../types';

// generates another task start date and end date based on provided interval and count
function* repeatingTasksByInterval({
  startDate,
  endDate,
  count,
  interval,
}: {
  startDate?: UtcDate;
  endDate?: UtcDate;
  count: number;
  interval: RepeatingTaskInterval;
}): Generator<{ startDate?: UtcDate; endDate?: UtcDate }> {
  let currentStart = startDate?.clone();
  let currentEnd = endDate?.clone();

  for (let i = 0; i < count; i++) {
    yield {
      startDate: currentStart,
      endDate: currentEnd,
    };

    // increment dates by interval
    switch (interval) {
      case RepeatingTaskInterval.DAY: {
        currentStart = currentStart?.addDays(1);
        currentEnd = currentEnd?.addDays(1);

        break;
      }

      case RepeatingTaskInterval.WEEK: {
        currentStart = currentStart?.addWeeks(1);
        currentEnd = currentEnd?.addWeeks(1);

        break;
      }

      case RepeatingTaskInterval.MONTH: {
        currentStart = currentStart?.addMonths(1);
        currentEnd = currentEnd?.addMonths(1);

        break;
      }

      case RepeatingTaskInterval.NONE: {
        continue;
      }

      default:
        throw new Error('Failed to generate repeating task: invalid interval provided');
    }

    // if we get to non-working day
    while (
      currentStart &&
      generalSettingsStore.nonWorkingDaysAsNumberArray?.includes(currentStart.dayOfWeek)
    ) {
      currentStart = currentStart.addDays(1);
      currentEnd = currentEnd?.addDays(1);
    }
  }
}

export const getRepeatingTaskDatesByInterval = ({
  dto,
  count,
  interval,
}: {
  dto: CreateTaskDto;
  count: number;
  interval: RepeatingTaskInterval;
}): CreateTaskDto[] =>
  Array.from(
    repeatingTasksByInterval({
      startDate: UtcDate.parseISONullable(dto.startDate) ?? undefined,
      endDate: UtcDate.parseISONullable(dto.endDate) ?? undefined,
      count,
      interval,
    })
  ).map(dates => ({
    ...dto,
    startDate: dates.startDate?.formatISO() ?? null,
    endDate: dates.endDate?.formatISO() ?? null,
  }));

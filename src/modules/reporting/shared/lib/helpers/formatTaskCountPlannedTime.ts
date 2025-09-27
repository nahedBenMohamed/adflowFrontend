import type { TFunction } from 'i18next';
import type { ProjectReportItem } from '../models';
import { secondsToHoursAndMinutes } from './secondsToHoursAndMinutes';

export const formatTaskCountPlannedTime = ({
  taskCountPlannedTime,
  t,
}: {
  taskCountPlannedTime?: ProjectReportItem;
  t: TFunction;
}): string =>
  `${taskCountPlannedTime?.taskCount ?? 0} | ${secondsToHoursAndMinutes({
    seconds: taskCountPlannedTime?.plannedTime,
    t,
  })}`;

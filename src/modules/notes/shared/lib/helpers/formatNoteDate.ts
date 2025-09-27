import { UtcDate } from '@/shared';

export const formatNoteDate = ({
  date,
  justNow,
  prefix,
}: {
  date: UtcDate;
  justNow: string;
  prefix?: string;
}): string => {
  const now = UtcDate.now();
  let calculatedString: string;

  if (date.diffMinutes(now) < 1) {
    calculatedString = justNow;
  } else if (date.isToday()) {
    calculatedString = date.displayTime();
  } else {
    calculatedString = date.toString();
  }

  return `${prefix ?? ''}${calculatedString}`;
};

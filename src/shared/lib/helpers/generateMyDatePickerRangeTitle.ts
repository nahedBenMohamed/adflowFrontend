import { type UtcDatesRangeValue } from '../models';
import { type Optional } from '../types';

export const generateMyDatePickerRangeTitle = (values: UtcDatesRangeValue): Optional<string> => {
  const [from, to] = values;

  if (from && !to) {
    return from.displayShort() + ' - ...';
  }

  if (!from && to) {
    return '... - ' + to.displayShort();
  }

  if (from && to) {
    if (from.diffDays(to) < 1) {
      return from.displayShort();
    }

    return `${from.displayShort()} - ${to.displayShort()}`;
  }

  return;
};

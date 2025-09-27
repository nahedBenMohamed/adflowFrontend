import { type UtcDateValue } from '../models';
import { type Optional } from '../types';

export const generateMyDatePickerTitle = (date: UtcDateValue): Optional<string> => {
  if (!date) {
    return;
  }

  return date.displayShort();
};

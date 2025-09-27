import type { BusinessHours, Option } from '../models';
import type { TimePickerSelectStep } from '../types';

export class TimePickerUtil {
  static generateTimeOptions({
    step,
    businessHours,
  }: {
    step: TimePickerSelectStep;
    businessHours?: BusinessHours;
  }): Option<string>[] {
    const options: Option<string>[] = [];

    let currentTimeMinutes;
    let endTimeMinutes;

    if (businessHours) {
      const { from, to } = businessHours;

      // Split the 'from' and 'to' times into hours and minutes
      const [fromHours, fromMinutes] = from.split(':').map(Number);
      const [toHours, toMinutes] = to.split(':').map(Number);

      if (
        fromHours === undefined ||
        fromMinutes === undefined ||
        toHours === undefined ||
        toMinutes === undefined
      )
        throw new Error(
          `Invalid business hours, failed to generateTimeOptions, received: ${businessHours}`
        );

      // calculate the total minutes for 'from' and 'to'
      currentTimeMinutes = fromHours * 60 + fromMinutes;
      endTimeMinutes = toHours * 60 + toMinutes;
    } else {
      currentTimeMinutes = 0 * 60;
      endTimeMinutes = 24 * 60 - 1;
    }

    // loop while the current time is less than or equal to the 'to' time
    while (currentTimeMinutes <= endTimeMinutes) {
      const formattedTime = `${String(Math.floor(currentTimeMinutes / 60)).padStart(
        2,
        '0'
      )}:${String(currentTimeMinutes % 60).padStart(2, '0')}`;

      options.push({ label: formattedTime, value: formattedTime });

      currentTimeMinutes += step;

      // ensure we don't go beyond the 'to' time
      if (currentTimeMinutes > endTimeMinutes) break;
    }

    return options;
  }

  // timeString should be in the format of 'HH:mm'
  static calculateTotalMinutesInTimeString = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);

    if (hours === undefined || minutes === undefined)
      throw new Error(
        `Invalid timeString format, can calculate totalMinutes for HH:mm format strings, received: ${timeString}`
      );

    return hours * 60 + minutes;
  };
}

import { Time, UtcDate } from '@/shared';
import { type Optional } from '../types';

interface DHMS {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export class ConvertTimeUtil {
  static secondsInMinute = 60;
  static secondsInHour = this.secondsInMinute * 60;
  static secondsInDay = this.secondsInHour * 24;

  static msInMinute = 60000;
  static msInFifteenMinutes = this.msInMinute * 15;
  static msInHour = this.msInMinute * 60;
  static msInDay = this.msInHour * 24;
  static msInWeek = this.msInDay * 7;

  static getMinutesFromSeconds(seconds: number): number {
    return Math.floor(seconds / this.secondsInMinute);
  }

  static getDaysFromSeconds(seconds: number): number {
    return Math.floor(seconds / this.secondsInDay);
  }

  static getHoursFromSeconds(seconds: number): number {
    return Math.floor(seconds / this.secondsInHour);
  }

  static getHoursAndMinutesFromSeconds(seconds: number): { hours: number; minutes: number } {
    return {
      hours: Math.floor(seconds / this.secondsInHour),
      minutes: Math.floor((seconds % this.secondsInHour) / this.secondsInMinute),
    };
  }

  static getSecondsFromHours(hours: number): number {
    return hours * this.secondsInHour;
  }

  static getDayHoursFromSeconds(seconds: number): number {
    return Math.floor((seconds % this.secondsInDay) / this.secondsInHour);
  }

  static getDayMinutesFromSeconds(seconds: number): number {
    return Math.floor((seconds % this.secondsInHour) / this.secondsInMinute);
  }

  static getRemainingSecondsFromSeconds(seconds: number): number {
    return Math.round(seconds % this.secondsInMinute);
  }

  static getSecondsInDays = (numberOfDays: number): number => {
    return numberOfDays * this.secondsInDay;
  };

  static getDHMSFromSeconds(seconds: number): DHMS {
    const days = this.getDaysFromSeconds(seconds);
    const hours = this.getDayHoursFromSeconds(seconds);
    const minutes = this.getDayMinutesFromSeconds(seconds);

    return { days, hours, minutes, seconds: this.getRemainingSecondsFromSeconds(seconds) };
  }

  static getSecondsFromHoursAndMinutes({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }): number {
    return hours * this.secondsInHour + minutes * this.secondsInMinute;
  }

  // parse hours and minutes from HH:mm string
  static parseHoursAndMinutesFromHHmmStrict(time: string): { hours: number; minutes: number } {
    const hoursStr = time.split(':')[0];
    const minutesStr = time.split(':')[1];

    if (!hoursStr || !minutesStr)
      throw new Error('Invalid time format, failed to extract hours or minutes from string');

    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (isNaN(hours) || isNaN(minutes))
      throw new Error('Invalid time format, failed to parse hours or minutes');

    return {
      hours,
      minutes,
    };
  }

  static parseHoursAndMinutesFromHHmm(time: string): Optional<{ hours: number; minutes: number }> {
    const hoursStr = time.split(':')[0];
    const minutesStr = time.split(':')[1];

    if (!hoursStr || !minutesStr) return;

    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (isNaN(hours) || isNaN(minutes)) return;

    return {
      hours,
      minutes,
    };
  }

  static generateTimeSlots({ startTime, endTime }: { startTime: string; endTime: string }): Time[] {
    const slots: Time[] = [];

    let start = this.getSecondsFromHoursAndMinutes(
      this.parseHoursAndMinutesFromHHmmStrict(startTime)
    );
    const end = this.getSecondsFromHoursAndMinutes(
      this.parseHoursAndMinutesFromHHmmStrict(endTime)
    );
    const interval = 30 * this.secondsInMinute;

    while (start + interval <= end) {
      const slotEnd = start + interval;

      slots.push({
        label: `${UtcDate.now().startOfDay().addSeconds(start).displayTime()} — ${UtcDate.now().startOfDay().addSeconds(slotEnd).displayTime()}`,
        startTime: start,
        endTime: slotEnd,
      });

      start = slotEnd;
    }

    return slots;
  }
}

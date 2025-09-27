import { eachWeekOfInterval } from 'date-fns';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/pl';
import 'dayjs/locale/ru';
import arraySupport from 'dayjs/plugin/arraySupport';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import dayjs_tz from 'dayjs/plugin/timezone';
import dayjs_utc from 'dayjs/plugin/utc';
import type { Nullable, Optional } from '../types';
import type { BusinessHours } from './BusinessHours';
import type { DateFormat } from './DateFormat';
import { Language } from './Language';

dayjs.extend(dayjs_utc);
dayjs.extend(dayjs_tz);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.extend(arraySupport);
dayjs.extend(localizedFormat);

export const FULL_DATE_FORMAT = 'DD.MM.YYYY HH:mm';
const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const LOCALIZED_SHORT_FORMAT = 'L';
const LOCALIZED_LONG_FORMAT = 'LL';
const LOCALIZED_TIME_FORMAT = 'LT';
const LOCALIZED_FULL_DATE_FORMAT = 'LLL';

export class UtcDate {
  private static _locale: Language = Language.ENGLISH;
  private static _format: Nullable<DateFormat> = null;

  // in seconds
  private _timestamp: number = 0;

  constructor(timestamp: number) {
    this._timestamp = timestamp;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get timestampMs(): number {
    return this._timestamp * 1000;
  }

  get seconds(): number {
    return this.dayjs().second();
  }

  get minutes(): number {
    return this.dayjs().minute();
  }

  get hours(): number {
    return this.dayjs().hour();
  }

  get day(): number {
    return this.dayjs().date();
  }

  get dayOfWeek(): number {
    return this.dayjs().day();
  }

  get week(): number {
    return this.dayjs().isoWeek();
  }

  get month(): number {
    return this.dayjs().month();
  }

  get canonicalMonth(): number {
    return this.month + 1;
  }

  get quarter(): number {
    return this.dayjs().quarter();
  }

  get year(): number {
    return this.dayjs().year();
  }

  get daysInCurrentMonth(): number {
    return this.dayjs().daysInMonth();
  }

  static create({
    year,
    month,
    day,
    hours,
    minutes,
  }: {
    year: number;
    // month are starting from 0
    month: number;
    day: number;
    hours?: number;
    minutes?: number;
  }): UtcDate {
    if (hours && minutes) {
      return new UtcDate(dayjs.utc([year, month, day, hours, minutes]).unix());
    } else {
      return new UtcDate(dayjs.utc([year, month, day]).unix());
    }
  }

  static createWithoutUnix({
    year,
    month,
    day,
    hours,
    minutes,
  }: {
    year: number;
    // month are starting from 0
    month: number;
    day: number;
    hours?: number;
    minutes?: number;
  }): UtcDate {
    if (hours && minutes) {
      return new UtcDate(dayjs([year, month, day, hours, minutes]).utc(false).valueOf() / 1000);
    } else {
      return new UtcDate(dayjs([year, month, day]).utc(false).valueOf() / 1000);
    }
  }

  static fromDayjs(dayjs: Dayjs): UtcDate {
    return new UtcDate(dayjs.unix());
  }

  static fromTimestamp(timestamp: number): UtcDate {
    return new UtcDate(timestamp);
  }

  static fromNullableTimestamp(timestamp: Nullable<number>): Nullable<UtcDate> {
    return timestamp ? this.fromTimestamp(timestamp) : null;
  }

  static fromTimestampMs(timestamp: number): UtcDate {
    return new UtcDate(timestamp / 1000);
  }

  static fromDate(date: Date): UtcDate {
    return new UtcDate(date.getTime() / 1000);
  }

  static fromNullableDate(date: Nullable<Date>): Nullable<UtcDate> {
    return date ? this.fromDate(date) : null;
  }

  static setLocale(locale: Language): void {
    this._locale = locale;
  }

  static setFormat(format: Nullable<DateFormat>): void {
    this._format = format;
  }

  static now(): UtcDate {
    return new UtcDate(dayjs().unix());
  }

  static nowISO = (): string => {
    return this.now().formatISO();
  };

  static nowWithoutUnix(): UtcDate {
    return new UtcDate(dayjs().utc(false).valueOf() / 1000);
  }

  static startOfCurrentDay = (): UtcDate => {
    return this.now().startOfDay();
  };

  static startOfNextDay = (): UtcDate => {
    return this.now().addDays(1).startOfDay();
  };

  static endOfCurrentDay = (): UtcDate => {
    return this.now().endOfDay();
  };

  static dayAgo(): UtcDate {
    return UtcDate.now().subtractDays(1);
  }

  static dayAfter(): UtcDate {
    return UtcDate.now().addDays(1);
  }

  // parse in ISO_8601
  static parseISO(date: Nullable<string>): UtcDate {
    return this.fromDayjs(dayjs.utc(date));
  }

  static parseHoursStringToSeconds(hours: string): number {
    const [hoursStr, minutesStr] = hours.split(':');

    if (!hoursStr || !minutesStr) {
      throw new Error('Failed to extract hours or minutes from string');
    }

    const hoursNumber = Number(hoursStr);
    const minutesNumber = Number(minutesStr);

    if (isNaN(hoursNumber) || isNaN(minutesNumber))
      throw new Error('Failed to parse hours string to seconds');

    return hoursNumber * 60 * 60 + minutesNumber * 60;
  }

  static secondsToHoursString(seconds: number): string {
    const hours = Math.floor(seconds / 60 / 60);
    const minutes = Math.floor((seconds - hours * 60 * 60) / 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // parse in ISO_8601
  static parseISOWithoutUnix(date: Nullable<string>): UtcDate {
    return this.fromDayjs(dayjs(date));
  }

  static parseISONullable(date: Optional<Nullable<string>>): Nullable<UtcDate> {
    return date ? this.parseISO(date) : null;
  }

  static isEqual(date1: UtcDate, date2: UtcDate): boolean {
    return date1.equals(date2);
  }

  static getMinDate(): UtcDate {
    return new UtcDate(0);
  }

  static startOfMonth(month: number): UtcDate {
    return new UtcDate(dayjs().month(month).startOf('month').unix());
  }

  static endOfMonth(month: number): UtcDate {
    return new UtcDate(dayjs().month(month).endOf('month').unix());
  }

  static startOfYear(year: number): UtcDate {
    return new UtcDate(dayjs().year(year).startOf('year').unix());
  }

  static endOfYear(year: number): UtcDate {
    return new UtcDate(dayjs().year(year).endOf('year').unix());
  }

  static eachWeekOfInterval({ start, end }: { start: UtcDate; end: UtcDate }): Date[] {
    return eachWeekOfInterval({ start: start.toDate(), end: end.toDate() });
  }

  static endOfNextDay(): UtcDate {
    return this.now().addDays(1).endOfDay();
  }

  static localBusinessHours({
    utcBusinessHours,
    timezone,
  }: {
    utcBusinessHours: BusinessHours;
    timezone: string;
  }): BusinessHours {
    if (!timezone) return utcBusinessHours;

    const currentDate = UtcDate.now();

    const startDateSeconds = UtcDate.parseHoursStringToSeconds(utcBusinessHours.from);
    const endDateSeconds = UtcDate.parseHoursStringToSeconds(utcBusinessHours.to);

    const timezoneDifference = currentDate.getTimezoneDifference(timezone);

    const startDate = currentDate.startOfDay().addSeconds(startDateSeconds + timezoneDifference);
    const endDate = currentDate.startOfDay().addSeconds(endDateSeconds + timezoneDifference);

    return { from: startDate.format('HH:mm'), to: endDate.format('HH:mm') };
  }

  static isEnglishLocale = (): boolean => {
    return UtcDate._locale === Language.ENGLISH;
  };

  isBeforeOrEqual = (anotherDate: UtcDate): boolean => {
    return this.lessOrEqualThan(anotherDate);
  };

  isAfterOrEqual = (anotherDate: UtcDate): boolean => {
    return this.greaterOrEqualThan(anotherDate);
  };

  isBetween = ({ start, end }: { start: UtcDate; end: UtcDate }): boolean => {
    return this.isBeforeOrEqual(end) && this.isAfterOrEqual(start);
  };

  clone = (): UtcDate => {
    return new UtcDate(this.timestamp);
  };

  startOfDay = (): UtcDate => {
    return new UtcDate(this.dayjs().startOf('date').unix());
  };

  startOfWeek = (): UtcDate => {
    return new UtcDate(this.dayjs().startOf('week').unix());
  };

  endOfWeek = (): UtcDate => {
    return new UtcDate(this.dayjs().endOf('week').unix());
  };

  startOfQuarter = (): UtcDate => {
    return new UtcDate(this.dayjs().startOf('quarter').unix());
  };

  endOfQuarter = (): UtcDate => {
    return new UtcDate(this.dayjs().endOf('quarter').unix());
  };

  endOfDay = (): UtcDate => {
    return new UtcDate(this.dayjs().endOf('date').unix());
  };

  startOfMonth = (): UtcDate => {
    return new UtcDate(this.dayjs().startOf('month').unix());
  };

  endOfMonth = (): UtcDate => {
    return new UtcDate(this.dayjs().endOf('month').unix());
  };

  startOfYear = (): UtcDate => {
    return new UtcDate(this.dayjs().startOf('year').unix());
  };

  endOfYear = (): UtcDate => {
    return new UtcDate(this.dayjs().endOf('year').unix());
  };

  // to use in locale keys or ids where localization is redundant
  formatWithoutLocale = (format: string): string => {
    return this.dayjs().format(format);
  };

  format = (format: string): string => {
    return this.dayjs().locale(UtcDate._locale).format(format);
  };

  formatWithoutUnix = (format: string): string => {
    return dayjs(this.timestamp * 1000)
      .utc(false)
      .locale(UtcDate._locale)
      .format(format);
  };

  formatISO = (): string => {
    return this.dayjs().utc(false).format(ISO_FORMAT);
  };

  formatISOWithoutUnix = (): string => {
    // for specific cases when we do not need to apply local utc offset to output iso date string
    return dayjs(this.timestamp * 1000).format(ISO_FORMAT);
  };

  displayShort = (): string => {
    return this.format(UtcDate._format ?? LOCALIZED_SHORT_FORMAT);
  };

  displayLong = (): string => {
    return this.format(LOCALIZED_LONG_FORMAT);
  };

  displayLongWithoutYear = (): string => {
    // in spanish date consists of 3 parts: 20 de enero
    // in other languages 2 parts: 31 january
    const partsCount = UtcDate._locale === Language.SPANISH ? 3 : 2;

    const dateString = this.displayLong().split(' ').slice(0, partsCount).join(' ');

    if (dateString.endsWith(',')) {
      return dateString.slice(0, -1);
    } else {
      return dateString;
    }
  };

  displayTime = (): string => {
    return this.format(LOCALIZED_TIME_FORMAT);
  };

  dayjs = (): Dayjs => {
    return dayjs.unix(this.timestamp);
  };

  addTimestamp = (timestamp: number): UtcDate => {
    return new UtcDate(this.timestamp + timestamp);
  };

  addMonths = (months: number): UtcDate => {
    return new UtcDate(this.dayjs().add(months, 'months').unix());
  };

  addYears = (years: number): UtcDate => {
    return new UtcDate(this.dayjs().add(years, 'years').unix());
  };

  subtractHours = (hours: number): UtcDate => {
    return new UtcDate(this.dayjs().subtract(hours, 'hours').unix());
  };

  subtractDays = (days: number): UtcDate => {
    return new UtcDate(this.dayjs().subtract(days, 'days').unix());
  };

  subtractMonths = (months: number): UtcDate => {
    return new UtcDate(this.dayjs().subtract(months, 'months').unix());
  };

  subtractMinutes = (minutes: number): UtcDate => {
    return new UtcDate(this.dayjs().subtract(minutes, 'minutes').unix());
  };

  addDays = (days: number): UtcDate => {
    return new UtcDate(this.dayjs().add(days, 'days').unix());
  };

  addWeeks = (weeks: number): UtcDate => {
    return new UtcDate(this.dayjs().add(weeks, 'weeks').unix());
  };

  addQuarters = (quarters: number): UtcDate => {
    return new UtcDate(this.dayjs().add(quarters, 'quarters').unix());
  };

  addMinutes = (minutes: number): UtcDate => {
    return new UtcDate(this.dayjs().add(minutes, 'minutes').unix());
  };

  addHours = (hours: number): UtcDate => {
    return new UtcDate(this.dayjs().add(hours, 'hours').unix());
  };

  addMilliseconds = (ms: number): UtcDate => {
    return new UtcDate(this.dayjs().add(ms, 'milliseconds').unix());
  };

  addHoursWithoutUnix = (hours: number): UtcDate => {
    return new UtcDate(this.dayjs().add(hours, 'hours').utc(false).valueOf() / 1000);
  };

  addSeconds = (seconds: number): UtcDate => {
    return new UtcDate(this.dayjs().add(seconds, 'seconds').unix());
  };

  getMinutesString = (): string => {
    const minutes = this.minutes;

    return minutes < 10 ? `0${minutes}` : `${minutes}`;
  };

  getHoursString = (): string => {
    const hours = this.hours;

    return hours < 10 ? `0${hours}` : `${hours}`;
  };

  setDayOfWeek = (dayOfWeek: number): UtcDate => {
    return new UtcDate(this.dayjs().day(dayOfWeek).unix());
  };

  setMonth = (month: number): UtcDate => {
    return new UtcDate(this.dayjs().month(month).unix());
  };

  setHours = (hours: number): UtcDate => {
    return new UtcDate(this.dayjs().hour(hours).unix());
  };

  setMinutes = (minutes: number): UtcDate => {
    return new UtcDate(this.dayjs().minute(minutes).unix());
  };

  setSeconds = (seconds: number): UtcDate => {
    return new UtcDate(this.dayjs().second(seconds).unix());
  };

  isToday = (): boolean => {
    const now = UtcDate.now();

    return this.greaterOrEqualThan(now.startOfDay()) && now.endOfDay().greaterThan(this);
  };

  isYesterday = (): boolean => {
    const yesterday = UtcDate.dayAgo();

    return (
      this.greaterOrEqualThan(yesterday.startOfDay()) && yesterday.endOfDay().greaterThan(this)
    );
  };

  isTomorrow = (): boolean => {
    const tomorrow = UtcDate.dayAfter();

    return this.greaterOrEqualThan(tomorrow.startOfDay()) && tomorrow.endOfDay().greaterThan(this);
  };

  isUpcoming = (): boolean => {
    const tomorrow = UtcDate.dayAfter();

    return this.greaterThan(tomorrow.endOfDay());
  };

  isExpired = (): boolean => {
    return UtcDate.now().greaterOrEqualThan(this);
  };

  equals = (anotherDate: UtcDate): boolean => {
    return this.timestamp === anotherDate.timestamp;
  };

  greaterThan = (anotherDate: UtcDate): boolean => {
    return this.timestamp > anotherDate.timestamp;
  };

  greaterOrEqualThan = (anotherDate: UtcDate): boolean => {
    return this.timestamp >= anotherDate.timestamp;
  };

  lessOrEqualThan = (anotherDate: UtcDate): boolean => {
    return this.timestamp <= anotherDate.timestamp;
  };

  diff = (another: UtcDate, isAbsolute: boolean = true): number => {
    return isAbsolute
      ? Math.abs(this.timestamp - another.timestamp)
      : this.timestamp - another.timestamp;
  };

  diffMinutes = (another: UtcDate, isAbsolute: boolean = true): number => {
    return this.diff(another, isAbsolute) / 60;
  };

  diffHours = (another: UtcDate, isAbsolute: boolean = true): number => {
    return this.diff(another, isAbsolute) / 3600;
  };

  diffDays = (another: UtcDate, isAbsolute: boolean = true): number => {
    return this.diff(another, isAbsolute) / 86400;
  };

  toString = (): string => {
    return this.format(LOCALIZED_FULL_DATE_FORMAT);
  };

  toDate = (): Date => {
    return new Date(this.timestamp * 1000);
  };

  isSameDay = (anotherDate: UtcDate): boolean => {
    return this.dayjs().isSame(anotherDate.dayjs(), 'day');
  };

  isBefore = (anotherDate: UtcDate): boolean => {
    return this.dayjs().isBefore(anotherDate.dayjs());
  };

  isAfter = (anotherDate: UtcDate): boolean => {
    return this.dayjs().isAfter(anotherDate.dayjs());
  };

  endOfHour = (): UtcDate => {
    return new UtcDate(this.dayjs().endOf('hour').unix());
  };

  startOfHour = (): UtcDate => {
    return new UtcDate(this.dayjs().startOf('hour').unix());
  };

  startOfMinute = (): UtcDate => {
    return new UtcDate(this.dayjs().startOf('minute').unix());
  };

  endOfMinute = (): UtcDate => {
    return new UtcDate(this.dayjs().endOf('minute').unix());
  };

  isEqual = (anotherDate: UtcDate): boolean => {
    return this.timestamp === anotherDate.timestamp;
  };

  getTimezoneDifference = (targetTimezone: string): number => {
    // some timezones can be unrecognized by browser
    try {
      const targetFromUtcOffset = dayjs().tz(targetTimezone).utcOffset();
      const currentFromUtcOffset = dayjs().tz(dayjs.tz.guess()).utcOffset();

      // multiply by 60 to get seconds (utcOffset is in minutes)
      return (currentFromUtcOffset - targetFromUtcOffset) * 60;
    } catch (e) {
      console.error(`Unrecognized timezone in getTimezoneDifference: ${targetTimezone}`);

      return 0;
    }
  };
}

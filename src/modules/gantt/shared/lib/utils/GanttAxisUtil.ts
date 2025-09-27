import { generalSettingsStore } from '@/app';
import { UtcDate } from '@/shared';
import type { TFunction } from 'i18next';
import type { Major, MajorAmp, Minor, MinorAmp } from '../models';
import type { GanttView } from '../types';

const firstYearHalf = new Set([0, 1, 2, 3, 4, 5]);

export class GanttAxisUtil {
  static getMajorList({
    t,
    view,
    pxUnitAmp,
    durationAmp,
    translateAmp,
    epochOffset,
  }: {
    t: TFunction;
    view: GanttView;
    pxUnitAmp: number;
    durationAmp: number;
    translateAmp: number;
    epochOffset: number;
  }): Major[] {
    const majorFormatMap: Record<GanttView, string> = {
      'fifteen-minutes': t('major_format.fifteen_minutes'),
      hour: t('major_format.hour'),
      day: t('major_format.day'),
      week: t('major_format.week'),
      month: t('major_format.month'),
      quarter: t('major_format.quarter'),
      'half-year': t('major_format.half_year'),
    };

    const startAmp = translateAmp + epochOffset;
    const endAmp = startAmp + durationAmp;

    const format = majorFormatMap[view];

    const getNextDate = (start: UtcDate): UtcDate => {
      switch (view) {
        case 'fifteen-minutes':
        case 'hour':
          return start.addDays(1);

        case 'day':
        case 'week':
          return start.addMonths(1);

        default:
          return start.addYears(1);
      }
    };

    const getStart = (date: UtcDate): UtcDate => {
      switch (view) {
        case 'fifteen-minutes':
        case 'hour':
          return date.startOfDay();

        case 'day':
        case 'week':
          return date.startOfMonth();

        default:
          return date.startOfYear();
      }
    };

    const getEnd = (date: UtcDate): UtcDate => {
      switch (view) {
        case 'fifteen-minutes':
        case 'hour':
          return date.endOfDay();

        case 'day':
        case 'week':
          return date.endOfMonth();

        default:
          return date.endOfYear();
      }
    };

    let currentDate = UtcDate.fromTimestampMs(startAmp);

    const majorAmpList: MajorAmp[] = [];

    // Iterate through the visible dates range and create major dates
    while (
      currentDate.isBetween({
        start: UtcDate.fromTimestampMs(startAmp - 2),
        end: UtcDate.fromTimestampMs(endAmp + 2),
      })
    ) {
      const majorKey = currentDate.format(format);

      let start = currentDate;
      const end = getEnd(start);

      if (majorAmpList.length > 0) start = getStart(currentDate);

      majorAmpList.push({
        label: majorKey,
        endDate: end,
        startDate: start,
      });

      start = getStart(currentDate);
      currentDate = getNextDate(start);
    }

    return this.majorAmp2Px({ pxUnitAmp, ampList: majorAmpList, epochOffset });
  }

  static majorAmp2Px({
    ampList,
    pxUnitAmp,
    epochOffset,
  }: {
    ampList: MajorAmp[];
    pxUnitAmp: number;
    epochOffset: number;
  }): {
    label: string;
    left: number;
    width: number;
    key: string;
  }[] {
    return ampList.map(a => {
      const { startDate } = a;
      const { endDate } = a;
      const { label } = a;
      const left = (startDate.timestampMs - epochOffset) / pxUnitAmp;
      const width = (endDate.timestampMs - startDate.timestampMs) / pxUnitAmp;

      return {
        label,
        left,
        width,
        key: startDate.format('YYYY-MM-DD HH:mm:ss'),
      };
    });
  }

  static getMinorList({
    t,
    view,
    pxUnitAmp,
    durationAmp,
    translateAmp,
    epochOffset,
  }: {
    t: TFunction;
    view: GanttView;
    pxUnitAmp: number;
    durationAmp: number;
    translateAmp: number;
    epochOffset: number;
  }): Minor[] {
    const minorFormatMap: Record<GanttView, string> = {
      'fifteen-minutes': t('minor_format.fifteen_minutes'),
      hour: t('minor_format.hour'),
      day: t('minor_format.day'),
      week: t('minor_format.week'),
      month: t('minor_format.month'),
      quarter: t('minor_format.quarter'),
      'half-year': t('minor_format.half_year'),
    };

    const startAmp = translateAmp + epochOffset;
    const endAmp = startAmp + durationAmp;

    const format = minorFormatMap[view];

    const getNextDate = (start: UtcDate): UtcDate => {
      const map: Record<GanttView, () => UtcDate> = {
        'fifteen-minutes': () => start.addMinutes(15),
        hour: () => start.addHours(1),
        day: () => start.addDays(1),
        week: () => start.addWeeks(1),
        month: () => start.addMonths(1),
        quarter: () => start.addQuarters(1),
        'half-year': () => start.addMonths(6),
      };

      return map[view]();
    };

    const setStart = (date: UtcDate): UtcDate => {
      const map: Record<GanttView, () => UtcDate> = {
        'fifteen-minutes': () => {
          const minutes = date.minutes;
          const remainder = minutes % 15;

          return date.subtractMinutes(remainder);
        },
        hour: () => date.startOfHour(),
        day: () => date.startOfDay(),
        week: () => date.startOfWeek(),
        month: () => date.startOfMonth(),
        quarter: () => date.startOfQuarter(),
        'half-year': () => {
          if (firstYearHalf.has(date.month)) return date.setMonth(0).startOfMonth();

          return date.setMonth(6).startOfMonth();
        },
      };

      return map[view]();
    };

    const setEnd = (start: UtcDate): UtcDate => {
      const map: Record<GanttView, () => UtcDate> = {
        'fifteen-minutes': () => start.addMinutes(15),
        hour: () => start.endOfHour(),
        day: () => start.endOfDay(),
        week: () => start.endOfWeek(),
        month: () => start.endOfMonth(),
        quarter: () => start.endOfQuarter(),
        'half-year': () => {
          if (firstYearHalf.has(start.month)) return start.setMonth(5).endOfMonth();

          return start.setMonth(11).endOfMonth();
        },
      };

      return map[view]();
    };

    let currentDate = UtcDate.fromTimestampMs(startAmp);

    const minorAmpList: MinorAmp[] = [];

    const getLabel = ({ date, format }: { date: UtcDate; format: string }): string => {
      if (view === 'half-year')
        return `${date.format(format)}${firstYearHalf.has(date.month) ? 1 : 2}`;

      return date.format(format);
    };

    // Iterate through the visible dates range and create minor dates
    while (
      currentDate.isBetween({
        start: UtcDate.fromTimestampMs(startAmp - 1),
        end: UtcDate.fromTimestampMs(endAmp + 1),
      })
    ) {
      const start = setStart(currentDate);
      const end = setEnd(start);

      minorAmpList.push({
        endDate: end,
        startDate: start,
        label: getLabel({ date: start, format }),
      });

      currentDate = getNextDate(start);
    }

    return this.minorAmp2Px({ ampList: minorAmpList, pxUnitAmp, view: view, epochOffset });
  }

  static minorAmp2Px({
    ampList,
    pxUnitAmp,
    view,
    epochOffset,
  }: {
    ampList: MinorAmp[];
    pxUnitAmp: number;
    view: GanttView;
    epochOffset: number;
  }): Minor[] {
    return ampList.map(item => {
      const { startDate } = item;
      const { endDate } = item;

      const { label } = item;
      const left = (startDate.timestampMs - epochOffset) / pxUnitAmp;
      const width = (endDate.timestampMs - startDate.timestampMs) / pxUnitAmp;

      let isWeekend = false;

      if (view === 'day') {
        const { workingDaysAsNumberArray } = generalSettingsStore;
        const dayOfWeek = startDate.dayOfWeek;

        if (workingDaysAsNumberArray) isWeekend = !workingDaysAsNumberArray.includes(dayOfWeek);
      }

      return {
        label,
        left,
        width,
        isWeekend,
        key: startDate.format('YYYY-MM-DD HH:mm:ss'),
      };
    });
  }
}

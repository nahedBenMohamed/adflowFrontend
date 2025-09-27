import { MonthUtil, UtcDate, type Optional } from '@/shared';
import type { ColumnDef } from '@tanstack/react-table';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ComparativeCompositeHeader,
  ComparativeReportValueCell,
  HeadTitleCellWithToggle,
  RowTitleCell,
} from '../../../components';
import { generateArrayOfYearsFromAccountCreation } from '../../../helpers';
import {
  ComparativeReportType,
  ReportsColumnsIds,
  type ComparativeReportCell,
  type ComparativeReportValue,
} from '../../../models';
import { type ComparativeReportSyntheticRow } from '../../../types';

interface ColumnDay {
  day: number;
  dayName: string;
  monthName: string;
  year: string;
}

interface ByWeeksGenerationResultDate {
  day: string;
  monthName: string;
}

interface ByWeeksGenerationResult {
  year: string;
  endDate: ByWeeksGenerationResultDate;
  startDate: ByWeeksGenerationResultDate;
  weekNumber: string;
  relativeWeekNumber: string;
}

export const useGetComparativeReportColumns = ({
  dateNow,
  // current month comes here 0-based, so January is 0, February is 1, etc.
  currentMonth,
  currentYear,
  reportType,
}: {
  dateNow: UtcDate;
  currentMonth: number;
  currentYear: number;
  reportType: ComparativeReportType;
}): ColumnDef<ComparativeReportSyntheticRow>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_comparative_report_columns',
  });

  return useMemo<ColumnDef<ComparativeReportSyntheticRow>[]>(() => {
    let columns: ColumnDef<ComparativeReportSyntheticRow>[] = [];

    const generateSubColumns = (
      numericPeriod: number,
      accessorFn: (r: ComparativeReportSyntheticRow) => Optional<ComparativeReportCell>
    ): ColumnDef<ComparativeReportSyntheticRow>[] => [
      {
        id: `all-${numericPeriod}`,
        header: t('all'),
        accessorFn: r => accessorFn(r)?.all,
        cell: info => (
          <ComparativeReportValueCell
            rowType={info.row.original.type}
            value={info.getValue() as Optional<ComparativeReportValue>}
          />
        ),
      },
      {
        id: `open-${numericPeriod}`,
        header: t('open'),
        accessorFn: r => accessorFn(r)?.open,
        cell: info => (
          <ComparativeReportValueCell
            rowType={info.row.original.type}
            value={info.getValue() as Optional<ComparativeReportValue>}
          />
        ),
      },
      {
        id: `won-${numericPeriod}`,
        header: t('won'),
        accessorFn: r => accessorFn(r)?.won,
        cell: info => (
          <ComparativeReportValueCell
            rowType={info.row.original.type}
            value={info.getValue() as Optional<ComparativeReportValue>}
          />
        ),
      },
      {
        id: `lost-${numericPeriod}`,
        header: t('lost'),
        accessorFn: r => accessorFn(r)?.lost,
        cell: info => (
          <ComparativeReportValueCell
            rowType={info.row.original.type}
            value={info.getValue() as Optional<ComparativeReportValue>}
          />
        ),
      },
    ];

    switch (reportType) {
      case ComparativeReportType.DAY: {
        const generateDayCellAccessor =
          (day: number) =>
          (r: ComparativeReportSyntheticRow): Optional<ComparativeReportCell> =>
            r.originalRow.cells.find(
              c =>
                c.date ===
                // backend template string includes 1-based month (January is 1, February is 2, etc.),
                // so we need to add 1 to the currentMonth
                `${dateNow.year}-${String(currentMonth + 1).padStart(2, '0')}-${String(
                  day
                ).padStart(2, '0')}`
            );

        const daysArray: ColumnDay[] = [];

        for (
          let day = 1;
          day <=
          UtcDate.create({ year: dateNow.year, month: currentMonth, day: 1 }).daysInCurrentMonth;
          day++
        ) {
          const currentDate = UtcDate.create({ year: dateNow.year, month: currentMonth, day });

          const dayName = t(`days.${currentDate.formatWithoutLocale('dddd').toLocaleLowerCase()}`);
          const monthName = t(`months.${currentDate.formatWithoutLocale('MMMM').toLowerCase()}`);
          const year = currentDate.format('YYYY');

          daysArray.push({ day, dayName, monthName, year });
        }

        columns = daysArray.map<ColumnDef<ComparativeReportSyntheticRow>>(
          ({ day, dayName, monthName, year }) => ({
            id: `day-${day}`,
            header: () => (
              <ComparativeCompositeHeader
                title={dayName}
                current={day === dateNow.day}
                additionalDate={`${monthName}, ${day} ${year}`}
              />
            ),
            columns: generateSubColumns(day, generateDayCellAccessor(day)),
          })
        );

        break;
      }

      case ComparativeReportType.WEEK: {
        const generateWeekCellAccessor =
          (week: string) =>
          (r: ComparativeReportSyntheticRow): Optional<ComparativeReportCell> =>
            r.originalRow.cells.find(
              c => c.date === `${currentYear}-${String(week).padStart(2, '0')}`
            );

        const generateWeekKeys = ({
          dateFrom,
          dateTo,
        }: {
          dateFrom: UtcDate;
          dateTo: UtcDate;
        }): ByWeeksGenerationResult[] => {
          const weekStarts = UtcDate.eachWeekOfInterval({ start: dateFrom, end: dateTo });

          return weekStarts.map((wsd, idx) => {
            const year = format(wsd, 'yyyy');

            const weekNumber = format(startOfWeek(wsd, { weekStartsOn: 1 }), 'II');

            const startMonthName = t(
              `months.${format(startOfWeek(wsd, { weekStartsOn: 1 }), 'MMMM').toLowerCase()}`
            );
            const startDay = format(startOfWeek(wsd, { weekStartsOn: 1 }), 'dd');

            const endMonthName = t(
              `months.${format(endOfWeek(wsd, { weekStartsOn: 1 }), 'MMMM').toLowerCase()}`
            );
            const endDay = format(endOfWeek(wsd, { weekStartsOn: 1 }), 'dd');

            return {
              year,
              endDate: {
                day: endDay,
                monthName: endMonthName,
              },
              startDate: {
                day: startDay,
                monthName: startMonthName,
              },
              weekNumber,
              relativeWeekNumber: String(idx + 1),
            };
          });
        };

        columns = generateWeekKeys({
          dateFrom: UtcDate.create({
            year: dateNow.year,
            month: currentMonth,
            day: 1,
          })
            .startOfMonth()
            .addDays(6),
          dateTo: UtcDate.create({ year: dateNow.year, month: currentMonth, day: 1 }).endOfMonth(),
        }).map<ColumnDef<ComparativeReportSyntheticRow>>(
          ({ startDate, endDate, relativeWeekNumber, weekNumber, year }, idx) => ({
            id: `week-${idx}`,
            columns: generateSubColumns(Number(weekNumber), generateWeekCellAccessor(weekNumber)),
            header: () => (
              <ComparativeCompositeHeader
                title={t('week', {
                  number: relativeWeekNumber,
                })}
                current={Number(weekNumber) === dateNow.week}
                additionalDate={`${startDate.monthName}, ${startDate.day} – ${endDate.day}, ${endDate.monthName} ${year}`}
              />
            ),
          })
        );

        break;
      }

      case ComparativeReportType.MONTH: {
        const generateMonthCellAccessor =
          (month: number) =>
          (r: ComparativeReportSyntheticRow): Optional<ComparativeReportCell> =>
            r.originalRow.cells.find(
              c => c.date === `${currentYear}-${String(month).padStart(2, '0')}`
            );

        columns = MonthUtil.months.map<ColumnDef<ComparativeReportSyntheticRow>>((m, idx) => ({
          id: `month-${idx}`,
          columns: generateSubColumns(idx + 1, generateMonthCellAccessor(idx + 1)),
          header: () => (
            <ComparativeCompositeHeader
              current={idx === dateNow.month}
              additionalDate={String(currentYear)}
              title={t(`months.${m.toLowerCase()}`)}
            />
          ),
        }));

        break;
      }

      case ComparativeReportType.QUARTER: {
        const generateQuarterCellAccessor =
          (quarter: number) =>
          (r: ComparativeReportSyntheticRow): Optional<ComparativeReportCell> =>
            r.originalRow.cells.find(c => c.date === `${currentYear}-${String(quarter)}`);

        columns = Array.from({ length: 4 }, (_, i) => i + 1).map<
          ColumnDef<ComparativeReportSyntheticRow>
        >(q => ({
          id: `quarter-${q}`,
          columns: generateSubColumns(q, generateQuarterCellAccessor(q)),
          header: () => (
            <ComparativeCompositeHeader
              current={q === dateNow.quarter}
              title={t('quarter', { number: q })}
              additionalDate={String(currentYear)}
            />
          ),
        }));

        break;
      }

      case ComparativeReportType.YEAR:
        const generateYearCellAccessor =
          (year: number) =>
          (r: ComparativeReportSyntheticRow): Optional<ComparativeReportCell> =>
            r.originalRow.cells.find(c => c.date === `${year}`);

        columns = generateArrayOfYearsFromAccountCreation(currentYear).map<
          ColumnDef<ComparativeReportSyntheticRow>
        >((y, idx) => ({
          id: `year-${idx}`,
          columns: generateSubColumns(y, generateYearCellAccessor(y)),
          header: () => (
            <ComparativeCompositeHeader title={String(y)} current={y === dateNow.year} />
          ),
        }));

        break;
    }

    return [
      {
        id: ReportsColumnsIds.TITLE,
        header: info => <HeadTitleCellWithToggle title={t('users')} table={info.table} />,
        cell: info => <RowTitleCell row={info.row} />,
      },
      ...columns,
    ];
  }, [dateNow, reportType, currentMonth, currentYear, t]);
};

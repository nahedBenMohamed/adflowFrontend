import { generalSettingsStore } from '@/app';
import { Department } from '@/modules/settings';
import {
  Currency,
  FieldFormat,
  FieldType,
  User,
  currencyFormatterHelper,
  type EntityType,
  type Nullable,
  type Optional,
} from '@/shared';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadTitleCellWithToggle, RowTitleCell } from '../../../components';
import {
  formatQuantityAmountWithCurrency,
  formatQuantityAmountWithMinutes,
  formatQuantityAmountWithoutCurrency,
  generateFieldOptionColumnId,
} from '../../../helpers';
import type { GeneralReportFieldOptionMeta } from '../../../models';
import {
  GeneralReportColumnMetaType,
  GeneralReportColumnsIds,
  GeneralReportType,
  ReportStageType,
  ReportsColumnsIds,
  type GeneralReport,
  type GeneralReportFieldValue,
  type QuantityAmount,
} from '../../../models';
import type { GeneralReportSyntheticRow } from '../../../types';

const getCardsCellCb =
  (currency: Currency) =>
  (info: CellContext<GeneralReportSyntheticRow, unknown>): string =>
    formatQuantityAmountWithCurrency({
      currency,
      qAmount: info.getValue() as Optional<QuantityAmount>,
    });

const getCallCellCb =
  (t: TFunction) =>
  (info: CellContext<GeneralReportSyntheticRow, unknown>): string =>
    formatQuantityAmountWithMinutes({
      qAmount: info.getValue() as Optional<QuantityAmount>,
      t,
    });

const DEPARTMENT_OR_USER_TYPE = [GeneralReportType.DEPARTMENT, GeneralReportType.USER];

export const useGetGeneralReportColumns = ({
  entityType,
  stageType,
  reportType,
  generalReport,
}: {
  entityType: EntityType;
  reportType: GeneralReportType;
  generalReport?: GeneralReport;
  stageType?: Nullable<ReportStageType>;
}): ColumnDef<GeneralReportSyntheticRow>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_general_report_columns',
  });

  return useMemo<ColumnDef<GeneralReportSyntheticRow>[]>(() => {
    const currency = generalSettingsStore.accountSettings?.currency ?? Currency.USD;
    const ordered = reportType === GeneralReportType.RATING;

    const cardsColumns: ColumnDef<GeneralReportSyntheticRow>[] = [
      {
        id: ReportStageType.ALL,
        header: t(ReportStageType.ALL),
        accessorFn: r => r.originalRow.entity?.all,
        cell: getCardsCellCb(currency),
      },
      {
        id: ReportStageType.OPEN,
        header: t(ReportStageType.OPEN),
        accessorFn: r => r.originalRow.entity?.open,
        cell: getCardsCellCb(currency),
      },
      {
        id: ReportStageType.WON,
        header: t(ReportStageType.WON),
        accessorFn: r => r.originalRow.entity?.won,
        cell: getCardsCellCb(currency),
      },
      {
        id: ReportStageType.LOST,
        header: t(ReportStageType.LOST),
        accessorFn: r => r.originalRow.entity?.lost,
        cell: getCardsCellCb(currency),
      },
    ];

    const getCardColumns = (): ColumnDef<GeneralReportSyntheticRow>[] => {
      switch (stageType) {
        case ReportStageType.ALL:
          return cardsColumns;

        case ReportStageType.OPEN:
          return cardsColumns.filter(c => c.id === ReportStageType.OPEN);

        case ReportStageType.WON:
          return cardsColumns.filter(c => c.id === ReportStageType.WON);

        case ReportStageType.LOST:
          return cardsColumns.filter(c => c.id === ReportStageType.LOST);

        default:
          return cardsColumns;
      }
    };

    const defaultColumns: ColumnDef<GeneralReportSyntheticRow>[] = [
      {
        id: ReportsColumnsIds.TITLE,
        header: info => {
          const title = DEPARTMENT_OR_USER_TYPE.includes(reportType) ? t('groups') : t('users');

          return <HeadTitleCellWithToggle title={title} table={info.table} />;
        },
        cell: info => <RowTitleCell row={info.row} showOrder={ordered} />,
        meta: {
          excelValue: (row: GeneralReportSyntheticRow) =>
            `${row.originalObject instanceof User ? row.originalObject.fullName : row.originalObject instanceof Department ? row.originalObject.name : ''}`,
        },
      },
      {
        id: GeneralReportColumnsIds.CARDS,
        header: t('cards'),
        columns: [
          ...getCardColumns(),
          {
            id: GeneralReportColumnsIds.CARDS_DEAL_AVERAGE_AMOUNT,
            header: t('average_check'),
            accessorFn: r => r.originalRow.entity?.avgAmount,
            cell: info => currencyFormatterHelper.format({ value: info.getValue() ?? 0, currency }),
          },
          {
            id: GeneralReportColumnsIds.CARDS_DEAL_AVERAGE_CLOSE,
            header: t('average_term'),
            accessorFn: r => r.originalRow.entity?.avgClose,
            cell: info => ((info.getValue() ?? 0) / 86400).toFixed(2),
          },
        ],
      },
      {
        id: GeneralReportColumnsIds.TASKS,
        header: t('tasks'),
        columns: [
          {
            id: GeneralReportColumnsIds.TASKS_ALL,
            header: t('all'),
            accessorFn: r => r.originalRow.task?.all ?? 0,
          },
          {
            id: GeneralReportColumnsIds.TASKS_OPEN,
            header: t('open'),
            accessorFn: r => r.originalRow.task?.open ?? 0,
          },
          {
            id: GeneralReportColumnsIds.TASKS_EXPIRED,
            header: t('expired'),
            accessorFn: r => r.originalRow.task?.expired ?? 0,
          },
          {
            id: GeneralReportColumnsIds.TASKS_RESOLVED,
            header: t('completed'),
            accessorFn: r => r.originalRow.task?.resolved ?? 0,
          },
        ],
      },
      {
        id: GeneralReportColumnsIds.ACTIVITIES,
        header: t('activities'),
        columns: [
          {
            id: GeneralReportColumnsIds.ACTIVITIES_ALL,
            header: t('all'),
            accessorFn: r => r.originalRow.activity?.all ?? 0,
          },
          {
            id: GeneralReportColumnsIds.ACTIVITIES_OPEN,
            header: t('open'),
            accessorFn: r => r.originalRow.activity?.open ?? 0,
          },
          {
            id: GeneralReportColumnsIds.ACTIVITIES_EXPIRED,
            header: t('expired'),
            accessorFn: r => r.originalRow.activity?.expired ?? 0,
          },
          {
            id: GeneralReportColumnsIds.ACTIVITIES_RESOLVED,
            header: t('completed'),
            accessorFn: r => r.originalRow.activity?.resolved ?? 0,
          },
        ],
      },
      {
        id: GeneralReportColumnsIds.CALLS,
        header: t('calls'),
        columns: [
          {
            id: GeneralReportColumnsIds.CALLS_ALL,
            header: t('total'),
            accessorFn: r => r.originalRow.call?.all,
            cell: getCallCellCb(t),
          },
          {
            id: GeneralReportColumnsIds.CALLS_ALL_AVERAGE,
            header: t('average'),
            accessorFn: r => r.originalRow.call?.avgAll,
            cell: getCallCellCb(t),
          },
          {
            id: GeneralReportColumnsIds.CALLS_INCOMING,
            header: t('incoming'),
            accessorFn: r => r.originalRow.call?.incoming,
            cell: getCallCellCb(t),
          },
          {
            id: GeneralReportColumnsIds.CALLS_INCOMING_AVERAGE,
            header: t('incoming_average'),
            accessorFn: r => r.originalRow.call?.avgIncoming,
            cell: getCallCellCb(t),
          },
          {
            id: GeneralReportColumnsIds.CALLS_OUTGOING,
            header: t('outgoing'),
            accessorFn: r => r.originalRow.call?.outgoing,
            cell: getCallCellCb(t),
          },
          {
            id: GeneralReportColumnsIds.CALLS_OUTGOING_AVERAGE,
            header: t('outgoing_average'),
            accessorFn: r => r.originalRow.call?.avgOutgoing,
            cell: getCallCellCb(t),
          },
          {
            id: GeneralReportColumnsIds.CALLS_MISSED,
            header: t('missed'),
            accessorFn: r => r.originalRow.call?.missed,
            cell: getCallCellCb(t),
          },
        ],
      },
    ];

    const getHeaderTitle = ({
      fieldId,
      fieldMeta,
    }: {
      fieldId: number;
      fieldMeta: GeneralReportFieldOptionMeta;
    }): string => {
      const field = entityType.getFieldById(fieldId);

      if ([FieldType.NUMBER, FieldType.FORMULA].includes(field.type)) return t('result');

      if (typeof fieldMeta.optionLabel === 'string') return fieldMeta.optionLabel;

      return fieldMeta.optionLabel ? t('switch_on') : t('switch_off');
    };

    if (generalReport)
      defaultColumns.push(
        ...generalReport.meta.fields.map<ColumnDef<GeneralReportSyntheticRow>>(f => ({
          header: f.fieldName,
          id: String(f.fieldId),
          meta: {
            type: GeneralReportColumnMetaType.FIELD,
          },
          columns: f.values.map<ColumnDef<GeneralReportSyntheticRow>>(fv => ({
            id: generateFieldOptionColumnId({
              fieldId: f.fieldId,
              optionId: fv.optionId,
            }),
            header: getHeaderTitle({ fieldId: f.fieldId, fieldMeta: fv }),
            meta: {
              type: GeneralReportColumnMetaType.VALUE,
            },
            accessorFn: r =>
              r.originalRow.fields
                ?.find(rf => rf.fieldId === f.fieldId)
                ?.values.find(rfv => rfv.optionId === fv.optionId),
            cell: info => {
              const fieldValueCandidate = info.getValue();

              const fieldValue = fieldValueCandidate
                ? (fieldValueCandidate as GeneralReportFieldValue)
                : null;

              switch (fv.format) {
                case FieldFormat.CURRENCY:
                  return fieldValue
                    ? formatQuantityAmountWithCurrency({
                        qAmount: { amount: fieldValue.amount, quantity: fieldValue.quantity },
                        currency,
                      })
                    : formatQuantityAmountWithCurrency({
                        currency,
                      });

                // all cases down below – format as number
                case FieldFormat.NUMBER:
                default:
                  return fieldValue
                    ? formatQuantityAmountWithoutCurrency({
                        amount: fieldValue.amount,
                        quantity: fieldValue.quantity,
                      })
                    : formatQuantityAmountWithoutCurrency();
              }
            },
          })),
        }))
      );

    return defaultColumns;
  }, [generalReport, stageType, reportType, entityType, t]);
};

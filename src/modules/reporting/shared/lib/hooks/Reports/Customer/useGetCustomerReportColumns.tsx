import { generalSettingsStore, routes } from '@/app';
import { Currency, currencyFormatterHelper, getDaysFromSeconds, type Optional } from '@/shared';
import { createColumnHelper, type CellContext, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NameLink, RowTitleCell } from '../../../components';
import { formatQuantityAmountWithCurrency } from '../../../helpers';
import { ReportsColumnsIds, type CustomerReport, type QuantityAmount } from '../../../models';
import type { CustomerReportSyntheticRow } from '../../../types';

const getCardsCellCb =
  (currency: Currency) =>
  (info: CellContext<CustomerReportSyntheticRow, Optional<QuantityAmount>>): string =>
    formatQuantityAmountWithCurrency({
      currency,
      qAmount: info.getValue(),
    });

export const useGetCustomerReportColumns = ({
  currentPageEncodedUrl,
  customerReport,
}: {
  currentPageEncodedUrl: string;
  customerReport?: CustomerReport;
}) => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_customer_report_columns',
  });

  return useMemo(() => {
    const currency = generalSettingsStore.accountSettings?.currency ?? Currency.USD;
    const columnHelper = createColumnHelper<CustomerReportSyntheticRow>();

    const defaultColumns = [
      columnHelper.display({
        id: ReportsColumnsIds.TITLE,
        header: t('name'),
        cell: info => {
          const { type } = info.row.original;
          const { ownerId, ownerName, ownerEntityTypeId } = info.row.original.originalRow;

          return type === 'total' ? (
            <RowTitleCell row={info.row} />
          ) : (
            <NameLink
              to={routes.card({
                entityId: ownerId,
                from: currentPageEncodedUrl,
                entityTypeId: ownerEntityTypeId,
              })}
            >
              {ownerName}
            </NameLink>
          );
        },
        meta: {
          excelValue: (row: CustomerReportSyntheticRow) =>
            `${row.type === 'total' ? '' : row.originalRow.ownerName}`,
        },
      }),

      columnHelper.accessor('originalRow.won', {
        header: t('sold'),
        cell: getCardsCellCb(currency),
      }),

      columnHelper.accessor('originalRow.wonProductQuantity', {
        header: t('products_quantity'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('originalRow.open', {
        header: t('opened'),
        cell: getCardsCellCb(currency),
      }),

      columnHelper.accessor('originalRow.lost', {
        header: t('lost'),
        cell: getCardsCellCb(currency),
      }),

      columnHelper.accessor('originalRow.all', {
        header: t('all'),
        cell: getCardsCellCb(currency),
      }),

      columnHelper.accessor('originalRow.avgWonDealQuantity', {
        header: t('average_quantity'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('originalRow.avgWonDealBudget', {
        header: t('average_budget'),
        cell: info =>
          currencyFormatterHelper.format({
            value: info.getValue(),
            currency,
          }),
      }),

      columnHelper.accessor('originalRow.avgWonDealTime', {
        header: t('average_duration'),
        cell: info => getDaysFromSeconds(info.getValue()),
      }),
    ] as ColumnDef<CustomerReportSyntheticRow, unknown>[];

    if (customerReport && customerReport.meta.fields.length > 0)
      customerReport.meta.fields.forEach(f =>
        defaultColumns.push({
          id: String(f.fieldId),
          header: f.fieldName,
          cell: info => info.getValue(),
          accessorFn: r =>
            r.originalRow.fields?.find(rowField => rowField.fieldId === f.fieldId)?.value ?? 0,
        })
      );

    return defaultColumns;
  }, [currentPageEncodedUrl, customerReport, t]);
};

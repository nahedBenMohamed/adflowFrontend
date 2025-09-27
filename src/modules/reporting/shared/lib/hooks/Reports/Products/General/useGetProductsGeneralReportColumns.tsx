import { generalSettingsStore, routes, userStore } from '@/app';
import { ProductCategory, ProductsSectionType } from '@/modules/products';
import { Department } from '@/modules/settings';
import {
  ConvertTimeUtil,
  Currency,
  User,
  UserView,
  currencyFormatterHelper,
  type Nullable,
} from '@/shared';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadTitleCellWithToggle, NameLink, RowTitleCell } from '../../../../components';
import { formatQuantityAmountWithCurrency } from '../../../../helpers';
import {
  ProductsReportType,
  ReportStageType,
  ReportTableColumnMeta,
  ReportsColumnsIds,
} from '../../../../models';
import { type ProductsGeneralReportSyntheticRow } from '../../../../types';

export const useGetProductsGeneralReportColumns = ({
  sectionId,
  reportType,
  sectionType,
  currentPageDecodeUrl,
  selectedUsersInFilter,
  stageType,
}: {
  sectionId: number;
  reportType: ProductsReportType;
  sectionType: ProductsSectionType;
  currentPageDecodeUrl: string;
  selectedUsersInFilter?: Nullable<number[]>;
  stageType?: Nullable<ReportStageType>;
}) => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_products_general_report_columns',
  });

  return useMemo(() => {
    const currency = generalSettingsStore.accountSettings?.currency ?? Currency.USD;

    const columnHelper = createColumnHelper<ProductsGeneralReportSyntheticRow>();

    const columns: ColumnDef<ProductsGeneralReportSyntheticRow, unknown>[] = [
      columnHelper.display({
        id: ReportsColumnsIds.TITLE,
        header: info => <HeadTitleCellWithToggle title={t('name')} table={info.table} />,
        cell: info => {
          const {
            originalRow: { productName, ownerId },
            type,
          } = info.row.original;

          return type === 'string' ? (
            <NameLink
              to={routes.product({
                sectionId,
                productId: ownerId,
                sectionType,
                from: currentPageDecodeUrl,
              })}
            >
              {productName}
            </NameLink>
          ) : (
            <RowTitleCell row={info.row} />
          );
        },
        meta: {
          excelValue: (row: ProductsGeneralReportSyntheticRow) =>
            `${row.type === 'string' ? row.originalRow.productName : row.originalObject instanceof ProductCategory ? row.originalObject.name : row.originalObject instanceof User ? row.originalObject.fullName : row.originalObject instanceof Department ? row.originalObject.name : ''}`,
        },
      }),
    ];

    switch (reportType) {
      case ProductsReportType.PRODUCT:
      case ProductsReportType.CATEGORY: {
        const cardsColumns: ColumnDef<ProductsGeneralReportSyntheticRow>[] = [
          columnHelper.display({
            id: 'open',
            header: t('open'),
            cell: info =>
              formatQuantityAmountWithCurrency({
                currency,
                qAmount: info.row.original.originalRow.open,
              }),
          }),

          columnHelper.display({
            id: 'lost',
            header: t('lost'),
            cell: info =>
              formatQuantityAmountWithCurrency({
                currency,
                qAmount: info.row.original.originalRow.lost,
              }),
          }),

          columnHelper.display({
            id: 'all',
            header: t('all'),
            cell: info =>
              formatQuantityAmountWithCurrency({
                currency,
                qAmount: info.row.original.originalRow.all,
              }),
          }),
        ];

        const getCardColumns = (): ColumnDef<ProductsGeneralReportSyntheticRow>[] => {
          switch (stageType) {
            case ReportStageType.ALL:
              return cardsColumns;
            case ReportStageType.OPEN:
              return cardsColumns.filter(c => c.id === ReportStageType.OPEN);
            case ReportStageType.LOST:
              return cardsColumns.filter(c => c.id === ReportStageType.LOST);
            default:
              return cardsColumns;
          }
        };

        columns.push(
          ...[
            columnHelper.display({
              id: 'sold',
              header: t('sold'),
              cell: info =>
                formatQuantityAmountWithCurrency({
                  currency,
                  qAmount: info.row.original.originalRow.sold,
                }),
            }),

            columnHelper.display({
              id: 'shipped',
              header: t('shipped'),
              cell: info =>
                formatQuantityAmountWithCurrency({
                  currency,
                  qAmount: info.row.original.originalRow.shipped,
                }),
            }),

            ...getCardColumns(),

            columnHelper.display({
              id: 'avgProducts',
              header: t('average_products'),
              cell: info => (info.row.original.originalRow.avgProducts ?? 0).toFixed(2),
            }),

            columnHelper.display({
              id: 'avgBudget',
              header: t('average_budget'),
              cell: info =>
                currencyFormatterHelper.format({
                  value: info.row.original.originalRow.avgBudget ?? 0,
                  currency,
                }),
            }),

            columnHelper.display({
              id: 'avgTerm',
              header: t('average_term'),
              cell: info =>
                ConvertTimeUtil.getDHMSFromSeconds(info.row.original.originalRow.avgTerm ?? 0).days,
            }),
          ]
        );

        break;
      }

      case ProductsReportType.USER: {
        columns.push(
          ...[
            columnHelper.display({
              id: 'sold',
              header: t('sold'),
              cell: info =>
                formatQuantityAmountWithCurrency({
                  currency,
                  qAmount: info.row.original.originalRow.sold,
                }),
            }),

            ...userStore.activeUsers
              .filter(u =>
                selectedUsersInFilter && selectedUsersInFilter.length > 0
                  ? selectedUsersInFilter.includes(u.id)
                  : true
              )
              .map(u =>
                columnHelper.display({
                  id: String(u.id),
                  meta: new ReportTableColumnMeta({ headerTextUnstyled: true }),
                  header: () => <UserView user={u} size="small" />,
                  cell: info => {
                    const qAmount = info.row.original.originalRow.findUserCellById(u.id)?.value;

                    return formatQuantityAmountWithCurrency({
                      qAmount,
                      currency,
                    });
                  },
                })
              ),
          ]
        );
      }
    }

    return columns;
  }, [
    sectionId,
    stageType,
    reportType,
    sectionType,
    currentPageDecodeUrl,
    selectedUsersInFilter,
    t,
  ]);
};

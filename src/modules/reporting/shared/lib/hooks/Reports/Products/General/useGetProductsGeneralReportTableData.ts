import type { ProductCategory } from '@/modules/products';
import type { Nullable } from '@/shared';
import { useMemo } from 'react';
import { ProductsReportType, type ProductsReport } from '../../../../models';
import type { ProductsGeneralReportSyntheticRow } from '../../../../types';

export const useGetProductsGeneralReportTableData = ({
  reportType,
  productsGeneralReport,
  categories,
}: {
  reportType: ProductsReportType;
  productsGeneralReport?: ProductsReport;
  categories: ProductCategory[];
}) =>
  useMemo(() => {
    if (!productsGeneralReport) return [];

    let finalRows: ProductsGeneralReportSyntheticRow[] = [];

    switch (reportType) {
      case ProductsReportType.CATEGORY: {
        const rows: ProductsGeneralReportSyntheticRow[] = [];

        categories.forEach(c => {
          const categoryRow = productsGeneralReport.findCategoryRowById(c.id);

          if (!categoryRow) return;

          const subcategoriesRows: ProductsGeneralReportSyntheticRow[] = [];

          c.children.forEach(sc => {
            const subcategoryRow = productsGeneralReport.findCategoryRowById(sc.id);

            if (!subcategoryRow) return;

            subcategoriesRows.push({
              originalObject: sc,
              type: 'subgroup',
              originalRow: subcategoryRow,
              subRows: [],
            });
          });

          rows.push({
            originalObject: c,
            type: 'group',
            originalRow: categoryRow,
            subRows: subcategoriesRows,
          });
        });

        finalRows = rows;

        break;
      }

      case ProductsReportType.USER:
      case ProductsReportType.PRODUCT: {
        const categoryRows: ProductsGeneralReportSyntheticRow[] = [];
        const productsWithoutCategory: ProductsGeneralReportSyntheticRow[] = [];

        productsGeneralReport.productsWithoutCategory.forEach(p => {
          const productRow = productsGeneralReport.findProductRowById(p.ownerId);

          if (!productRow) return;

          productsWithoutCategory.push({
            type: 'string',
            originalObject: String(p.ownerId),
            originalRow: productRow,
            subRows: [],
          });
        });

        categories.forEach(c => {
          const categoryRow = productsGeneralReport.findCategoryRowById(c.id);

          if (!categoryRow) return;

          const subcategoriesRows: ProductsGeneralReportSyntheticRow[] = [];
          const categoryProductsRows: ProductsGeneralReportSyntheticRow[] = [];

          c.children.forEach(sc => {
            const subcategoryRow = productsGeneralReport.findCategoryRowById(sc.id);

            if (!subcategoryRow) return;

            const subcategoryProductsRows: ProductsGeneralReportSyntheticRow[] = [];

            productsGeneralReport.getProductsByCategoryId(sc.id).forEach(pRow =>
              subcategoryProductsRows.push({
                type: 'string',
                originalObject: String(pRow.ownerId),
                originalRow: pRow,
                subRows: [],
              })
            );

            subcategoriesRows.push({
              originalObject: sc,
              type: 'subgroup',
              originalRow: subcategoryRow,
              subRows: subcategoryProductsRows,
            });
          });

          productsGeneralReport.getProductsByCategoryId(c.id).forEach(pRow =>
            categoryProductsRows.push({
              type: 'string',
              originalObject: String(pRow.ownerId),
              originalRow: pRow,
              subRows: [],
            })
          );

          categoryRows.push({
            originalObject: c,
            type: 'group',
            originalRow: categoryRow,
            subRows: [...categoryProductsRows, ...subcategoriesRows],
          });
        });

        finalRows = [...productsWithoutCategory, ...categoryRows];

        break;
      }
    }

    const totalRow: Nullable<ProductsGeneralReportSyntheticRow> = productsGeneralReport.total
      ? {
          type: 'total',
          originalRow: productsGeneralReport.total,
          subRows: [],
        }
      : null;

    return finalRows.length > 0 ? (totalRow ? [...finalRows, totalRow] : finalRows) : [];
  }, [reportType, productsGeneralReport, categories]);

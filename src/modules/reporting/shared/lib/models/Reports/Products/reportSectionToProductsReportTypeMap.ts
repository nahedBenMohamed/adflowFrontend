import type { RenderTabs } from '../RenderTabs';
import { ReportsSection } from '../ReportsSection';
import { ProductsReportType } from './General/ProductsReportType';

export const reportSectionToProductsReportTypeMap: RenderTabs<ProductsReportType>[] = [
  { value: ReportsSection.PRODUCTS, reportType: ProductsReportType.PRODUCT },
  { value: ReportsSection.PRODUCTS_CATEGORIES, reportType: ProductsReportType.CATEGORY },
  { value: ReportsSection.PRODUCTS_USERS, reportType: ProductsReportType.USER },
];

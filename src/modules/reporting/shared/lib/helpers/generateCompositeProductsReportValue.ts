import type { ProductsSectionType } from '@/modules/products';
import type { ReportsSection } from '../models';

export const generateCompositeProductsReportValue = ({
  reportSection,
  entityTypeId,
  productsSectionId,
  productsSectionType,
}: {
  reportSection: ReportsSection | string;
  entityTypeId: number;
  productsSectionId: number;
  productsSectionType: ProductsSectionType;
}): string => `${reportSection}_${entityTypeId}_${productsSectionId}_${productsSectionType}`;

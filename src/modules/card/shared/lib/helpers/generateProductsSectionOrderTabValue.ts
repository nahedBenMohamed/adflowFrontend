import type { ProductsSectionType } from '@/modules/products';

export const generateProductsSectionOrderTabValue = ({
  sectionId,
  sectionType,
}: {
  sectionId: number;
  sectionType: ProductsSectionType;
}): string => {
  return `${sectionType}-${sectionId}`;
};

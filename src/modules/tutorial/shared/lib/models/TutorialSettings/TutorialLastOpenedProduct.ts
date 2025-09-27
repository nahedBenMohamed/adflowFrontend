import type { TutorialProductType } from '@/shared';

export interface TutorialLastOpenedProduct {
  objectId?: number;
  productType: TutorialProductType;
  lastOpenedDate: string;
}

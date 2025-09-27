import type { Nullable, TutorialProductType } from '@/shared';

export interface TutorialItemProduct {
  type: TutorialProductType;
  objectId: Nullable<number>;
}

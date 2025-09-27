import type { Nullable } from '@/shared';
import type { TutorialItemProduct } from '../../../shared';

export class UpdateTutorialItemDto {
  name: string;
  link: string;
  sortOrder: number;
  userIds: Nullable<number[]>;
  products: Nullable<TutorialItemProduct[]>;

  private constructor(data: Partial<UpdateTutorialItemDto>) {
    Object.assign(this, data);
  }

  static create(data: Partial<UpdateTutorialItemDto>): UpdateTutorialItemDto {
    return new UpdateTutorialItemDto(data);
  }
}

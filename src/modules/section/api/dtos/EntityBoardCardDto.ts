import type { EntityCategory, Nullable } from '@/shared';
import type { EntityBoardCardDataDto } from './EntityBoardCardDataDto';

export class EntityBoardCardDto {
  id: number;
  entityCategory: EntityCategory;
  stageId: number;
  price: Nullable<number>;
  data: EntityBoardCardDataDto;
  closedAt: Nullable<string>;
  weight: number;
  focused?: boolean;

  constructor({
    id,
    entityCategory,
    stageId,
    price,
    data,
    closedAt,
    weight,
    focused,
  }: EntityBoardCardDto) {
    this.id = id;
    this.entityCategory = entityCategory;
    this.stageId = stageId;
    this.price = price;
    this.data = data;
    this.closedAt = closedAt;
    this.weight = weight;
    this.focused = focused;
  }
}

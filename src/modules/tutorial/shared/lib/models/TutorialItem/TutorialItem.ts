import { UtcDate, type Nullable } from '@/shared';
import type { TutorialItemDto } from '../../../../api';
import type { TutorialItemProduct } from './TutorialItemProduct';

export class TutorialItem {
  id: number;
  groupId: number;
  name: string;
  link: string;
  sortOrder: number;
  // null -> item is visible for all users
  userIds: Nullable<number[]>;
  products: Nullable<TutorialItemProduct[]>;
  createdAt: UtcDate;

  constructor({ id, groupId, name, link, sortOrder, userIds, products, createdAt }: TutorialItem) {
    this.id = id;
    this.groupId = groupId;
    this.name = name;
    this.link = link;
    this.sortOrder = sortOrder;
    this.userIds = userIds;
    this.products = products;
    this.createdAt = createdAt;
  }

  static fromDto(dto: TutorialItemDto): TutorialItem {
    return new TutorialItem({
      id: dto.id,
      groupId: dto.groupId,
      name: dto.name,
      link: dto.link,
      sortOrder: dto.sortOrder,
      userIds: dto.userIds,
      products: dto.products,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: TutorialItemDto[]): TutorialItem[] {
    return dtos.map(this.fromDto);
  }
}

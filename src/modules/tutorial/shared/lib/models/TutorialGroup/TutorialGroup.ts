import type { TutorialGroupDto } from '../../../../api';
import { TutorialItem } from '../TutorialItem/TutorialItem';

export class TutorialGroup {
  id: number;
  name: string;
  sortOrder: number;
  items: TutorialItem[];

  constructor({ id, name, sortOrder, items }: TutorialGroup) {
    this.id = id;
    this.name = name;
    this.sortOrder = sortOrder;
    this.items = items;
  }

  static fromDto(dto: TutorialGroupDto): TutorialGroup {
    return new TutorialGroup({
      id: dto.id,
      name: dto.name,
      sortOrder: dto.sortOrder,
      items: dto.items ? TutorialItem.fromDtos(dto.items) : [],
    });
  }

  static fromDtos(dtos: TutorialGroupDto[]): TutorialGroup[] {
    return dtos.map(this.fromDto);
  }
}

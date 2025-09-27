import { type ObjectState } from '@/shared';

export class EntityLinkDto {
  sourceId: number;
  targetId: number;
  sortOrder: number;
  state: ObjectState;

  constructor({ sourceId, targetId, sortOrder, state }: EntityLinkDto) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.sortOrder = sortOrder;
    this.state = state;
  }
}

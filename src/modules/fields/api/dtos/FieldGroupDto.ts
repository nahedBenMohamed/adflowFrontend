import type { ObjectState, Optional } from '@/shared';
import type { FieldGroupCode } from '../../shared';

export class FieldGroupDto {
  id: number;
  name: string;
  sortOrder: number;
  state: ObjectState;
  code: Optional<FieldGroupCode>;

  constructor({ id, name, sortOrder, state, code }: FieldGroupDto) {
    this.id = id;
    this.name = name;
    this.sortOrder = sortOrder;
    this.state = state;
    this.code = code;
  }
}

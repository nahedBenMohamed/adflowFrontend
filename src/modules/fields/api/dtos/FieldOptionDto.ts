import type { Nullable, ObjectState } from '@/shared';

export class FieldOptionDto {
  id: number;
  label: string;
  color: Nullable<string>;
  sortOrder: number;
  state: ObjectState;

  constructor({ id, label, color, sortOrder, state }: FieldOptionDto) {
    this.id = id;
    this.label = label;
    this.color = color;
    this.sortOrder = sortOrder;
    this.state = state;
  }
}

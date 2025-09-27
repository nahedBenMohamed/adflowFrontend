import type { FieldFormat, FieldType, Nullable, ObjectState } from '@/shared';
import type { FieldCode } from '../../shared';
import type { FieldOptionDto } from './FieldOptionDto';

export class FieldDto {
  id: number;
  name: string;
  type: FieldType;
  code: Nullable<FieldCode>;
  active: boolean;
  sortOrder: number;
  fieldGroupId: Nullable<number>;
  state: ObjectState;
  options: FieldOptionDto[];
  value?: Nullable<string>;
  format?: Nullable<FieldFormat>;

  constructor({
    id,
    name,
    type,
    code,
    active,
    sortOrder,
    fieldGroupId,
    options,
    state,
    value,
    format,
  }: FieldDto) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.code = code;
    this.active = active;
    this.sortOrder = sortOrder;
    this.fieldGroupId = fieldGroupId;
    this.options = options;
    this.state = state;
    this.value = value;
    this.format = format;
  }
}

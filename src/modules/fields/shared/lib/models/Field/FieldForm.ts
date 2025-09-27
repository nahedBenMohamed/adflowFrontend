import type { InputModel, SelectModel } from '@/shared';

export class FieldForm {
  name: InputModel;
  type: SelectModel;

  constructor(name: InputModel, type: SelectModel) {
    this.name = name;
    this.type = type;
  }
}

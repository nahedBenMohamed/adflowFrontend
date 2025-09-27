import { InputModel, SelectModel, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { StringFilter } from './StringFilter';
import { StringFilterType } from './StringFilterType';

export class StringFilterFormData {
  text: InputModel;
  type: SelectModel;

  constructor({ text, type }: { text?: Nullable<string>; type?: StringFilterType }) {
    this.text = InputModel.create(text);
    this.type = SelectModel.create(type);

    makeAutoObservable(this);
  }

  static fromModel(model: StringFilter): StringFilterFormData {
    return new StringFilterFormData({
      text: model.text,
      type: model.type,
    });
  }

  static empty(): StringFilterFormData {
    return new StringFilterFormData({});
  }

  toModel = (): StringFilter => {
    return {
      text: this.text.trimmedValue,
      type: this.type.value,
    };
  };

  isEmpty = (): boolean => {
    if (this.type.value === StringFilterType.CONTAINS) return !this.text.trimmedValue;

    return false;
  };
}

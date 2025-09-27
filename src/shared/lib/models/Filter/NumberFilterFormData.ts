import { InputModel, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { NumberFilter } from './NumberFilter';

export class NumberFilterFormData {
  min: InputModel;
  max: InputModel;

  constructor({ min, max }: { min?: Nullable<number>; max?: Nullable<number> }) {
    this.min = InputModel.createFromNullableNumber(min);
    this.max = InputModel.createFromNullableNumber(max);

    makeAutoObservable(this);
  }

  static fromModel(model: NumberFilter): NumberFilterFormData {
    return new NumberFilterFormData({
      min: model.min ?? null,
      max: model.max ?? null,
    });
  }

  static empty(): NumberFilterFormData {
    return new NumberFilterFormData({});
  }

  toModel = (): NumberFilter => {
    return {
      min: this.min.asNumberOrUndefined(),
      max: this.max.asNumberOrUndefined(),
    };
  };

  isEmpty = (): boolean => {
    return !this.min.value && !this.max.value;
  };
}

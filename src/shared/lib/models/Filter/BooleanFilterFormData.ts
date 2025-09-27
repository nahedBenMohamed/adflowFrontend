import { type Optional, SelectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { BooleanFilter } from './BooleanFilter';

export class BooleanFilterFormData {
  value: SelectModel;

  constructor({ value }: { value: Optional<boolean> }) {
    this.value = SelectModel.create(value);

    makeAutoObservable(this);
  }

  static fromModel(model: BooleanFilter): BooleanFilterFormData {
    return new BooleanFilterFormData({ value: model.value });
  }

  static empty(): BooleanFilterFormData {
    return new BooleanFilterFormData({ value: undefined });
  }

  toModel = (): BooleanFilter => {
    return {
      value: this.value.value,
    };
  };

  isEmpty = (): boolean => {
    return this.value.value === undefined;
  };
}

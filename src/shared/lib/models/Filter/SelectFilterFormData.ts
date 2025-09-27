import { MultiselectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { SelectFilter } from './SelectFilter';

export class SelectFilterFormData {
  optionIds: MultiselectModel<number>;

  constructor(optionIds?: number[]) {
    this.optionIds = MultiselectModel.create<number>(optionIds);

    makeAutoObservable(this);
  }

  static fromModel(model: SelectFilter): SelectFilterFormData {
    return new SelectFilterFormData(model.optionIds);
  }

  static empty(): SelectFilterFormData {
    return new SelectFilterFormData();
  }

  toModel = (): SelectFilter => {
    return {
      optionIds: this.optionIds.values,
    };
  };

  isEmpty = (): boolean => {
    return this.optionIds.valuesOrEmptyArray.length === 0;
  };
}

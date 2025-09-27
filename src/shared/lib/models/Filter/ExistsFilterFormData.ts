import { SelectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { ExistsFilter } from './ExistsFilter';
import type { ExistsFilterType } from './ExistsFilterType';

export class ExistsFilterFormData {
  type: SelectModel;

  constructor(type?: ExistsFilterType) {
    this.type = SelectModel.create(type);

    makeAutoObservable(this);
  }

  static fromModel(model: ExistsFilter): ExistsFilterFormData {
    return new ExistsFilterFormData(model.type);
  }

  static empty(): ExistsFilterFormData {
    return new ExistsFilterFormData();
  }

  toModel = (): ExistsFilter => {
    return {
      type: this.type.value,
    };
  };

  isEmpty = (): boolean => {
    return !this.type.value;
  };
}

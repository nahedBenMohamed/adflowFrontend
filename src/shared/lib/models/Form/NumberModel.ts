import { makeAutoObservable } from 'mobx';
import { type Nullable } from '../../types';

export class NumberModel {
  value: Nullable<number> = null;

  constructor(initValue: Nullable<number> = null) {
    this.value = initValue;

    makeAutoObservable(this);
  }

  static create(initValue: Nullable<number> = null): NumberModel {
    return new this(initValue);
  }

  get valueOrZero(): number {
    return this.value || 0;
  }

  setValue = (value: Nullable<number>): void => {
    this.value = value;
  };

  clearValue = (): void => {
    this.value = null;
  };
}

import type { Nullable, Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';

export class CheckboxModel {
  values: any[] = [];
  isValid = true;

  private _required = false;

  constructor(values: any[]) {
    this.values = values;

    makeAutoObservable(this);
  }

  get valuesOrUndefined(): Optional<any[]> {
    return this.values.length ? this.values : undefined;
  }

  static create<StaticValue>(values: StaticValue[]): CheckboxModel {
    return new CheckboxModel(values);
  }

  static createFromNullable<StaticValue>(values: Nullable<StaticValue[]>): CheckboxModel {
    return new CheckboxModel(values ?? []);
  }

  static createFromOptional<StaticValue>(values: Optional<StaticValue[]>): CheckboxModel {
    return new CheckboxModel(values ?? []);
  }

  static createFromOptionalNullable<StaticValue>(
    values: Optional<Nullable<StaticValue[]>>
  ): CheckboxModel {
    return new CheckboxModel(values ?? []);
  }

  setValues = (values: any[]): void => {
    this.values = values;
    this.validate();
  };

  required = (): this => {
    this._required = true;

    return this;
  };

  validate = (): boolean => {
    if (this._required) {
      if (!this.values.length) {
        this.isValid = false;

        return false;
      }

      this.isValid = true;
    }

    return true;
  };
}

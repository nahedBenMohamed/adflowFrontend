import { makeAutoObservable } from 'mobx';
import type { Nullable, Optional } from '../../../types';

export class MultiselectModel<Value extends unknown = unknown> {
  values: Value[] = [];

  isValid = true;

  private _required = false;

  constructor(value: Value[]) {
    this.values = value;

    makeAutoObservable(this);
  }

  // static members cannot reference class type parameters, so that we need another generic
  static create<StaticValue>(values?: StaticValue[]): MultiselectModel<StaticValue> {
    return new MultiselectModel(values ?? []);
  }

  static createFromNullable<StaticValue>(
    value: Nullable<StaticValue[]>
  ): MultiselectModel<StaticValue> {
    return new MultiselectModel(value ?? []);
  }

  static createFromOptional<StaticValue>(
    value: Optional<StaticValue[]>
  ): MultiselectModel<StaticValue> {
    return new MultiselectModel(value ?? []);
  }

  static createFromOptionalNullable<StaticValue>(
    value: Optional<Nullable<StaticValue[]>>
  ): MultiselectModel<StaticValue> {
    return new MultiselectModel(value ?? []);
  }

  get valuesOrUndefined(): Optional<Value[]> {
    return this.values.length ? this.values : undefined;
  }

  get valuesOrNull(): Nullable<Value[]> {
    return this.values.length ? this.values : null;
  }

  get valuesOrEmptyArray(): Value[] {
    return this.values.length ? this.values : [];
  }

  clear = (): void => {
    this.values = [];
  };

  clearError = (): void => {
    this.isValid = true;
  };

  setValue = (values: Value[]): void => {
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

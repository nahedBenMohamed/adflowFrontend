import { action, makeObservable, observable } from 'mobx';
import { type MySelectOptionValueType } from './MySelectOptionValueType';

export class SelectModel {
  value: MySelectOptionValueType = undefined;
  isValid = true;

  private _required = false;

  constructor(initValue: MySelectOptionValueType = undefined) {
    this.value = initValue;

    makeObservable(this, {
      value: observable,
      isValid: observable,
      setValue: action,
      resetValue: action,
      validate: action,
      required: action,
    });
  }

  static create(initValue: MySelectOptionValueType = undefined): SelectModel {
    return new this(initValue);
  }

  clearError = (): void => {
    this.isValid = true;
  };

  setValue = (value: MySelectOptionValueType): void => {
    this.value = value;
    this.validate();
  };

  resetValue = (): void => {
    this.value = undefined;
  };

  setError = (): void => {
    this.isValid = false;
  };

  required = (): this => {
    this._required = true;

    return this;
  };

  validate = (): boolean => {
    if (this._required) {
      if (!this.value) {
        this.isValid = false;

        return false;
      }

      this.isValid = true;
    }

    return true;
  };
}

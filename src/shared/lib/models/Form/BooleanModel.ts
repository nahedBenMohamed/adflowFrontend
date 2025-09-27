import { makeAutoObservable } from 'mobx';

export class BooleanModel {
  value = false;
  isValid = true;

  private _required = false;

  private constructor(value: boolean) {
    this.value = value;

    makeAutoObservable(this);
  }

  static create(value?: boolean): BooleanModel {
    return new BooleanModel(value ?? false);
  }

  clearError = (): void => {
    this.isValid = true;
  };

  setValue = (value: boolean): void => {
    this.value = value;

    this.validate();
  };

  toggle = (): void => {
    this.setValue(!this.value);
  };

  required = (): this => {
    this._required = true;

    return this;
  };

  validate = (): boolean => {
    if (this._required) {
      this.isValid = this.value;

      return this.value;
    }

    return true;
  };
}

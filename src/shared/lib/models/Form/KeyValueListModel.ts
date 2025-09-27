import { makeAutoObservable } from 'mobx';
import type { Nullable } from '../../types';
import { InputModel } from './MyInput/InputModel';

interface KeyValueObjectModel {
  key: InputModel;
  value: InputModel;
}

export class KeyValueListModel {
  value: KeyValueObjectModel[] = [];
  isValid = true;

  private constructor(initValue: KeyValueObjectModel[] = []) {
    this.value = initValue;

    makeAutoObservable(this);
  }

  static create(value: KeyValueObjectModel[]): KeyValueListModel {
    return new KeyValueListModel(value);
  }

  static createFromObject(object?: Nullable<object>): KeyValueListModel {
    if (!object) return new KeyValueListModel();

    const list: KeyValueObjectModel[] = [];

    for (const [key, value] of Object.entries(object)) {
      list.push({
        key: InputModel.create(key).required(),
        value: InputModel.create(String(value)).required(),
      });
    }

    return new KeyValueListModel(list);
  }

  addEmpty = (): void => {
    this.value.push({
      key: InputModel.create().required(),
      value: InputModel.create().required(),
    });
  };

  remove = (idx: number): void => {
    this.value.splice(idx, 1);
  };

  toObject = (): Nullable<Record<string, string>> => {
    if (this.value.length === 0) return null;

    const object: Nullable<Record<string, string>> = {};

    this.value.forEach(el => {
      object[el.key.value] = el.value.value;
    });

    return object;
  };

  validate = (): boolean => {
    for (const el of this.value) {
      if (!el.key.validate() || !el.value.validate()) {
        this.isValid = false;

        return false;
      }
    }

    return true;
  };

  httpHeaderFormat = (): this => {
    this.value.forEach(el => {
      el.key.httpHeaderKey();
      el.value.printableAscii();
    });

    return this;
  };

  printableAsciiFormat = (): this => {
    this.value.forEach(el => {
      el.key.printableAscii();
      el.value.printableAscii();
    });

    return this;
  };
}

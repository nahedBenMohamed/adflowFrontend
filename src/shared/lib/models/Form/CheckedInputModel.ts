import type { ChecklistFieldPayloadItem } from '@/modules/fields';
import { makeAutoObservable } from 'mobx';
import { BooleanModel } from './BooleanModel';
import { InputModel } from './MyInput/InputModel';

export class CheckedInputModel {
  text: InputModel;
  checked: BooleanModel;

  private constructor(initValue?: ChecklistFieldPayloadItem) {
    this.text = InputModel.create(initValue?.text);
    this.checked = BooleanModel.create(initValue?.checked);

    makeAutoObservable(this);
  }

  static create(initValue?: ChecklistFieldPayloadItem): CheckedInputModel {
    return new CheckedInputModel(initValue);
  }

  toChecklistFieldPayloadItem = (): ChecklistFieldPayloadItem => {
    return {
      text: this.text.value,
      checked: this.checked.value,
    };
  };
}

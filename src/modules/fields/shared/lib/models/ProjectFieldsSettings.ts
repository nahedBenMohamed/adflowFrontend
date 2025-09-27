import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { FieldCode } from './Field/FieldCode';

export class ProjectFieldsSettings {
  activeFieldCodes: FieldCode[] = [];

  constructor(activeFieldCodes: FieldCode[]) {
    this.activeFieldCodes = activeFieldCodes;

    makeAutoObservable(this);
  }

  changeActiveFieldCodes = (activeFieldCodes: FieldCode[]): void => {
    this.activeFieldCodes = activeFieldCodes;
  };

  isActive = (fieldCode: Nullable<FieldCode>): boolean => {
    return fieldCode ? this.activeFieldCodes.includes(fieldCode) : false;
  };
}

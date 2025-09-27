import { MultiselectModel, ObjectState, type FieldType } from '@/shared';
import { action, makeObservable, observable } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { FileFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

export class FileFieldValue extends FieldValue<FileFieldValuePrimitive, MultiselectModel> {
  fileIds: string[] = [];

  private constructor(
    fieldId: number,
    fieldType: FieldType,
    fileIds: string[],
    state: ObjectState
  ) {
    super({ fieldId, fieldType, state, model: MultiselectModel.create() });

    this.fileIds = fileIds;

    makeObservable(this, {
      state: true,
      fileIds: true,
      model: observable,
      changeState: action,
      changeFileIds: action,
    });
  }

  static create({ field, value }: { field: Field; value: string[] }): FileFieldValue {
    return new FileFieldValue(field.id, field.type, value, ObjectState.CREATED);
  }

  static empty(field: Field): FileFieldValue {
    return new FileFieldValue(field.id, field.type, [], ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<FileFieldValuePrimitive>): FileFieldValue {
    return new FileFieldValue(fieldId, fieldType, payload.value, ObjectState.UNCHANGED);
  }

  changeFileIds = (fileIds: string[]): void => {
    this.fileIds = fileIds;

    this.calculateStateAfterUpdate();
  };

  addFiles = (fileIds: string[]): void => {
    const newFileIds = fileIds.filter(id => !this.fileIds.includes(id));

    this.changeFileIds([...this.fileIds, ...newFileIds]);
  };

  removeFile = (fileId: string): void => {
    this.changeFileIds(this.fileIds.filter(f => f !== fileId));
  };

  toDto = (): FieldValueDto<FileFieldValuePrimitive> => {
    return this.toDtoWithPayload({ value: this.fileIds });
  };

  filled = (): boolean => {
    return this.fileIds.length > 0;
  };
}

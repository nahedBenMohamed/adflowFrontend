import { FieldType, ObjectState } from '@/shared';
import { makeAutoObservable, observable, runInAction } from 'mobx';
import {
  ChecklistFieldValue,
  ColoredMultiselectFieldValue,
  ColoredSelectFieldValue,
  DateFieldValue,
  FileFieldValue,
  LinkFieldValue,
  MultiselectFieldValue,
  MultitextFieldValue,
  NumberFieldValue,
  ParticipantFieldValue,
  ParticipantsFieldValue,
  SelectFieldValue,
  SwitchFieldValue,
  TextFieldValue,
  type Field,
} from '../shared';
import type { PossibleFieldValue } from '../shared/lib/types';

export class FieldValuesStore {
  private _multitextFieldTypes = [
    FieldType.MULTITEXT,
    FieldType.PHONE,
    FieldType.EMAIL,
    FieldType.CHECKLIST,
  ];

  fieldValues: PossibleFieldValue[] = [];

  constructor(initialFieldValues: PossibleFieldValue[] = []) {
    this.fieldValues = initialFieldValues;

    makeAutoObservable(this);
  }

  get fieldValuesForSave(): PossibleFieldValue[] {
    return this.fieldValues.map<PossibleFieldValue>(fv => {
      if (!fv.filled() && fv.state === ObjectState.UPDATED)
        runInAction(() => {
          fv.state = ObjectState.DELETED;
        });

      return fv;
    });
  }

  get multitextFieldValues(): MultitextFieldValue[] {
    return this.fieldValues.filter(fv =>
      this._multitextFieldTypes.includes(fv.fieldType)
    ) as MultitextFieldValue[];
  }

  static createFieldValue(field: Field): PossibleFieldValue {
    const fieldTypeMap: Record<FieldType, PossibleFieldValue> = {
      [FieldType.TEXT]: TextFieldValue.empty(field),
      [FieldType.DATE]: DateFieldValue.empty(field),
      [FieldType.LINK]: LinkFieldValue.empty(field),
      [FieldType.FILE]: FileFieldValue.empty(field),
      [FieldType.FORMULA]: TextFieldValue.empty(field),
      [FieldType.VALUE]: NumberFieldValue.empty(field),
      [FieldType.NUMBER]: NumberFieldValue.empty(field),
      [FieldType.SELECT]: SelectFieldValue.empty(field),
      [FieldType.SWITCH]: SwitchFieldValue.empty(field),
      [FieldType.RICHTEXT]: TextFieldValue.empty(field),
      [FieldType.PHONE]: MultitextFieldValue.empty(field),
      [FieldType.EMAIL]: MultitextFieldValue.empty(field),
      [FieldType.CHECKLIST]: ChecklistFieldValue.empty(field),
      [FieldType.MULTITEXT]: MultitextFieldValue.empty(field),
      [FieldType.PARTICIPANT]: ParticipantFieldValue.empty(field),
      [FieldType.MULTISELECT]: MultiselectFieldValue.empty(field),
      [FieldType.PARTICIPANTS]: ParticipantsFieldValue.empty(field),
      [FieldType.COLORED_SELECT]: ColoredSelectFieldValue.empty(field),
      [FieldType.CHECKED_MULTISELECT]: MultiselectFieldValue.empty(field),
      [FieldType.COLORED_MULTISELECT]: ColoredMultiselectFieldValue.empty(field),
    };

    return fieldTypeMap[field.type];
  }

  clearEmptyModelsInMultitextFields = (): void => {
    this.multitextFieldValues.forEach(fv => {
      fv.clearEmptyModels();
    });
  };

  setFieldValues = (fieldValues: PossibleFieldValue[]): void => {
    this.fieldValues = fieldValues;
  };

  getOrCreateByField = (field: Field): PossibleFieldValue => {
    let fieldValue = this.fieldValues.find(i => i.fieldId === field.id);

    if (fieldValue) return fieldValue;

    fieldValue = observable(FieldValuesStore.createFieldValue(field));

    this.fieldValues.push(fieldValue);

    return fieldValue;
  };

  findByFieldType = (type: FieldType): PossibleFieldValue[] => {
    return this.fieldValues.filter(fv => fv.fieldType === type);
  };
}

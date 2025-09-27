import { identityStore } from '@/app';
import { FieldType, MathUtil, type Nullable, ObjectState, type Optional } from '@/shared';
import type { TFunction } from 'i18next';
import { computed, makeAutoObservable } from 'mobx';
import {
  AnalyticsFieldSubgroup,
  AnalyticsFieldSubgroupCode,
  Field,
  type FieldCode,
  FieldsStoreErrorCode,
  RequisitesFieldSubgroup,
  RequisitesFieldSubgroupCode,
} from '../shared';

export class FieldsStore {
  private _fields: Field[] = [];
  private readonly _t: Optional<TFunction>;

  // binded with translations in store.fields-store.json
  errorCode: Nullable<FieldsStoreErrorCode> = null;

  // metadata object that will be provided to translations
  // (useful for cases where you need to pass e.g., field name in error message)
  errorMetadata: Nullable<object>;

  constructor({ initialFields = [], t }: { initialFields?: Field[]; t?: TFunction }) {
    this._fields = initialFields;
    this._t = t;

    makeAutoObservable(this);
  }

  get allFields(): Field[] {
    return this._fields;
  }

  @computed.struct
  get activeFields(): Field[] {
    return this._fields.filter(f => !f.isDeleted()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  get hasBudgetField(): boolean {
    return this._fields.some(f => f.isProjectBudgetField || f.type === FieldType.VALUE);
  }

  get duplicateNames(): string[] {
    const names = this.activeFields.map(f => f.name.trim());

    return names.filter((f, idx) => names.indexOf(f) !== idx);
  }

  setFields = (fields: Field[]): void => {
    this._fields = fields;
  };

  validate = (): boolean => {
    this.errorCode = null;

    if (this._fields.every(f => f.state === ObjectState.UNCHANGED)) return true;

    if (!this.activeFields.length) {
      this.errorCode = FieldsStoreErrorCode.CREATE_AT_LEAST_ONE_FIELD;

      return false;
    }

    if (this.duplicateNames.length) {
      this.setErrorCode(FieldsStoreErrorCode.DUPLICATE_NAME, { fieldName: this.duplicateNames[0] });

      for (const name of this.duplicateNames) {
        const fields = this.activeFields.filter(f => f.name.trim() === name);

        for (const field of fields) {
          field.form.name.showError();
        }
      }

      return false;
    }

    let isValid = true;

    for (const field of this.activeFields) {
      if (!field.form.name.validate()) {
        isValid = false;
      }
    }

    return isValid;
  };

  setErrorCode = (errorCode: Nullable<FieldsStoreErrorCode>, metadata?: Nullable<object>): void => {
    this.errorCode = errorCode;

    if (metadata) {
      this.errorMetadata = metadata;
    }
  };

  clearError = (): void => {
    this.errorCode = null;
  };

  getFieldsByGroupId = (groupId: number): Field[] => {
    return this.activeFields.filter(f => f.fieldGroupId === groupId);
  };

  findByCode = (code: string): Optional<Field> => {
    return this.activeFields.find(f => f.code === code);
  };

  findByType = (type: FieldType): Field[] => {
    return this.activeFields.filter(f => f.type === type);
  };

  getFieldByCode = (code: string): Field => {
    const field = this.findByCode(code);

    if (!field) throw new Error(`Field with code ${code} not found`);

    return field;
  };

  addTextFieldWithCode = ({ groupId, code }: { groupId: number; code?: FieldCode }): Field => {
    const requisitesCodesArr = Array.from(Object.values(RequisitesFieldSubgroup)).flat();

    const maxSortOrder = MathUtil.maxOrZero(this.activeFields.map<number>(f => f.sortOrder));
    const newField = this.createNewField({
      code,
      type: FieldType.TEXT,
      fieldGroupId: groupId,
      sortOrder: maxSortOrder + 1,
      name:
        code && requisitesCodesArr.includes(code) && this._t
          ? this._t(`requisites_codes.${code}`)
          : code || null,
    });

    this._fields.push(newField);

    return newField;
  };

  addAnalyticsSubgroup = ({
    groupId,
    code,
  }: {
    groupId: number;
    code: AnalyticsFieldSubgroupCode;
  }): void => {
    const subgroup = AnalyticsFieldSubgroup[code];

    const existingFieldCodes = this.activeFields
      .filter(f => f.isAnalyticsField && subgroup.includes(f.code as FieldCode))
      .map<Nullable<FieldCode>>(f => f.code);
    const missingFieldsCodes = subgroup.filter(sf => !existingFieldCodes.includes(sf));

    missingFieldsCodes.forEach(c => {
      this.addTextFieldWithCode({ groupId, code: c });
    });
  };

  addRequisitesSubgroup = ({
    groupId,
    code,
  }: {
    groupId: number;
    code: RequisitesFieldSubgroupCode;
  }): void => {
    const subgroup = RequisitesFieldSubgroup[code];

    const existingFieldCodes = this.activeFields
      .filter(f => f.isRequisitesField && subgroup.includes(f.code as FieldCode))
      .map<Nullable<FieldCode>>(f => f.code);
    const missingFieldsCodes = subgroup.filter(sf => !existingFieldCodes.includes(sf));

    missingFieldsCodes.forEach(c => {
      this.addTextFieldWithCode({ groupId, code: c });
    });
  };

  addUTMAnalyticsFields = (groupId: number): void => {
    AnalyticsFieldSubgroup[AnalyticsFieldSubgroupCode.UTM].forEach(c => {
      this.addTextFieldWithCode({ groupId, code: c });
    });
  };

  addSpAndOrganizationRequisitesFields = (groupId: number): void => {
    RequisitesFieldSubgroup[RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_REQUISITES].forEach(
      c => {
        this.addTextFieldWithCode({ groupId, code: c });
      }
    );
  };

  hasAnalyticsSubgroup = (code: AnalyticsFieldSubgroupCode): boolean => {
    const subgroup = AnalyticsFieldSubgroup[code];
    const fieldCodes = this.activeFields.map<Nullable<FieldCode>>(f => f.code);

    return subgroup.every(f => fieldCodes.includes(f));
  };

  hasRequisitesSubgroup = (code: RequisitesFieldSubgroupCode): boolean => {
    const subgroup = RequisitesFieldSubgroup[code];
    const fieldCodes = this.activeFields.map<Nullable<FieldCode>>(f => f.code);

    return subgroup.every(f => fieldCodes.includes(f));
  };

  deleteField = (id: number): void => {
    const fieldIdx = this._fields.findIndex(f => f.id === id);
    const field = this._fields[fieldIdx];

    if (!field) throw new Error(`Field with id ${id} was not found`);

    if (field.isCreated()) {
      this._fields.splice(fieldIdx, 1);
    } else {
      field.markDeleted();
    }
  };

  changeFieldType = ({ field, type }: { field: Field; type: FieldType }): void => {
    const fieldIdx = this._fields.findIndex(i => i === field);

    const newField = this.createNewField({
      type,
      name: field.name,
      sortOrder: field.sortOrder,
      fieldGroupId: field.fieldGroupId,
    });

    if ('options' in newField && 'options' in field) newField.options = field.options;

    this._fields.splice(fieldIdx, 1, newField);
  };

  createNewField = ({
    name,
    type,
    sortOrder,
    fieldGroupId,
    code,
  }: {
    name: Nullable<string>;
    type: FieldType;
    sortOrder: number;
    fieldGroupId: Nullable<number>;
    code?: FieldCode;
  }): Field => {
    const fieldId = identityStore.getFieldId();

    return Field.create({
      id: fieldId,
      name: name ?? '',
      type,
      sortOrder,
      fieldGroupId,
      options: [],
      code,
    });
  };

  findBudgetField = (): Optional<Field> => {
    return this._fields.find(f => f.type === FieldType.VALUE);
  };

  getFieldById = (id: number): Field => {
    const field = this._fields.find(f => f.id === id);

    if (!field) throw new Error(`Field with id ${id} was not found`);

    return field;
  };

  changeFieldSortOrder = ({
    fieldId,
    newSortOrder,
  }: {
    fieldId: number;
    newSortOrder: number;
  }): void => {
    const field = this.getFieldById(fieldId);

    field.sortOrder = newSortOrder;

    if (!field.isCreated()) field.state = ObjectState.UPDATED;
  };

  updateFieldValue = ({ fieldId, value }: { fieldId: number; value?: Nullable<string> }): void => {
    const field = this.getFieldById(fieldId);

    field.value = value;

    if (!field.isCreated()) field.state = ObjectState.UPDATED;
  };
}

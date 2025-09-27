import { AnalyticsFieldSubgroup, RequisitesFieldSubgroup } from '@/modules/fields';
import {
  type FieldFormat,
  FieldType,
  InputModel,
  type Nullable,
  ObjectState,
  SelectModel,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import { FieldDto } from '../../../../api';
import { FieldOption } from '../FieldOption/FieldOption';
import { FieldCode } from './FieldCode';
import { FieldForm } from './FieldForm';
import { PROJECT_FIELDS_CODES } from './projectFieldsCodes';

export class Field {
  id: number;
  name: string;
  type: FieldType;
  code: Nullable<FieldCode>;
  active: boolean;
  sortOrder: number;
  fieldGroupId: Nullable<number>;
  options: FieldOption[];
  state: ObjectState;
  form: FieldForm;
  value?: Nullable<string>;
  format?: Nullable<FieldFormat>;

  constructor({
    id,
    name,
    type,
    code,
    active,
    sortOrder,
    fieldGroupId,
    options,
    state,
    value,
    format,
  }: {
    id: number;
    name: string;
    type: FieldType;
    code: Nullable<FieldCode>;
    active: boolean;
    sortOrder: number;
    fieldGroupId: Nullable<number>;
    options: FieldOption[];
    state: ObjectState;
    value?: Nullable<string>;
    format?: Nullable<FieldFormat>;
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.code = code;
    this.active = active;
    this.sortOrder = sortOrder;
    this.fieldGroupId = fieldGroupId;
    this.options = options.map<FieldOption>(o => o.addInitialState());
    this.state = state;
    this.form = new FieldForm(
      InputModel.create(this.name).required(),
      SelectModel.create(this.type)
    );
    this.value = value;
    this.format = format;

    makeAutoObservable(this);
  }

  static toDtos(fields: Field[]): FieldDto[] {
    return fields
      .filter(f => f.isCommittable())
      .map<FieldDto>(f => {
        const options = FieldOption.toDtos(f.options.filter(o => o.isCommittable()));

        return new FieldDto({
          id: f.id,
          options,
          type: f.type,
          code: f.code,
          state: f.state,
          value: f.value,
          active: f.active,
          name: f.name.trim(),
          sortOrder: f.sortOrder,
          fieldGroupId: f.fieldGroupId,
          format: f.format,
        });
      });
  }

  static fromDto(dto: FieldDto): Field {
    const options = dto.options.map<FieldOption>(FieldOption.fromDto);

    return new Field({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      code: dto.code,
      active: dto.active,
      sortOrder: dto.sortOrder,
      fieldGroupId: dto.fieldGroupId,
      options: options,
      state: dto.state,
      value: dto.value,
      format: dto.format,
    });
  }

  static fromDtos(dtos: FieldDto[]): Field[] {
    return dtos.map<Field>(Field.fromDto);
  }

  static create({
    id,
    name,
    type,
    sortOrder,
    fieldGroupId,
    options = [],
    code,
    format,
  }: {
    id: number;
    name: string;
    type: FieldType;
    sortOrder: number;
    fieldGroupId: Nullable<number>;
    options: FieldOption[];
    code?: FieldCode;
    format?: Nullable<FieldFormat>;
  }): Field {
    return new Field({
      id,
      name,
      type,
      code: code || null,
      active: true,
      sortOrder,
      fieldGroupId,
      options,
      state: ObjectState.CREATED,
      format,
    });
  }

  get optionsToShow(): FieldOption[] {
    return this.options.filter(o => !o.isDeleted()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  get isProjectField(): boolean {
    return Boolean(this.code && PROJECT_FIELDS_CODES.includes(this.code));
  }

  get isProjectBudgetField(): boolean {
    return Boolean(this.code && this.code === FieldCode.VALUE);
  }

  get isAnalyticsField(): boolean {
    return Boolean(
      this.code && Array.from(Object.values(AnalyticsFieldSubgroup)).flat().includes(this.code)
    );
  }

  get isRequisitesField(): boolean {
    return Boolean(
      this.code && Array.from(Object.values(RequisitesFieldSubgroup)).flat().includes(this.code)
    );
  }

  get isBankRequisitesSearchableBy(): boolean {
    return Boolean(
      this.code &&
        [
          FieldCode.BANK_NAME,
          FieldCode.BANK_TIN,
          FieldCode.BANK_BIC,
          FieldCode.BANK_TRRC,
          FieldCode.BANK_SWIFT,
        ].includes(this.code)
    );
  }

  get isOrgRequisitesSearchableBy(): boolean {
    return Boolean(
      this.code &&
        [
          FieldCode.ORG_SHORT_NAME,
          FieldCode.ORG_FULL_NAME,
          FieldCode.ORG_PSRN,
          FieldCode.ORG_TIN,
        ].includes(this.code)
    );
  }

  getOptionById = (id: number): FieldOption => {
    const option = this.options.find(o => o.id === id);

    if (!option) throw new Error(`Option with id ${id} not found`);

    return option;
  };

  hasOptions = (): boolean => {
    return [
      FieldType.SELECT,
      FieldType.MULTISELECT,
      FieldType.COLORED_SELECT,
      FieldType.COLORED_MULTISELECT,
      FieldType.CHECKED_MULTISELECT,
    ].includes(this.type);
  };

  changeName = (name: string): void => {
    this.name = name;
    this.calculateStateAfterUpdate();
  };

  changeFormat = (format: Nullable<FieldFormat>): void => {
    this.format = format;
    this.calculateStateAfterUpdate();
  };

  changeOptions = (options: FieldOption[]): void => {
    this.options = options;

    this.calculateStateAfterUpdate();
  };

  calculateStateAfterUpdate = (): void => {
    if (this.state === ObjectState.CREATED_EMPTY) this.state = ObjectState.CREATED;

    if (this.state === ObjectState.UNCHANGED) this.state = ObjectState.UPDATED;
  };

  markDeleted = (): void => {
    this.state = ObjectState.DELETED;
  };

  isCreated = (): boolean => {
    return this.state === ObjectState.CREATED;
  };

  isDeleted = (): boolean => {
    return this.state === ObjectState.DELETED;
  };

  isCommittable = (): boolean => {
    return this.state !== ObjectState.UNCHANGED;
  };

  setActive = (active: boolean): void => {
    this.active = active;
  };

  addInitialState = (): Field => {
    this.state = ObjectState.UNCHANGED;

    return this;
  };
}

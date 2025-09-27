import { InputModel, ObjectState, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { FieldGroupDto } from '../../../../api';
import { FieldGroupCode } from '../FieldGroupCode';
import { FieldGroupForm } from './FieldGroupForm';

export class FieldGroup {
  id: number;
  name: string;
  sortOrder: number;
  state: ObjectState;
  code: Optional<FieldGroupCode>;

  form: FieldGroupForm;

  private constructor({
    id,
    name,
    sortOrder,
    state,
    code,
  }: {
    id: number;
    name: string;
    sortOrder: number;
    state: ObjectState;
    code: Optional<FieldGroupCode>;
  }) {
    this.id = id;
    this.name = name;
    this.sortOrder = sortOrder;
    this.state = state;
    this.code = code;

    this.form = new FieldGroupForm(InputModel.create(this.name).required());

    makeAutoObservable(this);
  }

  static fromDto({ id, name, sortOrder, state, code }: FieldGroupDto): FieldGroup {
    return new FieldGroup({ id, name, sortOrder, state, code });
  }

  static fromDtos(dtos: FieldGroupDto[]): FieldGroup[] {
    return dtos.map(dto => FieldGroup.fromDto(dto));
  }

  static toDto(model: FieldGroup): FieldGroupDto {
    return new FieldGroupDto({
      id: model.id,
      name: model.name,
      state: model.state,
      sortOrder: model.sortOrder,
      code: model.code,
    });
  }

  static toDtos(fieldGroups: FieldGroup[]): FieldGroupDto[] {
    return fieldGroups.filter(fg => fg.isCommittable()).map(fg => FieldGroup.toDto(fg));
  }

  static create({
    id,
    name,
    sortOrder,
    code,
  }: {
    id: number;
    name: string;
    sortOrder: number;
    code?: Optional<FieldGroupCode>;
  }): FieldGroup {
    return new FieldGroup({ id, name, sortOrder, state: ObjectState.CREATED, code });
  }

  get isSystem(): boolean {
    return (this.code && [FieldGroupCode.DETAILS].includes(this.code)) ?? false;
  }

  changeName = (name: string): void => {
    this.name = name;
    this.calculateStateAfterUpdate();
  };

  calculateStateAfterUpdate = (): void => {
    if (this.state === ObjectState.UNCHANGED) {
      this.state = ObjectState.UPDATED;
    }
  };

  markDeleted = (): void => {
    this.state = ObjectState.DELETED;
  };

  isCreated = () => {
    return this.state === ObjectState.CREATED;
  };

  isDeleted = () => {
    return this.state === ObjectState.DELETED;
  };

  isCommittable = () => {
    return this.state !== ObjectState.UNCHANGED;
  };

  addInitialState = (): FieldGroup => {
    this.state = ObjectState.UNCHANGED;

    return this;
  };
}

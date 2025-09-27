import { ObjectState, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { FieldOptionDto } from '../../../../api';

export class FieldOption {
  id: number;
  label: string;
  color: Nullable<string>;
  sortOrder: number;
  state: ObjectState;

  constructor(
    id: number,
    label: string,
    color: Nullable<string>,
    sortOrder: number,
    state: ObjectState
  ) {
    this.id = id;
    this.label = label;
    this.color = color;
    this.sortOrder = sortOrder;
    this.state = state;

    makeAutoObservable(this);
  }

  static fromDto({ id, label, color, sortOrder, state }: FieldOptionDto): FieldOption {
    return new FieldOption(id, label, color, sortOrder, state);
  }

  static toDto({ id, label, color, state, sortOrder }: FieldOption): FieldOptionDto {
    return new FieldOptionDto({
      id,
      label,
      color,
      state,
      sortOrder,
    });
  }

  static toDtos(models: FieldOption[]): FieldOptionDto[] {
    return models.map(m => FieldOption.toDto(m));
  }

  markDeleted = (): void => {
    this.state = ObjectState.DELETED;
  };

  isDeleted = (): boolean => {
    return this.state === ObjectState.DELETED;
  };

  changeLabel = (label: string): void => {
    this.label = label;

    this.calculateStateAfterUpdate();
  };

  changeColor = (color: Nullable<string>): void => {
    this.color = color;

    this.calculateStateAfterUpdate();
  };

  calculateStateAfterUpdate = (): void => {
    if (this.state === ObjectState.UNCHANGED) this.state = ObjectState.UPDATED;
  };

  isCommittable = (): boolean => {
    return this.state !== ObjectState.UNCHANGED;
  };

  addInitialState = (): this => {
    this.state = ObjectState.UNCHANGED;

    return this;
  };
}

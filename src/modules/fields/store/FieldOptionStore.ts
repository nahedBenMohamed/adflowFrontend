import { identityStore } from '@/app';
import { MathUtil, ObjectState } from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { FieldOption } from '../shared';

export class FieldOptionStore {
  private _options: FieldOption[] = [];

  constructor(options: FieldOption[]) {
    this._options = options;

    makeAutoObservable(this);
  }

  @computed.struct
  get options(): FieldOption[] {
    return this._options.filter(o => !o.isDeleted()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  @computed.struct
  get realOptions(): FieldOption[] {
    return this._options;
  }

  getOptionById = (id: number): FieldOption => {
    const option = this._options.find(o => o.id === id);

    if (!option) throw new Error(`Field option with id ${id} not found`);

    return option;
  };

  addOption = (label: string): void => {
    const id = identityStore.getFieldOptionId();
    const maxSortOrder = MathUtil.maxOrZero(this.options.map<number>(fo => fo.sortOrder));
    const option = new FieldOption(id, label, null, maxSortOrder + 1, ObjectState.CREATED);

    this._options.push(option);
  };

  deleteOption = (id: number): void => {
    const idx = this._options.findIndex(o => o.id === id);
    const option = this._options[idx];

    if (!option) throw new Error(`Option with id ${id} not found`);

    if (option.state === ObjectState.CREATED) {
      this._options.splice(idx, 1);
    } else {
      option.markDeleted();
    }
  };

  changeOptionLabel = ({ id, label }: { id: number; label: string }): void => {
    const option = this.getOptionById(id);

    option.changeLabel(label);
  };

  changeOptionColor = ({ id, color }: { id: number; color: string }): void => {
    const option = this.getOptionById(id);

    option.changeColor(color);
  };
}

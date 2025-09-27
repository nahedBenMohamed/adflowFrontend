import { InputModel, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { TutorialItem } from '../TutorialItem/TutorialItem';
import { TutorialItemForm } from '../TutorialItem/TutorialItemForm';
import type { TutorialGroup } from './TutorialGroup';

export class TutorialGroupForm {
  id: number;
  name: InputModel;
  sortOrder: number;
  itemsForms: TutorialItemForm[];

  isCreatingItemForm = false;

  constructor({
    id,
    name,
    sortOrder,
    itemsForms,
  }: {
    id: number;
    name: string;
    sortOrder: number;
    itemsForms: TutorialItem[];
  }) {
    this.id = id;
    this.sortOrder = sortOrder;
    this.name = InputModel.create(name).required();

    this.itemsForms = itemsForms.map(TutorialItemForm.createFromItem);

    makeAutoObservable(this);
  }

  static createFromGroup(group: TutorialGroup): TutorialGroupForm {
    return new TutorialGroupForm({
      id: group.id,
      name: group.name,
      itemsForms: group.items,
      sortOrder: group.sortOrder,
    });
  }

  static empty(): TutorialGroupForm {
    return new TutorialGroupForm({
      id: -1,
      name: '',
      sortOrder: 0,
      itemsForms: [],
    });
  }

  get savedItemsForms(): TutorialItemForm[] {
    return this.itemsForms.filter(i => i.id > 0);
  }

  get createdEmptyItemForm(): Optional<TutorialItemForm> {
    return this.itemsForms.find(i => i.id < 0);
  }

  getItemFormById = (itemId: number): TutorialItemForm => {
    const itemForm = this.itemsForms.find(i => i.id === itemId);

    if (!itemForm) throw new Error(`Item form with id ${itemId} was not found in group ${this.id}`);

    return itemForm;
  };

  changeSortOrder = (sortOrder: number): void => {
    this.sortOrder = sortOrder;
  };
}

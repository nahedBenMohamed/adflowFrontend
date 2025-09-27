import { InputModel, MultiselectModel, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { TutorialItem } from './TutorialItem';
import type { TutorialItemProduct } from './TutorialItemProduct';

export class TutorialItemForm {
  id: number;
  name: InputModel;
  link: InputModel;
  sortOrder: number;
  userIds: MultiselectModel<number>;
  products: MultiselectModel<TutorialItemProduct>;

  constructor({
    id,
    name,
    link,
    sortOrder,
    userIds,
    products,
  }: {
    id: number;
    name: string;
    link: string;
    sortOrder: number;
    userIds: Nullable<number[]>;
    products: Nullable<TutorialItemProduct[]>;
  }) {
    this.id = id;
    this.name = InputModel.create(name).required();
    this.link = InputModel.create(link).required();
    this.sortOrder = sortOrder;
    this.userIds = MultiselectModel.create<number>(userIds ?? []);
    this.products = MultiselectModel.create<TutorialItemProduct>(products ?? []);

    makeAutoObservable(this);
  }

  static createFromItem(item: TutorialItem): TutorialItemForm {
    return new TutorialItemForm({
      id: item.id,
      name: item.name,
      link: item.link,
      userIds: item.userIds,
      products: item.products,
      sortOrder: item.sortOrder,
    });
  }

  static empty(): TutorialItemForm {
    return new TutorialItemForm({
      id: -1,
      name: '',
      link: '',
      sortOrder: 0,
      userIds: null,
      products: null,
    });
  }

  changeSortOrder = (sortOrder: number): void => {
    this.sortOrder = sortOrder;
  };
}

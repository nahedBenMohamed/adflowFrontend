import { InputModel } from '@/shared';
import { makeAutoObservable } from 'mobx';

export class SiteFormElementsTitleFormData {
  title: InputModel;
  visible: boolean;

  constructor({ title, visible }: { title: string; visible: boolean }) {
    this.title = InputModel.create(title).required();
    this.visible = visible;

    makeAutoObservable(this);
  }

  showTitle = (): void => {
    this.visible = true;
  };

  hideTitle = (): void => {
    this.visible = false;
  };

  validate = (): boolean => {
    if (this.visible) return this.title.validate();

    return true;
  };
}

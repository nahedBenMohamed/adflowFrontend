import { InputModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SiteFormFieldType } from '../SiteFormField/SiteFormFieldType';
import type { SiteFormPage } from '../SiteFormPage';
import { SiteFormElementsFieldModel } from './SiteFormElementsFieldModel';

export class SiteFormElementsPageFormData {
  id: number;
  title: InputModel;
  sortOrder: number;
  fields: SiteFormElementsFieldModel[];

  constructor({
    id,
    fields,
    sortOrder,
    title,
  }: {
    id: number;
    fields: SiteFormElementsFieldModel[];
    sortOrder: number;
    title?: string;
  }) {
    this.id = id;
    this.fields = fields;
    this.sortOrder = sortOrder;
    this.title = InputModel.create(title);

    makeAutoObservable(this);
  }

  static fromModel(siteFormPage: SiteFormPage): SiteFormElementsPageFormData {
    return new SiteFormElementsPageFormData({
      id: siteFormPage.id,
      sortOrder: siteFormPage.sortOrder,
      title: siteFormPage.title ?? undefined,
      fields: SiteFormElementsFieldModel.fromModels(siteFormPage.fields),
    });
  }

  static fromModels(siteFormPages: SiteFormPage[]): SiteFormElementsPageFormData[] {
    return siteFormPages.map(this.fromModel);
  }

  get fillableFields(): SiteFormElementsFieldModel[] {
    return this.fields.filter(f => ![SiteFormFieldType.DELIMITER].includes(f.type));
  }
}

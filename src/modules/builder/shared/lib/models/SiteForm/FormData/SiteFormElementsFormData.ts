import { BooleanModel, type Nullable } from '@/shared';
import {
  CreateSiteFormPageDto,
  UpdateSiteFormPageDto,
  type CreateSiteFormFieldDto,
  type UpdateSiteFormFieldDto,
} from '../../../../../api';
import type { SiteForm } from '../SiteForm';
import type { SiteFormElementsFieldModel } from './SiteFormElementsFieldModel';
import { SiteFormElementsPageFormData } from './SiteFormElementsPageFormData';
import { SiteFormElementsTitleFormData } from './SiteFormElementsTitleFormData';

export class SiteFormElementsFormData {
  titleFormData: SiteFormElementsTitleFormData;

  multiformEnabled: BooleanModel;
  fieldLabelEnabled: BooleanModel;
  fieldPlaceholderEnabled: BooleanModel;
  pages: SiteFormElementsPageFormData[];

  activePageId: number;

  private constructor({
    title,
    multiformEnabled,
    fieldLabelEnabled,
    fieldPlaceholderEnabled,
    pages,
  }: {
    title: string;
    multiformEnabled: boolean;
    fieldLabelEnabled: boolean;
    fieldPlaceholderEnabled: boolean;
    pages: SiteFormElementsPageFormData[];
  }) {
    this.titleFormData = new SiteFormElementsTitleFormData({ title, visible: title.length > 0 });

    this.multiformEnabled = BooleanModel.create(multiformEnabled);
    this.fieldLabelEnabled = BooleanModel.create(fieldLabelEnabled);
    this.fieldPlaceholderEnabled = BooleanModel.create(fieldPlaceholderEnabled);

    this.pages = pages;
  }

  static empty({
    defaultTitle,
    sortOrder,
  }: {
    defaultTitle: string;
    sortOrder: number;
  }): SiteFormElementsFormData {
    const formData = new SiteFormElementsFormData({
      title: defaultTitle,
      multiformEnabled: false,
      fieldLabelEnabled: true,
      fieldPlaceholderEnabled: true,
      pages: [
        new SiteFormElementsPageFormData({
          id: -1,
          sortOrder,
          fields: [],
        }),
      ],
    });

    formData.setActivePageId(-1);

    return formData;
  }

  static fromModel(siteForm: SiteForm): SiteFormElementsFormData {
    const formData = new SiteFormElementsFormData({
      title: siteForm.title || '',
      multiformEnabled: siteForm.multiformEnabled ?? false,
      fieldLabelEnabled: siteForm.fieldLabelEnabled,
      fieldPlaceholderEnabled: siteForm.fieldPlaceholderEnabled,
      pages: SiteFormElementsPageFormData.fromModels(siteForm.pages),
    });

    const firstPage = formData.pages[0];

    if (firstPage) {
      formData.setActivePageId(firstPage.id);
    } else {
      formData.pages = [
        new SiteFormElementsPageFormData({
          id: -1,
          sortOrder: 0,
          fields: [],
        }),
      ];

      formData.setActivePageId(-1);
    }

    return formData;
  }

  get firstPageId(): number {
    const firstPageId = this.pages.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0]?.id;

    if (!firstPageId) throw new Error('Form has no pages, failed to get first page id');

    return firstPageId;
  }

  get formTitle(): Nullable<string> {
    if (this.titleFormData.visible) return this.titleFormData.title.trimmedValue;

    return null;
  }

  get createPagesDtos(): CreateSiteFormPageDto[] {
    return this.pages.map<CreateSiteFormPageDto>(
      p =>
        new CreateSiteFormPageDto({
          sortOrder: p.sortOrder,
          title: p.title.trimmedValue,
          fields: p.fields.map<CreateSiteFormFieldDto>(f => f.createFieldDto),
        })
    );
  }

  get updatePagesDtos(): UpdateSiteFormPageDto[] {
    return this.pages.map<UpdateSiteFormPageDto>(
      p =>
        new UpdateSiteFormPageDto({
          id: p.id,
          sortOrder: p.sortOrder,
          title: p.title.trimmedValue,
          fields: p.fields.map<UpdateSiteFormFieldDto | CreateSiteFormFieldDto>(f =>
            f.id > 0 ? f.updateFieldDto : f.createFieldDto
          ),
        })
    );
  }

  get areAllPagesEmpty(): boolean {
    return this.pages.every(p => p.fields.length === 0);
  }

  getPageById = (id: number): SiteFormElementsPageFormData => {
    const page = this.pages.find(p => p.id === id);

    if (!page) throw new Error(`Page with id ${id} was not found`);

    return page;
  };

  generateTemporaryFieldModelIdForPage = (pageId: number): number => {
    const page = this.getPageById(pageId);

    return page.fields.reduce((min, curr) => (curr.id < min ? curr.id : min), 0) - 1;
  };

  getMaxFieldModelSortOrderForPage = (pageId: number): number => {
    const page = this.getPageById(pageId);

    return page.fields.reduce((max, curr) => (curr.sortOrder > max ? curr.sortOrder : max), 0);
  };

  addElementsFieldModelToPage = ({
    pageId,
    fieldModel,
  }: {
    pageId: number;
    fieldModel: SiteFormElementsFieldModel;
  }): void => {
    const page = this.getPageById(pageId);

    page.fields = [...page.fields, fieldModel];
  };

  deleteElementsFieldModelFromPage = ({
    pageId,
    fieldModelId,
  }: {
    pageId: number;
    fieldModelId: number;
  }): void => {
    const page = this.getPageById(pageId);

    page.fields = page.fields.filter(f => f.id !== fieldModelId);
  };

  setActivePageId = (id: number): void => {
    this.activePageId = id;
  };

  validate = (): boolean => {
    return this.titleFormData.validate();
  };
}

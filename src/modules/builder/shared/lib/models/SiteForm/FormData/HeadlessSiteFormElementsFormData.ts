import {
  CreateSiteFormPageDto,
  UpdateSiteFormPageDto,
  type CreateSiteFormFieldDto,
  type UpdateSiteFormFieldDto,
} from '../../../../../api';
import type { SiteForm } from '../SiteForm';
import type { SiteFormElementsFieldModel } from './SiteFormElementsFieldModel';
import { SiteFormElementsPageFormData } from './SiteFormElementsPageFormData';

export class HeadlessSiteFormElementsFormData {
  pages: SiteFormElementsPageFormData[];

  activePageId: number;

  private constructor({ pages }: { pages: SiteFormElementsPageFormData[] }) {
    this.pages = pages;
  }

  static empty({ sortOrder }: { sortOrder: number }): HeadlessSiteFormElementsFormData {
    const formData = new HeadlessSiteFormElementsFormData({
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

  static fromModel(siteForm: SiteForm): HeadlessSiteFormElementsFormData {
    const formData = new HeadlessSiteFormElementsFormData({
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
}

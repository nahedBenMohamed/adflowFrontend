import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { CreateSiteFormDto, siteFormApi, UpdateSiteFormDto } from '../api';
import {
  HeadlessSiteFormElementsFormData,
  type SiteForm,
  SiteFormInitializationFormData,
  SiteFormType,
} from '../shared';

export class HeadlessSiteFormBuilderStore {
  siteForm: Nullable<SiteForm> = null;

  siteFormInitializationFormData: SiteFormInitializationFormData;
  siteFormElementsFormData: HeadlessSiteFormElementsFormData;

  isLoaded = false;
  isLoading = false;
  isCreating = false;
  isUpdating = false;
  isSilentlyUpdating = false;

  constructor({ defaultTitle }: { defaultTitle: string }) {
    this.siteFormInitializationFormData = SiteFormInitializationFormData.empty({
      defaultTitle,
    });
    this.siteFormElementsFormData = HeadlessSiteFormElementsFormData.empty({
      sortOrder: 0,
    });

    makeAutoObservable(this);
  }

  get createSiteFormDto(): CreateSiteFormDto {
    return new CreateSiteFormDto({
      title: null,
      design: null,
      consent: null,
      gratitude: null,
      isHeadless: true,
      multiformEnabled: false,
      fieldLabelEnabled: false,
      fieldPlaceholderEnabled: false,
      type: SiteFormType.ENTITY_TYPE,
      pages: this.siteFormElementsFormData.createPagesDtos,
      name: this.siteFormInitializationFormData.name.trimmedValue,
      responsibleId: this.siteFormInitializationFormData.responsibleId.value,
      checkDuplicate: this.siteFormInitializationFormData.checkDuplicate.value,
      entityTypeLinks: this.siteFormInitializationFormData.siteFormEntityTypesDtos,
    });
  }

  get updateSiteFormDto(): UpdateSiteFormDto {
    return new UpdateSiteFormDto({
      title: null,
      design: null,
      consent: null,
      gratitude: null,
      isHeadless: true,
      multiformEnabled: false,
      fieldLabelEnabled: false,
      fieldPlaceholderEnabled: false,
      pages: this.siteFormElementsFormData.updatePagesDtos,
      name: this.siteFormInitializationFormData.name.trimmedValue,
      responsibleId: this.siteFormInitializationFormData.responsibleId.value,
      checkDuplicate: this.siteFormInitializationFormData.checkDuplicate.value,
      entityTypeLinks: this.siteFormInitializationFormData.siteFormEntityTypesDtos,
    });
  }

  get isCreatingOrUpdating(): boolean {
    return this.isCreating || this.isUpdating;
  }

  loadData = async (formId: number): Promise<void> => {
    try {
      this.isLoading = true;

      this.siteForm = await siteFormApi.getFullSiteForm(formId);

      this.initializeFormData(this.siteForm);
    } catch (e) {
      throw new Error(`Error while loading site form ${formId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  initializeFormData = (siteForm: SiteForm): void => {
    this.siteFormInitializationFormData = SiteFormInitializationFormData.fromModel(siteForm);
    this.siteFormElementsFormData = HeadlessSiteFormElementsFormData.fromModel(siteForm);
  };

  createSiteForm = async (): Promise<void> => {
    try {
      this.isCreating = true;

      this.siteForm = await siteFormApi.createSiteForm(this.createSiteFormDto);

      this.initializeFormData(this.siteForm);
    } catch (e) {
      throw new Error(`Error while creating site form: ${e}`);
    } finally {
      // so that navigation happens before finished loading state is displayed, for better UX
      setTimeout(() => {
        this.isCreating = false;
      }, 200);
    }
  };

  // silent -> isUpdating flag is not mutated
  // global loading is not looking on isSilentlyUpdating flag
  updateSiteForm = async ({ silentUpdate }: { silentUpdate: boolean }): Promise<void> => {
    if (!this.siteForm) throw new Error('Site form does not exist, failed to update');

    try {
      if (silentUpdate) {
        this.isSilentlyUpdating = true;
      } else {
        this.isUpdating = true;
      }

      this.siteForm = await siteFormApi.updateSiteForm({
        formId: this.siteForm.id,
        dto: this.updateSiteFormDto,
      });

      this.initializeFormData(this.siteForm);
    } catch (e) {
      throw new Error(`Error while updating site form: ${e}`);
    } finally {
      if (silentUpdate) {
        this.isSilentlyUpdating = false;
      } else {
        // so that navigation happens before finished loading state is displayed, for better UX
        setTimeout(() => {
          this.isUpdating = false;
        }, 200);
      }
    }
  };
}

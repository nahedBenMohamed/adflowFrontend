import { type Schedule, scheduleApi } from '@/modules/scheduler';
import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { CreateSiteFormDto, siteFormApi, UpdateSiteFormDto } from '../api';
import {
  OnlineBookingSiteFormElementsFormData,
  OnlineBookingSiteFormInitializationFormData,
  type SiteForm,
  SiteFormConsentFormData,
  SiteFormDesignFormData,
  SiteFormGratitudeFormData,
  SiteFormType,
} from '../shared';

export class OnlineBookingSiteFormBuilderStore {
  siteForm: Nullable<SiteForm> = null;
  schedules: Schedule[] = [];

  siteFormInitializationFormData: OnlineBookingSiteFormInitializationFormData;
  siteFormElementsFormData: OnlineBookingSiteFormElementsFormData;
  siteFormConsentFormData: SiteFormConsentFormData;
  siteFormGratitudeFormData: SiteFormGratitudeFormData;
  siteFormDesignFormData: SiteFormDesignFormData;

  isLoaded = false;
  isLoading = false;
  isCreating = false;
  isUpdating = false;
  isSilentlyUpdating = false;
  areSchedulesLoaded = false;

  constructor({
    defaultTitle,
    defaultFormTitle,
    defaultConsentText,
    defaultGratitudeHeader,
    defaultGratitudeText,
    defaultConsentLinkText,
    defaultFormButtonText,
    defaultClientButtonText,
  }: {
    defaultTitle: string;
    defaultFormTitle: string;
    defaultConsentText: string;
    defaultGratitudeHeader: string;
    defaultGratitudeText: string;
    defaultConsentLinkText: string;
    defaultFormButtonText: string;
    defaultClientButtonText: string;
  }) {
    this.siteFormInitializationFormData = OnlineBookingSiteFormInitializationFormData.empty({
      defaultTitle,
      schedules: [],
    });
    this.siteFormElementsFormData = OnlineBookingSiteFormElementsFormData.empty({
      sortOrder: 0,
      defaultTitle: defaultFormTitle,
    });
    this.siteFormConsentFormData = SiteFormConsentFormData.empty({
      defaultText: defaultConsentText,
      defaultLinkText: defaultConsentLinkText,
    });
    this.siteFormGratitudeFormData = SiteFormGratitudeFormData.empty({
      defaultHeader: defaultGratitudeHeader,
      defaultText: defaultGratitudeText,
    });
    this.siteFormDesignFormData = SiteFormDesignFormData.empty({
      defaultFormButtonText,
      defaultClientButtonText,
    });

    makeAutoObservable(this);
  }

  get createSiteFormDto(): CreateSiteFormDto {
    return new CreateSiteFormDto({
      isHeadless: false,
      type: SiteFormType.SCHEDULE,
      design: this.siteFormDesignFormData.toModel(),
      title: this.siteFormElementsFormData.formTitle,
      consent: this.siteFormConsentFormData.createFormConsentDto,
      gratitude: this.siteFormGratitudeFormData.createFormGratitudeDto,
      name: this.siteFormInitializationFormData.name.trimmedValue,
      responsibleId: this.siteFormInitializationFormData.responsibleId.value,
      multiformEnabled: this.siteFormElementsFormData.multiformEnabled.value,
      fieldLabelEnabled: this.siteFormElementsFormData.fieldLabelEnabled.value,
      checkDuplicate: this.siteFormInitializationFormData.checkDuplicate.value,
      scheduleLinks: this.siteFormInitializationFormData.siteFormSchedulesDtos,
      entityTypeLinks: this.siteFormInitializationFormData.siteFormEntityTypesDtos,
      scheduleLimitDays: this.siteFormInitializationFormData.scheduleLimitDays.asNumber(),
      fieldPlaceholderEnabled: this.siteFormElementsFormData.fieldPlaceholderEnabled.value,
      pages: this.siteFormElementsFormData.createPagesDtos,
    });
  }

  get updateSiteFormDto(): UpdateSiteFormDto {
    return new UpdateSiteFormDto({
      isHeadless: false,
      design: this.siteFormDesignFormData.toModel(),
      title: this.siteFormElementsFormData.formTitle,
      consent: this.siteFormConsentFormData.updateFormConsentDto,
      gratitude: this.siteFormGratitudeFormData.updateFormGratitudeDto,
      name: this.siteFormInitializationFormData.name.trimmedValue,
      responsibleId: this.siteFormInitializationFormData.responsibleId.value,
      multiformEnabled: this.siteFormElementsFormData.multiformEnabled.value,
      fieldLabelEnabled: this.siteFormElementsFormData.fieldLabelEnabled.value,
      checkDuplicate: this.siteFormInitializationFormData.checkDuplicate.value,
      scheduleLinks: this.siteFormInitializationFormData.siteFormSchedulesDtos,
      entityTypeLinks: this.siteFormInitializationFormData.siteFormEntityTypesDtos,
      scheduleLimitDays: this.siteFormInitializationFormData.scheduleLimitDays.asNumber(),
      fieldPlaceholderEnabled: this.siteFormElementsFormData.fieldPlaceholderEnabled.value,
      pages: this.siteFormElementsFormData.updatePagesDtos,
    });
  }

  get isCreatingOrUpdating(): boolean {
    return this.isCreating || this.isUpdating;
  }

  loadData = async (formId: number): Promise<void> => {
    try {
      this.isLoading = true;

      this.siteForm = await siteFormApi.getFullSiteForm(formId);
      this.schedules = await scheduleApi.getSchedules();

      this.initializeFormData(this.siteForm);
    } catch (e) {
      throw new Error(`Error while loading site form ${formId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
      this.areSchedulesLoaded = true;
    }
  };

  loadSchedules = async (): Promise<void> => {
    try {
      this.isLoading = true;

      this.schedules = await scheduleApi.getSchedules();

      this.siteFormInitializationFormData.initializeLinkedEntityTypeLink(this.schedules);
    } catch (e) {
      throw new Error(`Error while loading site form schedules: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
      this.areSchedulesLoaded = true;
    }
  };

  initializeFormData = (siteForm: SiteForm): void => {
    this.siteFormInitializationFormData = OnlineBookingSiteFormInitializationFormData.fromModel({
      siteForm,
      schedules: this.schedules,
    });
    this.siteFormElementsFormData = OnlineBookingSiteFormElementsFormData.fromModel(siteForm);

    if (siteForm.consent)
      this.siteFormConsentFormData = SiteFormConsentFormData.fromModel(siteForm.consent);

    if (siteForm.gratitude)
      this.siteFormGratitudeFormData = SiteFormGratitudeFormData.fromModel(siteForm.gratitude);

    if (siteForm.design)
      this.siteFormDesignFormData = SiteFormDesignFormData.fromModel(siteForm.design);
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

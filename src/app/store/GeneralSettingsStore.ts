import type { Account, AccountSettings } from '@/modules/settings';
import {
  type DataStore,
  DayNumberMap,
  type Nullable,
  type Optional,
  UtcDate,
  type WeekDays,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import { generalSettingsApi, type UpdateAccountSettingsDto } from '../api';
import { GeneralSettingsFormData } from './GeneralSettingsFormData';

class GeneralSettingsStore implements DataStore {
  account: Nullable<Account> = null;
  accountSettings: Nullable<AccountSettings> = null;
  generalSettingsForm: GeneralSettingsFormData = new GeneralSettingsFormData();

  isLoaded = false;
  hasDemoData = false;
  isDemoDeleting = false;

  constructor() {
    makeAutoObservable(this);
  }

  get updateAccountSettingsDto(): UpdateAccountSettingsDto {
    return {
      language: this.generalSettingsForm.language.value,
      workingDays:
        this.generalSettingsForm.workingDays.values.length > 0
          ? this.generalSettingsForm.workingDays.values
          : null,
      startOfWeek: this.generalSettingsForm.startOfWeek.value,
      workingTimeFrom: this.generalSettingsForm.workingTimeFrom.value,
      workingTimeTo: this.generalSettingsForm.workingTimeTo.value,
      timeZone: this.generalSettingsForm.timeZone.value,
      currency: this.generalSettingsForm.currency.value,
      numberFormat: this.generalSettingsForm.numberFormat.value,
      phoneFormat: this.generalSettingsForm.phoneFormat.value,
      dateFormat: this.generalSettingsForm.dateFormat.value,
      allowDuplicates: this.generalSettingsForm.allowDuplicates.value,
    };
  }

  get startOfWeekAsNumber(): Optional<number> {
    if (!this.accountSettings?.startOfWeek) return undefined;

    return DayNumberMap[this.accountSettings.startOfWeek];
  }

  get workingDaysAsNumberArray(): Nullable<number[]> {
    if (!this.accountSettings?.workingDays) return null;

    return this.accountSettings.workingDays.map(day => DayNumberMap[day as WeekDays]);
  }

  get nonWorkingDaysAsNumberArray(): Nullable<number[]> {
    const accountWorkingDays = this.workingDaysAsNumberArray;

    if (!accountWorkingDays) return null;

    const wholeWeekAsNumberArray = [0, 1, 2, 3, 4, 5, 6];

    return wholeWeekAsNumberArray.filter(d => !accountWorkingDays.includes(d));
  }

  get accountCreationYear(): Nullable<number> {
    if (!this.account) return null;

    return this.account.createdAt.year;
  }

  loadAccount = async (): Promise<void> => {
    try {
      this.account = await generalSettingsApi.getAccount();
    } catch (e) {
      throw new Error(`Failed to load account: ${e}`);
    }
  };

  loadAccountSettings = async (): Promise<void> => {
    try {
      this.accountSettings = await generalSettingsApi.getAccountSettings();
    } catch (e) {
      throw new Error(`Failed to load account settings: ${e}`);
    }
  };

  loadDemoDataExists = async (): Promise<void> => {
    try {
      this.hasDemoData = await generalSettingsApi.getDemoDataExists();
    } catch (e) {
      this.hasDemoData = false;
    }
  };

  loadData = async (): Promise<void> => {
    try {
      await Promise.all([
        this.loadAccount(),
        this.loadAccountSettings(),
        this.loadDemoDataExists(),
      ]);

      if (this.account && this.accountSettings) {
        this.generalSettingsForm.initializeFormData({
          account: this.account,
          accountSettings: this.accountSettings,
        });

        UtcDate.setLocale(this.accountSettings.language);
        UtcDate.setFormat(this.accountSettings.dateFormat);
      }
    } catch (e) {
      throw new Error(`Failed to load general settings store data: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  updateAccountSettings = async (): Promise<void> => {
    this.accountSettings = await generalSettingsApi.updateAccountSettings(
      this.updateAccountSettingsDto
    );
  };

  uploadAccountLogo = async (blob: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append('logo', blob, 'logo.jpg');

    try {
      this.account = await generalSettingsApi.uploadAccountLogo(formData);
    } catch (e) {
      throw new Error(`Failed to upload account logo: ${e}`);
    }
  };

  removeAccountLogo = async (): Promise<void> => {
    try {
      this.account = await generalSettingsApi.removeAccountLogo();
    } catch (e) {
      throw new Error(`Failed to remove account logo: ${e}`);
    }
  };

  deleteDemoData = async (): Promise<void> => {
    try {
      this.isDemoDeleting = true;

      await generalSettingsApi.deleteDemoData();

      this.hasDemoData = false;
    } catch (e) {
      throw new Error(`Failed to delete demo data: ${e}`);
    } finally {
      this.isDemoDeleting = false;
    }
  };

  clearApplicationCache = async (): Promise<void> => {
    const doNotClearKeys: string[] = [
      'accountId',
      'id_pools',
      'i18nextLng',
      'gaUserId',
      'token',
      'userId',
    ];

    for (const key in localStorage) {
      if (!doNotClearKeys.includes(key)) localStorage.removeItem(key);
    }

    window.location.reload();
  };

  reset = (): void => {
    this.isLoaded = false;
    this.account = null;
    this.accountSettings = null;
  };
}

export const generalSettingsStore = new GeneralSettingsStore();

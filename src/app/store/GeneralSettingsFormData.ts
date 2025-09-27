import type { Account, AccountSettings } from '@/modules/settings';
import { BooleanModel, InputModel, MultiselectModel, SelectModel, WeekDays } from '@/shared';
import { makeAutoObservable } from 'mobx';

export class GeneralSettingsFormData {
  companyName: InputModel;
  subdomain: InputModel;
  language: SelectModel;
  workingDays: MultiselectModel<WeekDays>;
  startOfWeek: SelectModel;
  workingTimeFrom: InputModel;
  workingTimeTo: InputModel;
  timeZone: SelectModel;
  currency: SelectModel;
  numberFormat: SelectModel;
  phoneFormat: SelectModel;
  dateFormat: SelectModel;
  allowDuplicates: BooleanModel;

  constructor() {
    makeAutoObservable(this);
  }

  initializeFormData = ({
    account,
    accountSettings,
  }: {
    account: Account;
    accountSettings: AccountSettings;
  }) => {
    this.companyName = InputModel.create(account.companyName);
    this.subdomain = InputModel.create(account.subdomain);

    this.language = SelectModel.create(accountSettings.language).required();
    this.workingDays = MultiselectModel.createFromNullable<WeekDays>(accountSettings.workingDays);
    this.startOfWeek = SelectModel.create(accountSettings.startOfWeek ?? WeekDays.MONDAY);
    this.workingTimeFrom = InputModel.create(accountSettings.workingTimeFrom);
    this.workingTimeTo = InputModel.create(accountSettings.workingTimeTo);
    this.timeZone = SelectModel.create(accountSettings.timeZone);
    this.currency = SelectModel.create(accountSettings.currency).required();
    this.numberFormat = SelectModel.create(accountSettings.numberFormat);
    this.phoneFormat = SelectModel.create(accountSettings.phoneFormat).required();
    this.dateFormat = SelectModel.create(accountSettings.dateFormat ?? null);
    this.allowDuplicates = BooleanModel.create(accountSettings.allowDuplicates);
  };
}

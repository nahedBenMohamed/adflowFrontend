import type { AccountSettingsDto } from '@/app';
import type { Currency, DateFormat, Language, Nullable, PhoneFormat, WeekDays } from '@/shared';

export class AccountSettings {
  language: Language;
  workingDays: Nullable<WeekDays[]>;
  startOfWeek: Nullable<WeekDays>;
  workingTimeFrom: Nullable<string>;
  workingTimeTo: Nullable<string>;
  timeZone: Nullable<string>;
  currency: Nullable<Currency>;
  numberFormat: Nullable<string>;
  phoneFormat: PhoneFormat;
  dateFormat: Nullable<DateFormat>;
  isBpmnEnable: boolean;
  allowDuplicates: boolean;

  constructor({
    language,
    workingDays,
    startOfWeek,
    workingTimeFrom,
    workingTimeTo,
    timeZone,
    currency,
    numberFormat,
    phoneFormat,
    dateFormat,
    isBpmnEnable,
    allowDuplicates,
  }: AccountSettings) {
    this.language = language;
    this.workingDays = workingDays;
    this.startOfWeek = startOfWeek;
    this.workingTimeFrom = workingTimeFrom;
    this.workingTimeTo = workingTimeTo;
    this.timeZone = timeZone;
    this.currency = currency;
    this.numberFormat = numberFormat;
    this.phoneFormat = phoneFormat;
    this.dateFormat = dateFormat;
    this.isBpmnEnable = isBpmnEnable;
    this.allowDuplicates = allowDuplicates;
  }

  static fromDto(account: AccountSettingsDto): AccountSettings {
    return new AccountSettings({
      language: account.language,
      workingDays: account.workingDays,
      startOfWeek: account.startOfWeek,
      workingTimeFrom: account.workingTimeFrom,
      workingTimeTo: account.workingTimeTo,
      timeZone: account.timeZone,
      currency: account.currency,
      numberFormat: account.numberFormat,
      phoneFormat: account.phoneFormat,
      dateFormat: account.dateFormat,
      isBpmnEnable: account.isBpmnEnable,
      allowDuplicates: account.allowDuplicates,
    });
  }
}

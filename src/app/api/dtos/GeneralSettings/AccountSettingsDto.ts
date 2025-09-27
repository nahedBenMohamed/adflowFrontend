import type { Currency, DateFormat, Language, Nullable, PhoneFormat, WeekDays } from '@/shared';

export interface AccountSettingsDto {
  language: Language;
  isBpmnEnable: boolean;
  phoneFormat: PhoneFormat;
  allowDuplicates: boolean;
  timeZone: Nullable<string>;
  currency: Nullable<Currency>;
  numberFormat: Nullable<string>;
  startOfWeek: Nullable<WeekDays>;
  dateFormat: Nullable<DateFormat>;
  workingDays: Nullable<WeekDays[]>;
  workingTimeTo: Nullable<string>;
  workingTimeFrom: Nullable<string>;
}

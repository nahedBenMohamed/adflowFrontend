import type { Nullable } from '@/shared';
import type { SiteFormDesign, SiteFormType } from '../../../shared';
import type { SiteFormConsentDto } from './SiteFormConsentDto';
import type { SiteFormEntityTypeDto } from './SiteFormEntityTypeDto';
import type { SiteFormGratitudeDto } from './SiteFormGratitudeDto';
import type { SiteFormPageDto } from './SiteFormPageDto';
import type { SiteFormScheduleDto } from './SiteFormScheduleDto';

export interface SiteFormDto {
  id: number;
  name: string;
  type: SiteFormType;
  code: string;
  isActive: boolean;
  title?: Nullable<string>;
  responsibleId?: Nullable<number>;
  design: Nullable<SiteFormDesign>;
  consent?: Nullable<SiteFormConsentDto>;
  gratitude?: Nullable<SiteFormGratitudeDto>;
  pages?: Nullable<SiteFormPageDto[]>;
  scheduleLimitDays?: Nullable<number>;
  scheduleLinks?: Nullable<SiteFormScheduleDto[]>;
  entityTypeLinks?: Nullable<SiteFormEntityTypeDto[]>;
  checkDuplicate?: boolean;
  isHeadless: boolean;
  multiformEnabled: boolean;
  fieldLabelEnabled: boolean;
  fieldPlaceholderEnabled: boolean;
}

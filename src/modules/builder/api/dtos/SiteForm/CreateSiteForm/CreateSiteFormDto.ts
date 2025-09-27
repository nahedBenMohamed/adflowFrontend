import type { Nullable } from '@/shared';
import type { SiteFormDesign, SiteFormType } from '../../../../shared';
import type { SiteFormEntityTypeDto } from '../SiteFormEntityTypeDto';
import type { SiteFormScheduleDto } from '../SiteFormScheduleDto';
import type { CreateSiteFormConsentDto } from './CreateSiteFormConsentDto';
import type { CreateSiteFormGratitudeDto } from './CreateSiteFormGratitudeDto';
import type { CreateSiteFormPageDto } from './CreateSiteFormPageDto';

export class CreateSiteFormDto {
  name: string;
  type: SiteFormType;
  title?: Nullable<string>;
  responsibleId?: Nullable<number>;
  design: Nullable<SiteFormDesign>;
  entityTypeLinks?: Nullable<SiteFormEntityTypeDto[]>;
  consent?: Nullable<CreateSiteFormConsentDto>;
  gratitude?: Nullable<CreateSiteFormGratitudeDto>;
  pages?: Nullable<CreateSiteFormPageDto[]>;
  scheduleLimitDays?: Nullable<number>;
  scheduleLinks?: Nullable<SiteFormScheduleDto[]>;
  checkDuplicate?: boolean;
  isHeadless: boolean;
  multiformEnabled: boolean;
  fieldLabelEnabled: boolean;
  fieldPlaceholderEnabled: boolean;

  constructor({
    name,
    type,
    title,
    responsibleId,
    design,
    entityTypeLinks,
    consent,
    gratitude,
    pages,
    scheduleLimitDays,
    scheduleLinks,
    checkDuplicate,
    isHeadless,
    multiformEnabled,
    fieldLabelEnabled,
    fieldPlaceholderEnabled,
  }: CreateSiteFormDto) {
    this.name = name;
    this.type = type;
    this.title = title;
    this.responsibleId = responsibleId;
    this.design = design;
    this.entityTypeLinks = entityTypeLinks;
    this.consent = consent;
    this.gratitude = gratitude;
    this.pages = pages;
    this.scheduleLimitDays = scheduleLimitDays;
    this.scheduleLinks = scheduleLinks;
    this.checkDuplicate = checkDuplicate;
    this.isHeadless = isHeadless;
    this.multiformEnabled = multiformEnabled;
    this.fieldLabelEnabled = fieldLabelEnabled;
    this.fieldPlaceholderEnabled = fieldPlaceholderEnabled;
  }
}

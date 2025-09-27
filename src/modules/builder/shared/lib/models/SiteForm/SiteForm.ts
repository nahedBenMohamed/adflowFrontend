import type { Nullable } from '@/shared';
import type { SiteFormDto } from '../../../../api';
import { SiteFormConsent } from './SiteFormConsent';
import type { SiteFormDesign } from './SiteFormDesign/SiteFormDesign';
import { SiteFormEntityType } from './SiteFormEntityType';
import { SiteFormGratitude } from './SiteFormGratitude';
import { SiteFormPage } from './SiteFormPage';
import { SiteFormSchedule } from './SiteFormSchedule';
import type { SiteFormType } from './SiteFormType';

export class SiteForm {
  id: number;
  name: string;
  type: SiteFormType;
  code: string;
  isActive: boolean;
  title?: Nullable<string>;
  responsibleId?: Nullable<number>;
  design: Nullable<SiteFormDesign>;
  consent?: Nullable<SiteFormConsent>;
  gratitude?: Nullable<SiteFormGratitude>;
  pages: SiteFormPage[];
  entityTypeLinks: SiteFormEntityType[];
  scheduleLimitDays?: Nullable<number>;
  scheduleLinks?: Nullable<SiteFormSchedule[]>;
  checkDuplicate?: boolean;
  isHeadless: boolean;
  multiformEnabled: boolean;
  fieldLabelEnabled: boolean;
  fieldPlaceholderEnabled: boolean;

  constructor({
    id,
    type,
    name,
    code,
    isActive,
    title,
    responsibleId,
    design,
    consent,
    gratitude,
    pages,
    entityTypeLinks,
    scheduleLimitDays,
    scheduleLinks,
    checkDuplicate,
    isHeadless,
    multiformEnabled,
    fieldLabelEnabled,
    fieldPlaceholderEnabled,
  }: SiteForm) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.code = code;
    this.isActive = isActive;
    this.title = title;
    this.responsibleId = responsibleId;
    this.design = design;
    this.consent = consent;
    this.gratitude = gratitude;
    this.pages = pages;
    this.entityTypeLinks = entityTypeLinks;
    this.scheduleLimitDays = scheduleLimitDays;
    this.scheduleLinks = scheduleLinks;
    this.checkDuplicate = checkDuplicate;
    this.isHeadless = isHeadless;
    this.multiformEnabled = multiformEnabled;
    this.fieldLabelEnabled = fieldLabelEnabled;
    this.fieldPlaceholderEnabled = fieldPlaceholderEnabled;
  }

  static fromDto(dto: SiteFormDto): SiteForm {
    return new SiteForm({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      code: dto.code,
      isActive: dto.isActive,
      title: dto.title,
      responsibleId: dto.responsibleId,
      design: dto.design,
      consent: dto.consent ? SiteFormConsent.fromDto(dto.consent) : dto.consent,
      gratitude: dto.gratitude ? SiteFormGratitude.fromDto(dto.gratitude) : dto.gratitude,
      pages: SiteFormPage.fromDtos(dto.pages ?? []),
      entityTypeLinks: SiteFormEntityType.fromDtos(dto.entityTypeLinks ?? []),
      scheduleLimitDays: dto.scheduleLimitDays,
      scheduleLinks: dto.scheduleLinks ? SiteFormSchedule.fromDtos(dto.scheduleLinks) : null,
      checkDuplicate: dto.checkDuplicate,
      isHeadless: dto.isHeadless,
      multiformEnabled: dto.multiformEnabled,
      fieldLabelEnabled: dto.fieldLabelEnabled,
      fieldPlaceholderEnabled: dto.fieldPlaceholderEnabled,
    });
  }

  static fromDtos(dtos: SiteFormDto[]): SiteForm[] {
    return dtos.map(this.fromDto);
  }
}

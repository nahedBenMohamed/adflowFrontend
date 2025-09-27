import type { Schedule } from '@/modules/scheduler';
import {
  BooleanModel,
  CheckboxModel,
  InputModel,
  SelectModel,
  validateForm,
  type Nullable,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { SiteFormEntityTypeDto, SiteFormScheduleDto } from '../../../../../api';
import type { SiteForm } from '../SiteForm';
import type { SiteFormEntityType } from '../SiteFormEntityType';
import type { SiteFormSchedule } from '../SiteFormSchedule';
import { SiteFormEntityTypeLinkModel } from './SiteFormEntityTypeLinkModel';

export class OnlineBookingSiteFormInitializationFormData {
  name: InputModel;
  responsibleId: SelectModel;
  checkDuplicate: BooleanModel;
  scheduleLimitDays: InputModel;

  linkedEntityTypeLink: Nullable<SiteFormEntityTypeLinkModel>;

  scheduleLinksCheckboxModel: CheckboxModel;
  linkedEntityTypeLinkModel: CheckboxModel;

  constructor({
    name,
    responsibleId,
    checkDuplicate,
    scheduleLimitDays,
    siteFormEntityTypes,
    siteFormSchedules,
    schedules,
  }: {
    name: string;
    checkDuplicate: boolean;
    responsibleId: Nullable<number>;
    scheduleLimitDays: Nullable<number>;
    siteFormEntityTypes: SiteFormEntityType[];
    siteFormSchedules: SiteFormSchedule[];
    schedules: Schedule[];
  }) {
    this.name = InputModel.create(name).required();
    this.checkDuplicate = BooleanModel.create(checkDuplicate);
    this.responsibleId = SelectModel.create(responsibleId).required();
    this.scheduleLimitDays = InputModel.createFromNumber(scheduleLimitDays ?? 30)
      .required()
      .min(1)
      .max(730);

    this.scheduleLinksCheckboxModel = CheckboxModel.create(
      siteFormSchedules.map(s => s.scheduleId)
    ).required();

    this.linkedEntityTypeLinkModel = CheckboxModel.create(
      siteFormEntityTypes[0]?.entityTypeId ? [siteFormEntityTypes[0].entityTypeId] : []
    );

    if (siteFormEntityTypes[0]) {
      this.linkedEntityTypeLink = SiteFormEntityTypeLinkModel.initializeModel(
        siteFormEntityTypes[0]
      );
    } else {
      this.initializeLinkedEntityTypeLink(schedules);
    }

    makeAutoObservable(this);
  }

  static empty({
    defaultTitle,
    schedules,
  }: {
    defaultTitle: string;
    schedules: Schedule[];
  }): OnlineBookingSiteFormInitializationFormData {
    return new OnlineBookingSiteFormInitializationFormData({
      schedules,
      name: defaultTitle,
      responsibleId: null,
      checkDuplicate: true,
      scheduleLimitDays: null,
      siteFormEntityTypes: [],
      siteFormSchedules: [],
    });
  }

  static fromModel({
    siteForm,
    schedules,
  }: {
    siteForm: SiteForm;
    schedules: Schedule[];
  }): OnlineBookingSiteFormInitializationFormData {
    return new OnlineBookingSiteFormInitializationFormData({
      schedules,
      name: siteForm.name,
      responsibleId: siteForm.responsibleId ?? null,
      checkDuplicate: siteForm.checkDuplicate ?? false,
      scheduleLimitDays: siteForm.scheduleLimitDays ?? null,
      siteFormEntityTypes: siteForm.entityTypeLinks,
      siteFormSchedules: siteForm.scheduleLinks ?? [],
    });
  }

  get allLinkedToFormEntityTypeIds(): number[] {
    return this.linkedEntityTypeLinkModel.values.length
      ? [this.linkedEntityTypeLinkModel.values[0]]
      : [];
  }

  get siteFormEntityTypesDtos(): SiteFormEntityTypeDto[] {
    return this.linkedEntityTypeLink && this.linkedEntityTypeLinkModel.values.length
      ? [
          {
            isMain: true,
            entityTypeId: this.linkedEntityTypeLink.entityTypeId,
            boardId: this.linkedEntityTypeLink.boardId.value,
          },
        ]
      : [];
  }

  get siteFormSchedulesDtos(): SiteFormScheduleDto[] {
    return this.scheduleLinksCheckboxModel.values.map(v => ({ scheduleId: v }));
  }

  reinitializeLinkedEntityTypeLink = (schedules: Schedule[]) => {
    const previousLinkedEntityType = this.linkedEntityTypeLink?.entityTypeId;

    this.initializeLinkedEntityTypeLink(schedules);

    if (this.linkedEntityTypeLink?.entityTypeId !== previousLinkedEntityType)
      this.linkedEntityTypeLinkModel = CheckboxModel.create([]);
  };

  initializeLinkedEntityTypeLink = (schedules: Schedule[]): void => {
    const linkedEntityTypes = schedules
      .filter(s => this.scheduleLinksCheckboxModel.values.includes(s.id))
      .map(s => s.entityTypeId)
      .filter(Boolean);

    const linkedEntityTypesSet = new Set(linkedEntityTypes);

    if (linkedEntityTypesSet.size !== 1) {
      this.linkedEntityTypeLink = null;

      return;
    }

    if (linkedEntityTypes[0])
      this.linkedEntityTypeLink = SiteFormEntityTypeLinkModel.initializeModel({
        entityTypeId: linkedEntityTypes[0],
        boardId: null,
      });
  };

  validate = (): boolean => {
    return validateForm(this);
  };
}

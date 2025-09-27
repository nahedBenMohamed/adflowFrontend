import { entityTypeStore } from '@/app';
import {
  BooleanModel,
  CheckboxModel,
  InputModel,
  SelectModel,
  validateForm,
  type Nullable,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { SiteFormEntityTypeDto } from '../../../../../api';
import type { SiteForm } from '../SiteForm';
import type { SiteFormEntityType } from '../SiteFormEntityType';
import { SiteFormEntityTypeLinkModel } from './SiteFormEntityTypeLinkModel';

export class SiteFormInitializationFormData {
  name: InputModel;
  responsibleId: SelectModel;
  checkDuplicate: BooleanModel;

  mainEntityTypeLinks: SiteFormEntityTypeLinkModel[];
  linkedEntityTypeLinks: SiteFormEntityTypeLinkModel[];

  mainEntityTypeLinkModel: InputModel;
  linkedEntityTypeLinksCheckboxModel: CheckboxModel;

  private _siteFormEntityTypes: SiteFormEntityType[] = [];

  constructor({
    name,
    responsibleId,
    checkDuplicate,
    siteFormEntityTypes,
  }: {
    name: string;
    responsibleId: Nullable<number>;
    checkDuplicate: boolean;
    siteFormEntityTypes: SiteFormEntityType[];
  }) {
    this.name = InputModel.create(name).required();
    this.checkDuplicate = BooleanModel.create(checkDuplicate);
    this.responsibleId = SelectModel.create(responsibleId).required();
    this._siteFormEntityTypes = siteFormEntityTypes;

    const mainEntityTypeLink = siteFormEntityTypes.find(l => l.isMain);

    if (!mainEntityTypeLink && siteFormEntityTypes.length > 0)
      throw new Error(
        `Main entity type link was not found in provided entityTypeLinks ${JSON.stringify(siteFormEntityTypes)}, failed to initialize SiteFormInitializationFormData`
      );

    this.mainEntityTypeLinkModel = InputModel.createFromNumber(
      mainEntityTypeLink?.entityTypeId ??
        entityTypeStore.firstDealEntityTypeId ??
        entityTypeStore.firstEntityTypeId
    ).required();

    this.mainEntityTypeLinks = SiteFormEntityTypeLinkModel.initializeMainModels({
      entityTypeLinks: siteFormEntityTypes,
      mainLinkId: this.mainEntityTypeLinkModel.asNumber(),
    });

    this.initializeLinkedEntityTypeLinks();

    this.linkedEntityTypeLinksCheckboxModel = CheckboxModel.create(
      this.linkedEntityTypeLinks
        .filter(l => this._siteFormEntityTypes.find(et => et.entityTypeId === l.entityTypeId))
        .map<number>(l => l.entityTypeId)
    );

    makeAutoObservable(this);
  }

  static empty({ defaultTitle }: { defaultTitle: string }): SiteFormInitializationFormData {
    return new SiteFormInitializationFormData({
      name: defaultTitle,
      responsibleId: null,
      checkDuplicate: true,
      siteFormEntityTypes: [],
    });
  }

  static fromModel(siteForm: SiteForm): SiteFormInitializationFormData {
    return new SiteFormInitializationFormData({
      name: siteForm.name,
      responsibleId: siteForm.responsibleId ?? null,
      siteFormEntityTypes: siteForm.entityTypeLinks,
      checkDuplicate: siteForm.checkDuplicate ?? false,
    });
  }

  get allLinkedToFormEntityTypeIds(): number[] {
    return [
      this.mainEntityTypeLinkModel.asNumber(),
      ...this.linkedEntityTypeLinksCheckboxModel.values,
    ];
  }

  get siteFormEntityTypesDtos(): SiteFormEntityTypeDto[] {
    return [
      ...this.mainEntityTypeLinks
        .filter(l => l.entityTypeId === this.mainEntityTypeLinkModel.asNumber())
        .map<SiteFormEntityTypeDto>(l => ({
          isMain: true,
          entityTypeId: l.entityTypeId,
          boardId:
            // TODO: preserve previous logic: l.boardId.value ?? boardStore.getFirstEntityTypeBoard(l.entityTypeId)?.id ??
            //  null,
            l.boardId.value ?? null,
        })),
      ...this.linkedEntityTypeLinks
        .filter(
          l =>
            l.entityTypeId !== this.mainEntityTypeLinkModel.asNumber() &&
            this.linkedEntityTypeLinksCheckboxModel.values.includes(l.entityTypeId)
        )
        .map<SiteFormEntityTypeDto>(l => ({
          isMain: false,
          entityTypeId: l.entityTypeId,
          boardId: l.boardId.value ?? null,
        })),
    ];
  }

  initializeLinkedEntityTypeLinks = (): void => {
    const mainEntityType = entityTypeStore.getById(this.mainEntityTypeLinkModel.asNumber());
    const linkedEntityTypesToMainIds = mainEntityType.linkedEntityTypes.map<number>(
      l => l.targetId
    );

    this.linkedEntityTypeLinks = SiteFormEntityTypeLinkModel.initializeLinkedModelsTest({
      linkedEntityTypeIds: linkedEntityTypesToMainIds,
      entityTypeLinks: this._siteFormEntityTypes,
    });
  };

  validate = (): boolean => {
    return validateForm(this);
  };
}

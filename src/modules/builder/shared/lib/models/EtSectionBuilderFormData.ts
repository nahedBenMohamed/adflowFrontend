import { iconStore } from '@/app';
import {
  FieldGroupsStore,
  FieldsStore,
  ProjectFieldsSettings,
  type Field,
  type FieldGroup,
} from '@/modules/fields';
import { allTaskFieldCodes, type TaskFieldCode } from '@/modules/tasks';
import {
  CheckboxModel,
  IconName,
  InputModel,
  SectionView,
  type EntityCategory,
  type EntityType,
  type EntityTypeLink,
  type FeatureCode,
} from '@/shared';
import type { TFunction } from 'i18next';
import { makeAutoObservable } from 'mobx';

export class EtSectionBuilderFormData {
  sectionName: InputModel;
  entityName: InputModel;
  fieldGroupsStore: FieldGroupsStore;
  fieldsStore: FieldsStore;
  featureCodes: FeatureCode[];
  taskSettingsActiveFields: TaskFieldCode[];
  fieldsSettings: ProjectFieldsSettings;
  linkedEntities: EntityTypeLink[];
  sectionView: CheckboxModel;
  sectionIcon: IconName;
  linkedProductsSectionIds: number[];
  linkedSchedulerIds: number[];

  constructor({
    sectionName,
    entityName,
    fieldGroups,
    fields,
    featureCodes,
    taskSettingsActiveFields,
    fieldsSettings,
    linkedEntities,
    sectionView,
    sectionIcon,
    linkedProductsSectionIds,
    linkedSchedulerIds,
    analyticsGroupName,
    requisitesGroupName,
    t,
  }: {
    sectionName: string;
    entityName: string;
    fieldGroups: FieldGroup[];
    fields: Field[];
    featureCodes: FeatureCode[];
    taskSettingsActiveFields: TaskFieldCode[];
    fieldsSettings: ProjectFieldsSettings;
    linkedEntities: EntityTypeLink[];
    sectionView: SectionView;
    sectionIcon: IconName;
    linkedProductsSectionIds: number[];
    linkedSchedulerIds: number[];
    analyticsGroupName?: string;
    requisitesGroupName?: string;
    t: TFunction;
  }) {
    this.sectionName = InputModel.create(sectionName).required();
    this.entityName = InputModel.create(entityName).required();
    this.fieldGroupsStore = new FieldGroupsStore({
      fieldGroups,
      analyticsGroupName,
      requisitesGroupName,
    });
    this.fieldsStore = new FieldsStore({ initialFields: fields, t });
    this.fieldGroupsStore.setFieldsStore(this.fieldsStore);
    this.featureCodes = featureCodes;
    this.taskSettingsActiveFields = taskSettingsActiveFields;
    this.fieldsSettings = fieldsSettings;
    this.linkedEntities = linkedEntities;
    this.sectionView = CheckboxModel.create(
      sectionView === SectionView.BOARD ? [SectionView.BOARD, SectionView.LIST] : [SectionView.LIST]
    ).required();
    this.sectionIcon = sectionIcon;
    this.linkedProductsSectionIds = linkedProductsSectionIds;
    this.linkedSchedulerIds = linkedSchedulerIds;

    makeAutoObservable(this);
  }

  static empty({
    analyticsGroupName,
    defaultTitle = '',
    requisitesGroupName,
    entityCategory,
    t,
  }: {
    analyticsGroupName?: string;
    requisitesGroupName?: string;
    defaultTitle?: string;
    entityCategory?: EntityCategory;
    t: TFunction;
  }): EtSectionBuilderFormData {
    return new EtSectionBuilderFormData({
      sectionName: defaultTitle,
      entityName: '',
      fieldGroups: [],
      fields: [],
      featureCodes: [],
      taskSettingsActiveFields: allTaskFieldCodes,
      fieldsSettings: new ProjectFieldsSettings([]),
      linkedEntities: [],
      sectionView: SectionView.BOARD,
      sectionIcon: entityCategory
        ? iconStore.getDefaultIconByEntityCategory(entityCategory).name
        : IconName.BULB,
      linkedProductsSectionIds: [],
      linkedSchedulerIds: [],
      analyticsGroupName,
      requisitesGroupName,
      t,
    });
  }

  static fromEntityType({
    entityType,
    taskActiveFields,
    fieldsSettings,
    t,
  }: {
    entityType: EntityType;
    taskActiveFields: TaskFieldCode[];
    fieldsSettings: ProjectFieldsSettings;
    t: TFunction;
  }): EtSectionBuilderFormData {
    return new EtSectionBuilderFormData({
      fieldsSettings,
      entityName: entityType.name,
      sectionView: entityType.section.view,
      sectionName: entityType.section.name,
      sectionIcon: entityType.section.icon,
      featureCodes: entityType.featureCodes,
      taskSettingsActiveFields: taskActiveFields,
      linkedEntities: entityType.linkedEntityTypes,
      linkedSchedulerIds: entityType.linkedSchedulerIds,
      fields: entityType.fields.map(f => f.addInitialState()),
      linkedProductsSectionIds: entityType.linkedProductsSectionIds,
      fieldGroups: entityType.fieldGroups.map(fg => fg.addInitialState()),
      t,
    });
  }

  setTaskSettingsActiveFields = (activeFields: TaskFieldCode[]): void => {
    this.taskSettingsActiveFields = activeFields;
  };

  setFieldsSettings = (fieldsSettings: ProjectFieldsSettings): void => {
    this.fieldsSettings = fieldsSettings;
  };

  setLinkedEntities = (linkedEntities: EntityTypeLink[]): void => {
    this.linkedEntities = linkedEntities;
  };

  setSectionIcon = (sectionIcon: IconName): void => {
    this.sectionIcon = sectionIcon;
  };

  setFeatureCodes = (featureCodes: FeatureCode[]): void => {
    this.featureCodes = featureCodes;
  };

  setLinkedProductsSectionIds = (linkedProductsSectionIds: number[]): void => {
    this.linkedProductsSectionIds = linkedProductsSectionIds;
  };

  setLinkedSchedulerIds = (linkedSchedulerIds: number[]): void => {
    this.linkedSchedulerIds = linkedSchedulerIds;
  };
}

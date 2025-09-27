import { type FieldDto, type FieldGroupDto, type ProjectFieldsSettings } from '@/modules/fields';
import { type TaskFieldCode } from '@/modules/tasks';
import { type EntityCategory, type EntityTypeLink, type FeatureCode, type Section } from '@/shared';

export class UpdateEntityTypeDto {
  id: number;
  name: string;
  entityCategory: EntityCategory;
  section: Section;
  fieldGroups: FieldGroupDto[];
  fields: FieldDto[];
  linkedEntityTypes: EntityTypeLink[];
  featureCodes: FeatureCode[];
  taskSettingsActiveFields?: TaskFieldCode[];
  linkedProductsSectionIds?: number[];
  linkedSchedulerIds?: number[];
  fieldsSettings?: ProjectFieldsSettings;
  sortOrder?: number;

  constructor({
    id,
    name,
    entityCategory,
    section,
    fieldGroups,
    fields,
    linkedEntityTypes,
    featureCodes,
    taskSettingsActiveFields,
    linkedProductsSectionIds,
    linkedSchedulerIds,
    fieldsSettings,
    sortOrder,
  }: UpdateEntityTypeDto) {
    this.id = id;
    this.name = name;
    this.entityCategory = entityCategory;
    this.section = section;
    this.fieldGroups = fieldGroups;
    this.fields = fields;
    this.linkedEntityTypes = linkedEntityTypes;
    this.featureCodes = featureCodes;
    this.taskSettingsActiveFields = taskSettingsActiveFields;
    this.linkedProductsSectionIds = linkedProductsSectionIds;
    this.linkedSchedulerIds = linkedSchedulerIds;
    this.fieldsSettings = fieldsSettings;
    this.sortOrder = sortOrder;
  }
}

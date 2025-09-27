import type { EntityTypeDto } from '@/app';
import { Field, FieldGroup } from '@/modules/fields';
import type { FeatureCode } from '../Feature/FeatureCode';
import { UtcDate } from '../UtcDate';
import { EntityCategory } from './EntityCategory';
import type { EntityTypeLink } from './EntityTypeLink';
import type { Section } from './Section';

export class EntityType {
  id: number;
  name: string;
  entityCategory: EntityCategory;
  section: Section;
  fieldGroups: FieldGroup[];
  fields: Field[];
  linkedEntityTypes: EntityTypeLink[];
  featureCodes: FeatureCode[];
  createdAt: UtcDate;
  sortOrder: number;
  linkedProductsSectionIds: number[];
  linkedSchedulerIds: number[];

  constructor({
    id,
    name,
    fields,
    section,
    createdAt,
    sortOrder,
    fieldGroups,
    featureCodes,
    entityCategory,
    linkedEntityTypes,
    linkedSchedulerIds,
    linkedProductsSectionIds,
  }: {
    id: number;
    name: string;
    fields: Field[];
    section: Section;
    sortOrder: number;
    createdAt: UtcDate;
    fieldGroups: FieldGroup[];
    featureCodes: FeatureCode[];
    linkedSchedulerIds: number[];
    entityCategory: EntityCategory;
    linkedProductsSectionIds: number[];
    linkedEntityTypes: EntityTypeLink[];
  }) {
    this.id = id;
    this.name = name;
    this.fields = fields;
    this.section = section;
    this.createdAt = createdAt;
    this.sortOrder = sortOrder;
    this.fieldGroups = fieldGroups;
    this.featureCodes = featureCodes;
    this.entityCategory = entityCategory;
    this.linkedEntityTypes = linkedEntityTypes;
    this.linkedSchedulerIds = linkedSchedulerIds;
    this.linkedProductsSectionIds = linkedProductsSectionIds;
  }

  static fromDto(dto: EntityTypeDto): EntityType {
    return new EntityType({
      id: dto.id,
      name: dto.name,
      entityCategory: dto.entityCategory,
      section: dto.section,
      fieldGroups: FieldGroup.fromDtos(dto.fieldGroups),
      fields: Field.fromDtos(dto.fields),
      linkedEntityTypes: dto.linkedEntityTypes,
      featureCodes: dto.featureCodes,
      createdAt: UtcDate.parseISO(dto.createdAt),
      sortOrder: dto.sortOrder,
      linkedProductsSectionIds: dto.linkedProductsSectionIds,
      linkedSchedulerIds: dto.linkedSchedulerIds,
    });
  }

  static fromDtos(dtos: EntityTypeDto[]): EntityType[] {
    return dtos.map(EntityType.fromDto);
  }

  get displayFields(): Field[] {
    return this.fields
      .slice()
      .filter(f => !f.isDeleted())
      .sort((f1, f2) => f1.sortOrder - f2.sortOrder)
      .sort((f1, f2) => {
        // the field associated with the group having the lower sort order should be higher when we're displaying all fields
        if (!f1.fieldGroupId || !f2.fieldGroupId || f1.fieldGroupId === f2.fieldGroupId) return 0;

        if (!f1.fieldGroupId && f2.fieldGroupId) return -1;

        if (f1.fieldGroupId && !f2.fieldGroupId) return 1;

        const f1Group = this.getFieldGroupById(f1.fieldGroupId);
        const f2Group = this.getFieldGroupById(f2.fieldGroupId);

        return f1Group.sortOrder - f2Group.sortOrder;
      });
  }

  get sortedLinkedEntityTypes(): EntityTypeLink[] {
    return this.linkedEntityTypes.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getFieldsByFieldGroupId = (fieldGroupId: number): Field[] => {
    return this.fields
      .filter(f => f.fieldGroupId === fieldGroupId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  getFieldById = (fieldId: number): Field => {
    const field = this.fields.find(f => f.id === fieldId);

    if (!field)
      throw new Error(
        `Field ${fieldId} was not found in entity type ${this.section.name} ${this.id}`
      );

    return field;
  };

  getFieldGroupById = (fieldGroupId: number): FieldGroup => {
    const fieldGroup = this.fieldGroups.find(f => f.id === fieldGroupId);

    if (!fieldGroup)
      throw new Error(
        `Field group ${fieldGroupId} was not found in entity type ${this.section.name} ${this.id}`
      );

    return fieldGroup;
  };

  hasFeature = (featureCode: FeatureCode): boolean => {
    return this.featureCodes.includes(featureCode);
  };

  isProjectCategory = (): boolean => {
    return this.entityCategory === EntityCategory.PROJECT;
  };

  isContactCategory = (): boolean => {
    return this.entityCategory === EntityCategory.CONTACT;
  };

  isCompanyCategory = (): boolean => {
    return this.entityCategory === EntityCategory.COMPANY;
  };

  isPartnerCategory = (): boolean => {
    return this.entityCategory === EntityCategory.PARTNER;
  };

  isUniversalCategory = (): boolean => {
    return this.entityCategory === EntityCategory.UNIVERSAL;
  };

  isContractorCategory = (): boolean => {
    return this.entityCategory === EntityCategory.CONTRACTOR;
  };

  isHRCategory = (): boolean => {
    return this.entityCategory === EntityCategory.HR;
  };

  isSupplierCategory = (): boolean => {
    return this.entityCategory === EntityCategory.SUPPLIER;
  };

  isDealCategory = (): boolean => {
    return this.entityCategory === EntityCategory.DEAL;
  };
}

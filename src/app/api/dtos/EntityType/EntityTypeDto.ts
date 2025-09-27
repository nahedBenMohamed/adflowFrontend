import type { FieldDto, FieldGroupDto } from '@/modules/fields';
import type { EntityCategory, EntityTypeLink, FeatureCode, Section } from '@/shared';

export interface EntityTypeDto {
  id: number;
  name: string;
  section: Section;
  createdAt: string;
  sortOrder: number;
  fields: FieldDto[];
  featureCodes: FeatureCode[];
  fieldGroups: FieldGroupDto[];
  linkedSchedulerIds: number[];
  entityCategory: EntityCategory;
  linkedProductsSectionIds: number[];
  linkedEntityTypes: EntityTypeLink[];
}

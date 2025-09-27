import { type Field, type FieldGroup, type ProjectFieldsSettings } from '@/modules/fields';
import { type TaskFieldCode } from '@/modules/tasks';
import { type EntityTypeLink, type FeatureCode, type Section, type SectionView } from '@/shared';

export interface EtSectionBuilderModel {
  name: string;
  entityCategory: string;
  fieldGroups: FieldGroup[];
  fields: Field[];
  featureCodes: FeatureCode[];
  taskSettingsActiveFields: TaskFieldCode[];
  section: Section;
  fieldsSettings: ProjectFieldsSettings;
  sectionView?: SectionView;
  linkedEntityTypes?: EntityTypeLink[];
  boardId?: number;
  linkedProductsSectionIds: number[];
  linkedSchedulerIds: number[];
}

import {
  boardApiUtil,
  entityTypeApi,
  entityTypeStore,
  identityStore,
  stageApiUtil,
  UpdateEntityTypeDto,
} from '@/app';
import {
  Field,
  FieldGroup,
  FieldGroupCode,
  FieldsStoreErrorCode,
  ProjectFieldsSettings,
} from '@/modules/fields';
import { taskSettingsStore } from '@/modules/tasks';
import {
  type EntityCategory,
  type EntityType,
  type EntityTypeLink,
  ErrorCode,
  FeatureCode,
  type Nullable,
  type Optional,
  SectionView,
  type ServiceError,
} from '@/shared';
import type { AxiosError } from 'axios';
import type { TFunction } from 'i18next';
import { makeAutoObservable } from 'mobx';
import {
  EtSectionBuilderFormData,
  type EtSectionBuilderModel,
  mapModuleCategoryToEntityCategory,
  type ModuleCategory,
} from '../shared';

export class EtSectionBuilderStore {
  data: EtSectionBuilderFormData;
  currentEntityTypeId: Nullable<number> = null;
  entityCategory: Nullable<EntityCategory> = null;

  isLoaded = false;
  isLoading = false;
  isUpdating = false;
  isCreatingFinalEntityType = false;

  showEntityTypeUsedInFormulaWarning: () => void;

  private readonly _t: TFunction;

  constructor({
    entityTypeId,
    moduleCategory,
    showEntityTypeUsedInFormulaWarning,
    analyticsGroupName,
    t,
  }: {
    entityTypeId: Nullable<number>;
    moduleCategory: Nullable<ModuleCategory>;
    showEntityTypeUsedInFormulaWarning: () => void;
    analyticsGroupName?: string;
    t: TFunction;
  }) {
    this.data = EtSectionBuilderFormData.empty({ analyticsGroupName, t });

    this.showEntityTypeUsedInFormulaWarning = showEntityTypeUsedInFormulaWarning;

    this.currentEntityTypeId = entityTypeId;

    if (moduleCategory) this.entityCategory = mapModuleCategoryToEntityCategory(moduleCategory);

    this._t = t;

    makeAutoObservable(this);
  }

  initSection = (t: TFunction): void => {
    this.data = EtSectionBuilderFormData.empty({
      analyticsGroupName: t('analytics'),
      requisitesGroupName: t('requisites'),
      defaultTitle: this.entityCategory ? t(`default_titles.${this.entityCategory}`) : '',
      entityCategory: this.entityCategory ?? undefined,
      t,
    });

    this.data.fieldGroupsStore.setFieldGroups([
      FieldGroup.create({
        id: identityStore.getFieldGroupId(),
        name: t('details'),
        sortOrder: 0,
        code: FieldGroupCode.DETAILS,
      }),
    ]);
  };

  addNoteFeatureIfNotExists = (): void => {
    if (!this.data.featureCodes.includes(FeatureCode.NOTE))
      this.data.featureCodes.push(FeatureCode.NOTE);
  };

  makeFinalEntityType = async (): Promise<EntityType> => {
    try {
      this.isCreatingFinalEntityType = true;

      const linkedEntityTypes = this.data.linkedEntities;

      this.addNoteFeatureIfNotExists();

      if (this.isEditMode()) return await this.updateEntityType(linkedEntityTypes);

      return await this.createEntityType(linkedEntityTypes);
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.FIELD_DUPLICATE_NAME)
        this.data.fieldsStore.setErrorCode(FieldsStoreErrorCode.DUPLICATE_NAME, {
          fieldName: serviceError.details?.fieldName,
        });

      throw new Error(`Failed to create entity type: ${e}`);
    } finally {
      // so that navigation happens before finished loading state is displayed, for better UX
      setTimeout(() => {
        this.isCreatingFinalEntityType = false;
      }, 200);
    }
  };

  getSectionView = (): SectionView.BOARD | SectionView.LIST => {
    return this.data.sectionView.values.includes(SectionView.BOARD)
      ? SectionView.BOARD
      : SectionView.LIST;
  };

  invalidateBoardsAndStagesInCache = async (): Promise<void> => {
    await Promise.all([boardApiUtil.invalidateBoards(), stageApiUtil.invalidateStages()]);
  };

  createEntityType = async (linkedEntityTypes: EntityTypeLink[]): Promise<EntityType> => {
    const data = this.data;

    if (!this.entityCategory)
      throw new Error(
        `Failed to created entity type: entityCategory must be specified, received ${this.entityCategory}`
      );

    const entityType: EtSectionBuilderModel = {
      name: data.entityName.value,
      entityCategory: this.entityCategory,
      fieldGroups: data.fieldGroupsStore.allFieldGroups,
      fields: data.fieldsStore.allFields,
      featureCodes: data.featureCodes,
      taskSettingsActiveFields: data.taskSettingsActiveFields,
      fieldsSettings: data.fieldsSettings,
      linkedEntityTypes: linkedEntityTypes,
      section: {
        icon: data.sectionIcon,
        name: data.sectionName.value,
        view: this.getSectionView(),
      },
      linkedProductsSectionIds: data.linkedProductsSectionIds,
      linkedSchedulerIds: data.linkedSchedulerIds,
    };

    const createdEntityType = await entityTypeApi.createEntityType(entityType);

    const invalidatePromises = [
      this.invalidateBoardsAndStagesInCache(),
      entityTypeStore.invalidateEntityTypesInCache(),
    ];

    if (data.featureCodes.includes(FeatureCode.TASK))
      invalidatePromises.push(taskSettingsStore.invalidateTaskSettingsInCache());

    await Promise.all(invalidatePromises);

    return createdEntityType;
  };

  updateEntityType = async (linkedEntityTypes: EntityTypeLink[]): Promise<EntityType> => {
    if (!this.currentEntityTypeId)
      throw new Error(
        `Failed to update entity type: currentEntityTypeId must be specified, received ${this.currentEntityTypeId}`
      );

    if (!this.entityCategory)
      throw new Error(
        `Failed to created entity type: entityCategory must be specified, received ${this.entityCategory}`
      );

    try {
      this.isUpdating = true;

      const data = this.data;

      const dto = new UpdateEntityTypeDto({
        id: this.currentEntityTypeId,

        name: data.entityName.value,
        entityCategory: this.entityCategory,
        section: {
          icon: this.data.sectionIcon,
          name: this.data.sectionName.value,
          view: this.getSectionView(),
        },
        fieldGroups: FieldGroup.toDtos(data.fieldGroupsStore.allFieldGroups),
        fields: Field.toDtos(data.fieldsStore.allFields),
        linkedEntityTypes,
        featureCodes: this.data.featureCodes,
        taskSettingsActiveFields: data.taskSettingsActiveFields,
        fieldsSettings: data.fieldsSettings,
        linkedProductsSectionIds: data.linkedProductsSectionIds,
        linkedSchedulerIds: data.linkedSchedulerIds,
      });

      const updated = await entityTypeApi.updateEntityType(dto);

      const invalidatePromises = [
        this.invalidateBoardsAndStagesInCache(),
        entityTypeStore.invalidateEntityTypesInCache(),
      ];

      if (data.featureCodes.includes(FeatureCode.TASK))
        invalidatePromises.push(taskSettingsStore.invalidateTaskSettingsInCache());

      await Promise.all(invalidatePromises);

      return updated;
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.ENTITY_TYPE_FIELD_USED_IN_FORMULA)
        this.showEntityTypeUsedInFormulaWarning();

      throw new Error(`Failed to update entity type: ${e}`);
    } finally {
      this.isUpdating = false;
    }
  };

  isEditMode = (): boolean => {
    return Boolean(this.currentEntityTypeId);
  };

  loadData = async (entityTypeId: number): Promise<void> => {
    try {
      this.isLoading = true;

      const entityType = entityTypeStore.getById(entityTypeId);

      const taskSettings = await taskSettingsStore.findByEntityTypeId(entityTypeId);
      const taskActiveFields = taskSettings.activeFields;

      const fieldsSettings = new ProjectFieldsSettings(
        entityType.fields
          .filter(f => f.code && f.active)
          .map(f => f.code)
          .filter(Boolean)
      );

      this.data = EtSectionBuilderFormData.fromEntityType({
        entityType,
        taskActiveFields,
        fieldsSettings,
        t: this._t,
      });

      this.currentEntityTypeId = entityTypeId;
      this.entityCategory = entityType.entityCategory;
    } catch (e) {
      throw new Error(`Failed to load entity type ${entityTypeId} data: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };
}

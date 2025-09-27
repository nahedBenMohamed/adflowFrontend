import {
  entityTypeApi,
  entityTypeStore,
  routes,
  stageApiUtil,
  UpdateEntityTypeDto,
  UpdateEntityTypeFieldsModel,
} from '@/app';
import { authStore } from '@/modules/auth';
import {
  Field,
  type FieldCode,
  FieldGroup,
  FieldGroupsStore,
  FieldSettingsStore,
  FieldsStore,
  FieldsStoreErrorCode,
  FieldUtil,
  FieldValuesStore,
  type ProjectFieldsSettings,
} from '@/modules/fields';
import { CreateSimpleEntityDto, entityApi, UpdateEntityDto } from '@/modules/section';
import {
  type Entity,
  EntityApiUtil,
  type EntityType,
  ErrorCode,
  FeedItemFilter,
  InputModel,
  JsonStateHelper,
  type Nullable,
  ObjectState,
  type Optional,
  SectionView,
  SelectModel,
  type ServiceError,
  type Stage,
  UtcDate,
  validateForm,
} from '@/shared';
import { type AxiosError, HttpStatusCode } from 'axios';
import type { TFunction } from 'i18next';
import { computed, makeAutoObservable } from 'mobx';
import type { NavigateFunction, To } from 'react-router-dom';
import { CardSavedEvent, MutationWarningCode } from '../shared';
import { CardFilesStore } from './CardFilesStore';
import { EntityTypeLinksStore } from './EntityTypeLinksStore';
import { LinkedEntityStore } from './LinkedEntityStore';

export type ShowMutationHandler = () => void;
export type SetMutationWarningCodeHandler = (code: Nullable<MutationWarningCode>) => void;
export type GetLinkedEntityTypeFieldSettingsStore = (entityTypeId: number) => FieldSettingsStore;
export type FieldRequiredErrorHandler = ({
  stageId,
  fieldsSettingsStore,
  fieldValuesStore,
}: {
  stageId: number;
  fieldsSettingsStore: FieldSettingsStore;
  fieldValuesStore: FieldValuesStore;
}) => void;

interface EntityTypeLinksFieldSettingsStoreRecord {
  entityTypeId: number;
  store: FieldSettingsStore;
}

export class CardStore {
  entityTypeId: number;

  entity: Nullable<Entity> = null;
  entityType: Nullable<EntityType> = null;

  entityName: InputModel;
  responsibleUserId: SelectModel;
  entityStageId: Nullable<number> = null;

  // used only to get stages on card creation
  boardId: Optional<number>;

  stages: Stage[] = [];

  fieldsStore: FieldsStore;
  filesStore: CardFilesStore;
  fieldGroupsStore: FieldGroupsStore;
  fieldValuesStore: FieldValuesStore;
  linkedEntityStore: LinkedEntityStore;
  fieldsSettingsStore: FieldSettingsStore;
  entityTypeLinksStore: Nullable<EntityTypeLinksStore> = null;
  entityTypeLinksFieldsSettingsStores: EntityTypeLinksFieldSettingsStoreRecord[] = [];

  entityJsonState: Nullable<JsonStateHelper> = null;
  entityTypeJsonState: Nullable<JsonStateHelper> = null;

  isLoaded = false;
  isRevalidating = false;
  isSavingCard = false;
  isCancelingCard = false;

  activeFilter = FeedItemFilter.ALL;

  isFieldsEditMode = false;

  mutationWarningCode: Nullable<MutationWarningCode> = null;
  fieldUsedInFormulaId: Nullable<number> = null;
  fieldFormulaCircularDependencyId: Nullable<number> = null;

  showMutationWarning: ShowMutationHandler;
  showFieldUsedInFormulaWarning: ShowMutationHandler;
  showFieldFormulaCircularDependencyWarning: ShowMutationHandler;

  navigate: NavigateFunction;

  // used to navigate back on card creation cancel
  backLinkUrl?: string;

  constructor({
    boardId,
    backLinkUrl,
    entityTypeId,
    analyticsGroupName,
    requisitesGroupName,
    showMutationWarning,
    showFieldUsedInFormulaWarning,
    showFieldFormulaCircularDependencyWarning,
    navigate,
    t,
  }: {
    entityTypeId: number;
    backLinkUrl?: string;
    boardId?: Optional<number>;
    analyticsGroupName?: string;
    requisitesGroupName?: string;
    showMutationWarning: ShowMutationHandler;
    showFieldUsedInFormulaWarning: ShowMutationHandler;
    showFieldFormulaCircularDependencyWarning: ShowMutationHandler;
    navigate: NavigateFunction;
    t: TFunction;
  }) {
    this.boardId = boardId;
    this.entityTypeId = entityTypeId;

    this.fieldsStore = new FieldsStore({ t });
    this.filesStore = new CardFilesStore();
    this.fieldGroupsStore = new FieldGroupsStore({
      analyticsGroupName,
      requisitesGroupName,
    });
    this.fieldValuesStore = new FieldValuesStore();
    this.linkedEntityStore = new LinkedEntityStore({
      showMutationWarning,
      setMutationWarningCode: this.setMutationWarningCode,
      handleFieldRequiredError: this.handleFieldRequiredError,
      getLinkedEntityTypeFieldSettingsStore: this.getLinkedEntityTypeFieldSettingsStore,
    });
    this.fieldsSettingsStore = new FieldSettingsStore(this.entityTypeId);

    this.entityName = InputModel.create().required();
    this.responsibleUserId = SelectModel.create().required();

    this.showMutationWarning = showMutationWarning;
    this.showFieldUsedInFormulaWarning = showFieldUsedInFormulaWarning;
    this.showFieldFormulaCircularDependencyWarning = showFieldFormulaCircularDependencyWarning;

    this.backLinkUrl = backLinkUrl;

    this.navigate = navigate;

    makeAutoObservable(this);
  }

  toggleFieldsEditMode = (): void => {
    this.isFieldsEditMode = !this.isFieldsEditMode;
  };

  hideFieldsEditMode = (): void => {
    this.isFieldsEditMode = false;
  };

  initializeCard = async (): Promise<void> => {
    if (!this.entityType)
      throw new Error(
        `Failed to loadData, entity or entityType is not initialized, entity: ${JSON.stringify(
          this.entity
        )}, entityType: ${JSON.stringify(this.entityType)}`
      );

    // init card form data
    const id = String(Math.trunc(UtcDate.now().timestamp)).slice(2);

    const defaultEntityName = `${this.entityType.name} #${id}`;

    this.entityName = InputModel.create(this.entity?.name ?? defaultEntityName).required();

    const currentUser = authStore.user;
    this.responsibleUserId = SelectModel.create(
      this.entity?.responsibleUserId ?? currentUser?.id
    ).required();

    // load boards if view = board
    if (this.entityType.section.view === SectionView.BOARD && this.entity?.boardId) {
      this.stages = await stageApiUtil.getStagesByBoardId(this.entity.boardId);
    } else if (this.entityType.section.view === SectionView.BOARD && this.boardId) {
      this.stages = await stageApiUtil.getStagesByBoardId(this.boardId);
    }

    this.entityStageId = this.entity
      ? this.entity.stageId
      : this.stages.length
        ? this.stages[0]!.id
        : null;

    // init sub-stores
    this.entityTypeLinksStore = new EntityTypeLinksStore(this.entityType);

    this.entityTypeLinksFieldsSettingsStores =
      this.entityTypeLinksStore.entityTypeLinks.map<EntityTypeLinksFieldSettingsStoreRecord>(l => ({
        entityTypeId: l.targetId,
        store: new FieldSettingsStore(l.targetId),
      }));

    this.fieldGroupsStore.setFieldGroups(
      this.entityType.fieldGroups.map<FieldGroup>(fg => fg.addInitialState())
    );
    this.fieldGroupsStore.setFieldsStore(this.fieldsStore);
    this.fieldValuesStore.setFieldValues(this.entity?.fieldValues.slice() ?? []);
    this.fieldsStore.setFields(this.entityType.fields.map<Field>(f => f.addInitialState()));

    await Promise.all([
      await this.loadLinkedEntities(),
      await this.fieldsSettingsStore.loadData(),
      this.entityTypeLinksFieldsSettingsStores.map<Promise<void>>(
        async (s): Promise<void> => await s.store.loadData()
      ),
    ]);

    this.entityJsonState = new JsonStateHelper((): string => {
      return JSON.stringify([
        this.entityStageId,
        this.entityName.value,
        this.entity?.entityLinks,
        this.responsibleUserId.value,
        this.fieldValuesStore.fieldValues.filter(fv => fv.state !== ObjectState.CREATED_EMPTY),
      ]);
    });

    const entityTypeLinksStore = this.entityTypeLinksStore;

    if (!entityTypeLinksStore)
      throw new Error('Failed to loadData, entityTypeLinksStore is not initialized');

    this.entityTypeJsonState = new JsonStateHelper((): string =>
      JSON.stringify([
        this.fieldsStore.allFields,
        this.fieldGroupsStore.allFieldGroups,
        entityTypeLinksStore.isJsonStateChanged(),
      ])
    );

    if (this.entity) this.filesStore.loadFiles(this.entity);

    if (!this.entityTypeJsonState) throw new Error(`Failed to initialize entityTypeJsonState`);

    if (!this.entityJsonState) throw new Error(`Failed to initialize entityJsonState`);

    this.mutationWarningCode = null;
    this.fieldUsedInFormulaId = null;
    this.fieldFormulaCircularDependencyId = null;

    this.entityJsonState.calculateState();
    this.entityTypeJsonState.calculateState();
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.isRevalidating) return false;

    if (
      this.entityJsonState &&
      this.entityTypeJsonState &&
      this.linkedEntityStore.jsonState &&
      this.entityTypeLinksStore
    )
      return (
        this.entityJsonState.stateChanged ||
        this.entityTypeJsonState.stateChanged ||
        this.linkedEntityStore.isJsonStateChanged() ||
        this.entityTypeLinksStore.isJsonStateChanged()
      );

    return false;
  };

  setMutationWarningCode: SetMutationWarningCodeHandler = code => {
    this.mutationWarningCode = code;
  };

  setFieldUsedInFormulaId = (fieldId: Nullable<number>): void => {
    this.fieldUsedInFormulaId = fieldId;
  };

  setFieldFormulaCircularDependencyId = (fieldId: Nullable<number>): void => {
    this.fieldFormulaCircularDependencyId = fieldId;
  };

  getLinkedEntityTypeFieldSettingsStore: GetLinkedEntityTypeFieldSettingsStore = entityTypeId => {
    const store = this.entityTypeLinksFieldsSettingsStores.find(
      s => s.entityTypeId === entityTypeId
    )?.store;

    if (!store)
      throw new Error(`Failed to find field settings store for entity type ${entityTypeId}`);

    return store;
  };

  handleFieldRequiredError: FieldRequiredErrorHandler = ({
    stageId,
    fieldsSettingsStore,
    fieldValuesStore,
  }) => {
    const mandatoryFieldsIds = fieldsSettingsStore.getAllMandatoryFieldsIds(stageId);

    fieldValuesStore.fieldValues
      .filter(fv => mandatoryFieldsIds.includes(fv.fieldId))
      .forEach(fv => {
        if (fv.model instanceof Array) {
          fv.model.forEach(m => {
            if (m instanceof InputModel) {
              m.required();

              m.validate();
            }
          });
        } else {
          fv.model.required();

          fv.model.validate();
        }
      });
  };

  setEntityStageId = (stageId: number): void => {
    this.entityStageId = stageId;
  };

  changeEntityBoard = async (boardId: number): Promise<void> => {
    if (!this.entity) throw new Error(`Failed to changeEntityBoard, entity is not initialized`);

    this.stages = await stageApiUtil.getStagesByBoardId(boardId);

    if (!this.stages[0])
      throw new Error('Failed to changeEntityBoard, destination board probably has no stages');

    this.setEntityStageId(this.stages[0].id);
  };

  setActiveFilter = (value: FeedItemFilter): void => {
    this.activeFilter = value;
  };

  changeActiveFieldCodes = (activeFieldCodes: FieldCode[]) => {
    if (!this.entityType) return;

    this.entityType.fields = (this.entityType?.fields ?? []).map(f => {
      if (!f.code) return f;

      f.active = activeFieldCodes.includes(f.code);

      return f;
    });
  };

  updateFieldsSettings = async ({
    entityTypeId,
    fieldsSettings,
  }: {
    entityTypeId: number;
    fieldsSettings: ProjectFieldsSettings;
  }): Promise<void> => {
    this.changeActiveFieldCodes(fieldsSettings.activeFieldCodes);

    await entityTypeApi.updateFieldsSettings({ entityTypeId, fieldsSettings });
  };

  toggleEntityFocus = async (): Promise<void> => {
    if (!this.entity) return;

    const dto = UpdateEntityDto.fromModel(this.entity);
    dto.focused = !dto.focused;

    this.entity = { ...this.entity, focused: dto.focused };

    this.entity = await EntityApiUtil.update({ id: this.entity.id, dto });
  };

  loadEntity = async (entityId: number): Promise<void> => {
    try {
      this.isLoaded = false;

      const [entity, entityType] = await Promise.all([
        entityApi.getEntityById(entityId),
        entityTypeStore.getByIdAsync(this.entityTypeId),
      ]);

      this.entity = entity;
      this.entityType = entityType;

      await this.initializeCard();
    } catch (e) {
      this.handleLoadingError(e as AxiosError);
    } finally {
      this.isLoaded = true;
    }
  };

  loadDataWithoutEntity = async (): Promise<void> => {
    try {
      this.isLoaded = false;

      this.entityType = await entityTypeStore.getByIdAsync(this.entityTypeId);

      await this.initializeCard();
    } catch (e) {
      this.handleLoadingError(e as AxiosError);
    } finally {
      this.isLoaded = true;
    }
  };

  invalidateEntityInCache = async (entityId: number): Promise<void> => {
    try {
      this.isRevalidating = true;

      const [entity, entityType] = await Promise.all([
        entityApi.getEntityById(entityId),
        entityTypeStore.getByIdAsync(this.entityTypeId),
      ]);

      this.entity = entity;
      this.entityType = entityType;

      await this.initializeCard();
    } catch (e) {
      this.handleLoadingError(e as AxiosError);
    } finally {
      this.isRevalidating = false;
    }
  };

  save = async (): Promise<boolean> => {
    if (this.isCancelingCard || this.isSavingCard)
      throw new Error(
        `Failed to save card changes, saving or canceling card is already in progress`
      );

    if (
      !validateForm({
        0: this.fieldsStore,
        1: this.fieldGroupsStore,
        2: this.linkedEntityStore,
        3: this.entityName,
      })
    )
      return false;

    try {
      this.isSavingCard = true;

      if (!this.entityType)
        throw new Error(this.generateSaveError('entityType is not initialized'));

      let success = false;

      if (!this.entity) {
        await this.createEntityAndNavigate();

        success = true;
      } else {
        success = await this.updateEntity();
      }

      return success;
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.FIELD_USED_IN_FORMULA) {
        this.showFieldUsedInFormulaWarning();

        const fieldId = serviceError?.details?.fieldId;

        if (fieldId && typeof fieldId === 'number') this.fieldUsedInFormulaId = fieldId;

        return false;
      }

      if (serviceError?.errorCode === ErrorCode.FIELD_FORMULA_CIRCULAR_DEPENDENCY) {
        this.showFieldFormulaCircularDependencyWarning();

        const fieldId = serviceError?.details?.fieldId;

        if (fieldId && typeof fieldId === 'number') this.fieldFormulaCircularDependencyId = fieldId;

        return false;
      }

      if (serviceError?.errorCode === ErrorCode.REQUIRED_FIELD_EMPTY && this.entity?.stageId) {
        this.setMutationWarningCode(MutationWarningCode.SAVE_CHANGES);
        this.showMutationWarning();

        // validate card fields
        this.handleFieldRequiredError({
          stageId: this.entity.stageId,
          fieldValuesStore: this.fieldValuesStore,
          fieldsSettingsStore: this.fieldsSettingsStore,
        });

        return false;
      }

      if (serviceError?.errorCode === ErrorCode.FIELD_DUPLICATE_NAME) {
        this.fieldsStore.setErrorCode(FieldsStoreErrorCode.DUPLICATE_NAME, {
          fieldName: serviceError.details?.fieldName,
        });

        return false;
      }

      return false;
    } finally {
      document.dispatchEvent(new CardSavedEvent());

      this.isSavingCard = false;
    }
  };

  cancel = async (): Promise<void> => {
    if (this.isCancelingCard || this.isSavingCard)
      throw new Error(
        `Failed to cancel card changes, saving or canceling card is already in progress`
      );

    if (!this.entityType)
      throw new Error(`Failed to cancel card changes, entityType is not initialized`);

    if (!this.entity)
      return this.navigate(
        this.backLinkUrl ?? routes.section({ entityType: this.entityType, firstBoardId: null })
      );

    try {
      this.isCancelingCard = true;

      this.hideFieldsEditMode();

      this.fieldsStore.clearError();
      this.fieldGroupsStore.clearError();

      this.fieldValuesStore.clearEmptyModelsInMultitextFields();

      await this.invalidateEntityInCache(this.entity.id);

      if (this.entity.stageId) {
        const mandatoryFieldsIds = this.fieldsSettingsStore.getAllMandatoryFieldsIds(
          this.entity.stageId
        );

        this.fieldValuesStore.fieldValues
          .filter(fv => mandatoryFieldsIds.includes(fv.fieldId))
          .forEach(fv => {
            if (fv.model instanceof Array) {
              fv.model.forEach(m => (m instanceof InputModel ? m.clearError() : null));
            } else {
              fv.model.clearError();
            }
          });
      }

      this.setMutationWarningCode(null);
      this.setFieldUsedInFormulaId(null);
    } catch (e) {
      console.error(`Failed to cancel card ${this.entity.id} changes: ${e}`);
    } finally {
      document.dispatchEvent(new CardSavedEvent());

      this.isCancelingCard = false;
    }
  };

  private loadLinkedEntities = async (): Promise<void> => {
    if (!this.entity) return;

    await this.linkedEntityStore.loadLinkedEntities(this.entity.entityLinks);
  };

  private handleLoadingError = (e: AxiosError): void => {
    const errorStatus = e.response?.status;

    if (errorStatus === HttpStatusCode.Forbidden) {
      this.navigate(routes.forbiddenPage, { replace: true });

      return;
    }

    if (errorStatus === HttpStatusCode.NotFound) {
      this.navigate(routes.notFoundPage, { replace: true });

      return;
    }

    throw new Error(`Failed to load entity: ${e}`);
  };

  private generateSaveError = (reason: string): string => {
    return `Failed to save card changes, ${reason}, entity: ${JSON.stringify(
      this.entity
    )}, entityType: ${JSON.stringify(this.entityType)}`;
  };

  private createEntityAndNavigate = async (): Promise<void> => {
    if (!this.entityType) throw new Error(this.generateSaveError(`entity type is not initialized`));

    const dto = new CreateSimpleEntityDto({
      name: this.entityName.trimmedValue,
      entityTypeId: this.entityType.id,
      boardId: this.boardId,
      fieldValues: FieldUtil.toDtos(this.fieldValuesStore.fieldValuesForSave),
      linkedEntities: this.linkedEntityStore.linkedEntitiesToCreate,
    });

    const entities = await EntityApiUtil.createSimple(dto);

    if (!entities[0]) throw new Error(this.generateSaveError('new entity was not created'));

    this.smoothNavigate(
      routes.card({ entityTypeId: this.entityType.id, entityId: entities[0].id })
    );
  };

  private updateEntity = async (): Promise<boolean> => {
    if (!this.entityType || !this.entity)
      throw new Error(
        this.generateSaveError(
          `updateEntity precondition failed, entityType or entity is not initialized`
        )
      );

    const entity = this.entity;

    if (this.entityTypeJsonState && this.entityTypeJsonState.stateChanged) {
      const updateEntityTypeFieldsModel = new UpdateEntityTypeFieldsModel({
        entityTypeId: this.entityType.id,
        fieldGroups: this.fieldGroupsStore.allFieldGroups,
        fields: this.fieldsStore.allFields,
      });

      this.entityType = await entityTypeStore.updateEntityTypeFields(updateEntityTypeFieldsModel);

      if (this.entityTypeLinksStore && this.entityTypeLinksStore.isJsonStateChanged()) {
        this.entityType = await entityTypeStore.updateEntityType(
          new UpdateEntityTypeDto({
            id: this.entityType.id,
            name: this.entityType.name,
            section: this.entityType.section,
            featureCodes: this.entityType.featureCodes,
            fields: Field.toDtos(this.entityType.fields),
            entityCategory: this.entityType.entityCategory,
            fieldGroups: FieldGroup.toDtos(this.entityType.fieldGroups),
            linkedEntityTypes: this.entityTypeLinksStore.sortedEntityTypeLinks,
          })
        );
      }
    }

    if (!this.entity) throw new Error(this.generateSaveError('entity does not exists'));

    if (!this.entityJsonState)
      throw new Error(this.generateSaveError('entityJsonState is not initialized'));

    if (!this.linkedEntityStore.jsonState)
      throw new Error(this.generateSaveError('linkedEntityStore jsonState is not initialized'));

    if (
      this.entity.isNew ||
      this.entityJsonState.stateChanged ||
      this.linkedEntityStore.jsonState.stateChanged ||
      (this.entityTypeJsonState && this.entityTypeJsonState.stateChanged)
    ) {
      entity.name = this.entityName.trimmedValue;
      entity.stageId = this.entityStageId;
      entity.responsibleUserId = this.responsibleUserId.value;
      entity.fieldValues = this.fieldValuesStore.fieldValuesForSave;

      const saveLinkedEntitiesSuccess = await this.linkedEntityStore.saveEntityLinks(entity);

      if (!saveLinkedEntitiesSuccess) return false;

      this.entity = await EntityApiUtil.save(entity);
    }

    this.fieldValuesStore.clearEmptyModelsInMultitextFields();

    this.hideFieldsEditMode();

    await this.initializeCard();

    return true;
  };

  private smoothNavigate = (to: To): void => {
    if (document.startViewTransition) {
      document.startViewTransition(() => this.navigate(to));
    } else {
      this.navigate(to);
    }
  };
}

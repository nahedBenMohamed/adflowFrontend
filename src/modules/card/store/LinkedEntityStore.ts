import { FieldUtil } from '@/modules/fields';
import { CreateSimpleEntityDto, EntityForm, entityApi } from '@/modules/section';
import {
  EntityApiUtil,
  EntityLink,
  ErrorCode,
  JsonStateHelper,
  MathUtil,
  ObjectState,
  type Entity,
  type Nullable,
  type Optional,
  type ServiceError,
} from '@/shared';
import type { AxiosError } from 'axios';
import { computed, makeAutoObservable } from 'mobx';
import { MutationWarningCode } from '../shared';
import type {
  FieldRequiredErrorHandler,
  GetLinkedEntityTypeFieldSettingsStore,
  SetMutationWarningCodeHandler,
  ShowMutationHandler,
} from './CardStore';

export class LinkedEntityStore {
  entityForms: EntityForm[] = [];
  entityLinks: EntityLink[] = [];

  isLoaded = false;

  jsonState: Nullable<JsonStateHelper> = null;

  showMutationWarning: ShowMutationHandler;
  handleFieldRequiredError: FieldRequiredErrorHandler;
  setMutationWarningCode: SetMutationWarningCodeHandler;
  getLinkedEntityTypeFieldSettingsStore: GetLinkedEntityTypeFieldSettingsStore;

  constructor({
    showMutationWarning,
    handleFieldRequiredError,
    setMutationWarningCode,
    getLinkedEntityTypeFieldSettingsStore,
  }: {
    showMutationWarning: ShowMutationHandler;
    handleFieldRequiredError: FieldRequiredErrorHandler;
    setMutationWarningCode: SetMutationWarningCodeHandler;
    getLinkedEntityTypeFieldSettingsStore: GetLinkedEntityTypeFieldSettingsStore;
  }) {
    this.showMutationWarning = showMutationWarning;
    this.handleFieldRequiredError = handleFieldRequiredError;
    this.setMutationWarningCode = setMutationWarningCode;
    this.getLinkedEntityTypeFieldSettingsStore = getLinkedEntityTypeFieldSettingsStore;

    makeAutoObservable(this);
  }

  get maxEntityLinkSortOrder(): number {
    return MathUtil.maxOrZero(this.entityLinks.map<number>(el => el.sortOrder));
  }

  get linkedEntitiesToCreate(): CreateSimpleEntityDto[] {
    return this.entityForms.map(ef => {
      const entityForUpdate = ef.originalEntity;

      entityForUpdate.name = ef.name.value;
      entityForUpdate.responsibleUserId = ef.responsibleUserId.value;
      entityForUpdate.fieldValues = ef.fieldValuesStore.fieldValuesForSave;
      entityForUpdate.stageId = ef.stageId.value ?? null;

      return new CreateSimpleEntityDto({
        name: entityForUpdate.name,
        entityTypeId: entityForUpdate.entityTypeId,
        boardId: entityForUpdate.boardId ?? undefined,
        stageId: entityForUpdate.stageId ?? undefined,
        ownerId: entityForUpdate.responsibleUserId,
        fieldValues: FieldUtil.toDtos(entityForUpdate.fieldValues),
      });
    });
  }

  loadLinkedEntities = async (entityLinks: EntityLink[]): Promise<void> => {
    this.entityLinks = entityLinks;

    try {
      this.isLoaded = false;

      const linkedEntities = await Promise.all(
        entityLinks.map<Promise<Entity>>(el => entityApi.getEntityById(el.targetId))
      );

      await this.initializeEntitiesForms(linkedEntities);
    } catch (e) {
      throw new Error(`Failed to load linked entities`);
    } finally {
      this.isLoaded = true;
    }

    this.initJsonState();
  };

  initializeEntitiesForms = async (entities: Entity[]): Promise<void> => {
    const entityForms: EntityForm[] = [];

    for (const e of entities) {
      entityForms.push(
        await EntityForm.create({
          entity: e,
          sortOrder: this.findSortOrderOrIncrementedMax(e.id),
        })
      );
    }

    this.entityForms = entityForms;
  };

  initJsonState = (): void => {
    this.jsonState = new JsonStateHelper((): string =>
      JSON.stringify(this.entityForms.map(ef => ef.jsonState?.stateChanged))
    );

    this.jsonState.calculateState();
  };

  saveEntityLinks = async (entity?: Entity): Promise<Nullable<Entity[]>> => {
    const linkedEntities: Entity[] = [];

    for (const ef of this.entityForms) {
      // STEP 1: Clear all empty forms (we consider form empty when it is newly created and has no name)
      if (ef.originalEntity.isNew && !ef.name.value.length) {
        this.unpinLinkedEntityForm(ef.originalEntity.id);

        continue;
      }

      // STEP 2: If form state is changed we save the entity
      if (ef.jsonState && ef.jsonState.stateChanged) {
        const entityForUpdate = ef.originalEntity;

        entityForUpdate.name = ef.name.value;
        entityForUpdate.responsibleUserId = ef.responsibleUserId.value;
        entityForUpdate.fieldValues = ef.fieldValuesStore.fieldValuesForSave;
        entityForUpdate.stageId = ef.stageId.value ?? null;

        try {
          const linkedEntityIds = entity ? [entity.id] : undefined;

          linkedEntities.push(await EntityApiUtil.save(entityForUpdate, linkedEntityIds));
        } catch (e) {
          const axiosError = e as AxiosError;
          const serviceError = axiosError.response?.data as Optional<ServiceError>;

          if (
            serviceError?.errorCode === ErrorCode.REQUIRED_FIELD_EMPTY &&
            entityForUpdate.stageId
          ) {
            this.setMutationWarningCode(MutationWarningCode.SAVE_CHANGES);
            this.showMutationWarning();

            // show all fields in case some required fields are currently not visible
            ef.setAreAllFieldsShown(true);

            // so that all fields are rendered and could be displayed as invalid
            setTimeout(() => {
              this.handleFieldRequiredError({
                stageId: ef.stageId.value,
                fieldValuesStore: ef.fieldValuesStore,
                fieldsSettingsStore: this.getLinkedEntityTypeFieldSettingsStore(
                  entityForUpdate.entityTypeId
                ),
              });
            });

            return null;
          }
        }
      }

      // STEP 3: Create new links for new forms. If we fail to find existing link for the form in the entity
      // we create a new link with data from the form with state CREATED
      if (entity) {
        const existingLink = entity.findLinkByTargetId(ef.id);

        if (!existingLink) {
          entity.addEntityLink(
            new EntityLink({
              targetId: ef.id,
              sourceId: entity.id,
              state: ObjectState.CREATED,
              sortOrder: this.maxEntityLinkSortOrder + 1,
            })
          );
        }
      }
    }

    if (entity) {
      entity.entityLinks.forEach(l => {
        const form = this.findLinkedEntityFormByOriginalId(l.targetId);

        // STEP 4: Mark all unpinned links as DELETED. If we fail to find a form for the link in the entity
        // we consider it unpinned and mark it as DELETED
        if (!form) {
          l.markDeleted();

          return;
        }

        // STEP 5: Mark all links with changed sort order as changed (if they're not already marked as DELETED or CREATED)
        if (![ObjectState.DELETED, ObjectState.CREATED].includes(l.state)) {
          l.markChanged();
          l.changeSortOrder(form.sortOrder);
        }
      });
    }

    return linkedEntities;
  };

  changeEntityFormSortOrder = ({
    originalId,
    newSortOrder,
  }: {
    originalId: number;
    newSortOrder: number;
  }): void => {
    const form = this.getEntityFormByOriginalId(originalId);

    form.changeSortOrder(newSortOrder);
  };

  addLinkedEntityForm = async (entity: Entity): Promise<void> => {
    if (entity)
      this.entityForms = [
        ...this.entityForms,
        await EntityForm.create({
          entity,
          sortOrder: this.findSortOrderOrIncrementedMax(entity.id),
        }),
      ];
  };

  unpinLinkedEntityForm = (originalId: number): void => {
    this.entityForms = this.entityForms.filter(ef => ef.id !== originalId);
  };

  replaceLinkedEntity = async ({
    replaceEntityId,
    newEntity,
  }: {
    replaceEntityId: number;
    newEntity: Entity;
  }): Promise<void> => {
    const entityForm = this.getEntityFormByOriginalId(replaceEntityId);

    const entityFormIdx = this.entityForms.indexOf(entityForm);

    if (entityFormIdx === -1) throw new Error(`Failed to get indexOf entityForm ${entityForm.id}`);

    const newEntityForm = await EntityForm.create({
      entity: newEntity,
      sortOrder: this.findSortOrderOrIncrementedMax(entityForm.id),
    });

    this.entityForms.splice(entityFormIdx, 1, newEntityForm);
  };

  getEntityFormByOriginalId = (originalId: number): EntityForm => {
    const form = this.entityForms.find(f => f.id === originalId);

    if (!form) throw new Error(`Failed to get entity form with id ${originalId}`);

    return form;
  };

  findLinkedEntityFormByOriginalId = (originalId: number): Optional<EntityForm> => {
    return this.entityForms.find(ef => ef.id === originalId);
  };

  findEntityLinkByTargetId = (targetId: number): Optional<EntityLink> => {
    return this.entityLinks.find(el => el.targetId === targetId);
  };

  getEntityFormsByEntityTypeId = (entityTypeId: number): EntityForm[] => {
    return this.entityForms
      .filter(ef => ef.entityTypeId === entityTypeId)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  findSortOrderOrIncrementedMax = (targetId: number): number => {
    return this.findEntityLinkByTargetId(targetId)?.sortOrder ?? this.maxEntityLinkSortOrder + 1;
  };

  getFirstSavedEntityByEntityTypeId = (entityTypeId: number): Nullable<Entity> => {
    for (const ef of this.entityForms) {
      const entity = ef.originalEntity;

      if (entity.entityTypeId === entityTypeId && entity.isNew === false) return entity;
    }

    return null;
  };

  validate = (): boolean => {
    let isValid = true;

    if (!this.isJsonStateChanged()) return true;

    for (const ef of this.entityForms) {
      if (ef.originalEntity.isNew) continue;

      if (!ef.name.validate()) isValid = false;
    }

    return isValid;
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState) return this.jsonState.stateChanged;

    return false;
  };
}

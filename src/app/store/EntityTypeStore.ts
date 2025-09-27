import { authStore } from '@/modules/auth';
import {
  EntityCategory,
  PermissionLevel,
  PermissionObjectType,
  type DataStore,
  type EntityType,
  type Nullable,
  type Option,
} from '@/shared';
import { computed, makeAutoObservable, toJS } from 'mobx';
import { entityTypeApi, type UpdateEntityTypeDto, type UpdateEntityTypeFieldsModel } from '../api';

export class EntityTypeStore implements DataStore {
  entityTypes: EntityType[] = [];

  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  get entityTypesOptions(): Option<number>[] {
    return this.sortedEntityTypes.map<Option<number>>(et => ({
      value: et.id,
      label: et.section.name,
    }));
  }

  get contacts(): EntityType[] {
    return this.getByCategory(EntityCategory.CONTACT);
  }

  get contactsOptions(): Option<number>[] {
    return this.contacts.map<Option<number>>(et => ({ value: et.id, label: et.name }));
  }

  get companies(): EntityType[] {
    return this.getByCategory(EntityCategory.COMPANY);
  }

  get companiesOptions(): Option<number>[] {
    return this.companies.map<Option<number>>(et => ({ value: et.id, label: et.name }));
  }

  get contactsAndCompaniesOptions(): Option<number>[] {
    return [...this.contactsOptions, ...this.companiesOptions];
  }

  get firstDealEntityTypeId(): Nullable<number> {
    return this.sortedEntityTypes.find(et => et.entityCategory === EntityCategory.DEAL)?.id ?? null;
  }

  get entityTypesExceptContactAndCompanies(): EntityType[] {
    return this.sortedEntityTypes.filter(
      et => ![EntityCategory.CONTACT, EntityCategory.COMPANY].includes(et.entityCategory)
    );
  }

  get entityTypesExceptContactAndCompaniesOptions(): Option<number>[] {
    return this.entityTypesExceptContactAndCompanies.map<Option<number>>(et => ({
      value: et.id,
      label: et.name,
    }));
  }

  get firstEntityTypeId(): number {
    const firstEntityTypeId = this.sortedEntityTypes[0]?.id;

    if (!firstEntityTypeId)
      throw new Error('First entity type was not found, no entity types exist');

    return firstEntityTypeId;
  }

  @computed.struct
  get sortedEntityTypes(): EntityType[] {
    return toJS(this.entityTypes).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  deleteEntityType = async (entityTypeId: number): Promise<void> => {
    await entityTypeApi.deleteEntityType(entityTypeId);

    this.entityTypes = this.entityTypes.filter(et => et.id !== entityTypeId);
  };

  updateEntityType = async (entityType: UpdateEntityTypeDto): Promise<EntityType> => {
    const updatedEntityType = await entityTypeApi.updateEntityType(entityType);

    this.entityTypes = this.entityTypes.map(et =>
      et.id === entityType.id ? updatedEntityType : et
    );

    return updatedEntityType;
  };

  updateEntityTypeFields = async (model: UpdateEntityTypeFieldsModel): Promise<EntityType> => {
    const updated = await entityTypeApi.updateEntityTypeFields(model);
    const idx = this.entityTypes.findIndex(et => et.id === model.entityTypeId);

    this.entityTypes.splice(idx, 1, updated);

    return updated;
  };

  getById = (id: number): EntityType => {
    const entityType = this.entityTypes.find(et => et.id === id);

    if (!entityType) throw new Error(`Entity type with id ${id} was not found`);

    return entityType;
  };

  getByIdAsync = async (id: number): Promise<EntityType> => {
    try {
      const entityType = await entityTypeApi.getEntityType(id);

      // invalidate cache
      this.entityTypes = this.entityTypes.map(et => (et.id === id ? entityType : et));

      return entityType;
    } catch (e) {
      throw new Error(`Failed to get entity type ${id}: ${e}`);
    }
  };

  loadData = async (): Promise<void> => {
    try {
      this.entityTypes = await entityTypeApi.getEntityTypes();
    } catch (e) {
      throw new Error(`Failed to load entity types: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  invalidateEntityTypesInCache = async (): Promise<void> => {
    try {
      this.entityTypes = await entityTypeApi.getEntityTypes();
    } catch (e) {
      throw new Error(`Failed to invalidate entity types cache: ${e}`);
    }
  };

  getByCategory = (entityCategory: EntityCategory): EntityType[] => {
    return this.sortedEntityTypes.filter(et => et.entityCategory === entityCategory);
  };

  getAvailableEntityTypes = (): EntityType[] => {
    const { user: currentUser } = authStore;

    if (!currentUser) throw new Error('User is not logged in');

    const entityTypes = this.sortedEntityTypes;
    const objectPermissions = currentUser.objectPermissions;

    return authStore.user?.isAdmin()
      ? entityTypes
      : entityTypes.filter(et => {
          const permission = objectPermissions.find(
            op => op.objectType === PermissionObjectType.ENTITY_TYPE && op.objectId === et.id
          );

          return permission ? permission.viewPermission !== PermissionLevel.DENIED : true;
        });
  };

  getLinkedDealsOptions = (etId: number): Option<number>[] => {
    return this.getById(etId).linkedEntityTypes.flatMap<Option<number>>(l => {
      const linkedEt = entityTypeStore.getById(l.targetId);

      return linkedEt.entityCategory === EntityCategory.DEAL
        ? [{ label: linkedEt.name, value: linkedEt.id }]
        : [];
    });
  };

  reset = (): void => {
    this.entityTypes = [];

    this.isLoaded = false;
  };
}

export const entityTypeStore = new EntityTypeStore();

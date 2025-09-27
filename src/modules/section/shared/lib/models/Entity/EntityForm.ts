import { entityTypeStore } from '@/app';
import { FieldValuesStore, type FieldCode } from '@/modules/fields';
import {
  InputModel,
  JsonStateHelper,
  ObjectState,
  SelectModel,
  type Entity,
  type Nullable,
} from '@/shared';
import { makeAutoObservable } from 'mobx';

export class EntityForm {
  originalEntity: Entity;

  name: InputModel;
  stageId: SelectModel;
  sortOrder: number;
  responsibleUserId: SelectModel;

  fieldValuesStore: FieldValuesStore;
  activeFieldCodes?: FieldCode[];

  jsonState: Nullable<JsonStateHelper> = null;

  areAllFieldsShown = false;

  private constructor({
    entity,
    sortOrder,
    // to not whether or not show project fields for project category entities
    // project field visibility can be fine-tuned in builder or in a project card
    activeFieldCodes,
  }: {
    entity: Entity;
    sortOrder: number;
    activeFieldCodes?: FieldCode[];
  }) {
    this.originalEntity = entity;

    const { name, stageId, responsibleUserId, fieldValues } = entity;

    this.name = InputModel.create(name).required();
    this.stageId = SelectModel.create(stageId);
    this.sortOrder = sortOrder;
    this.responsibleUserId = SelectModel.create(responsibleUserId);

    this.fieldValuesStore = new FieldValuesStore(fieldValues.slice());
    this.activeFieldCodes = activeFieldCodes;

    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([
        this.sortOrder,
        this.name.value,
        this.stageId.value,
        this.responsibleUserId.value,
        this.fieldValuesStore.fieldValues.filter(fv => fv.state !== ObjectState.CREATED_EMPTY),
      ])
    );

    this.jsonState.calculateState();

    makeAutoObservable(this);
  }

  static async create({
    entity,
    sortOrder,
  }: {
    entity: Entity;
    sortOrder: number;
  }): Promise<EntityForm> {
    const activeFieldCodes = entityTypeStore
      .getById(entity.entityTypeId)
      .fields.filter(f => f.code && f.active)
      .map(f => f.code)
      .filter(Boolean);

    return new EntityForm({
      entity,
      sortOrder,
      activeFieldCodes,
    });
  }

  get id(): number {
    return this.originalEntity.id;
  }

  get entityTypeId(): number {
    return this.originalEntity.entityTypeId;
  }

  toggleAreAllFieldsShown = (): void => {
    this.areAllFieldsShown = !this.areAllFieldsShown;
  };

  setAreAllFieldsShown = (areAllFieldsShown: boolean): void => {
    this.areAllFieldsShown = areAllFieldsShown;
  };

  changeSortOrder = (newSortOrder: number): void => {
    this.sortOrder = newSortOrder;
  };
}

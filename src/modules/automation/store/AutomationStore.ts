import { watchdogStore } from '@/app';
import type { DataStore, EntityTypeActionType, Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  automationEntityTypeApi,
  CreateAutomationEntityTypeDto,
  UpdateAutomationEntityType,
} from '../api';
import type {
  AutomationEntityType,
  AutomationEntityTypeTemplateFormData,
  EntityTypeAction,
} from '../shared';

export class AutomationStore implements DataStore {
  boardId: Nullable<number>;
  entityTypeId: number;

  automations: AutomationEntityType[] = [];

  areLoaded = false;

  constructor({ boardId, entityTypeId }: { boardId: Nullable<number>; entityTypeId: number }) {
    this.boardId = boardId;
    this.entityTypeId = entityTypeId;

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.areLoaded = false;

      this.automations = await automationEntityTypeApi.getEntityTypeAutomations({
        boardId: this.boardId,
        entityTypeId: this.entityTypeId,
      });
    } catch (e) {
      throw new Error(
        `Failed to load automations for board ${this.boardId} of entity type ${this.entityTypeId}: ${e}`
      );
    } finally {
      this.areLoaded = true;
    }
  };

  invalidateDataInCache = async (): Promise<void> => {
    try {
      this.automations = await automationEntityTypeApi.getEntityTypeAutomations({
        boardId: this.boardId,
        entityTypeId: this.entityTypeId,
      });
    } catch (e) {
      throw new Error(
        `Failed to invalidate automations in cache for board ${this.boardId} of entity type ${this.entityTypeId}: ${e}`
      );
    }
  };

  getByTypeAndStageId = ({
    stageId,
    type,
  }: {
    stageId: Nullable<number>;
    type: EntityTypeActionType;
  }): AutomationEntityType[] => {
    // im simple case there will only be one action, we can know automation type by it
    return this.automations.filter(a => a.actions?.[0]?.type === type && a.stageId === stageId);
  };

  saveAutomation = async ({
    action,
    stageId,
    templateModel,
    automationId,
  }: {
    stageId: Nullable<number>;
    action: EntityTypeAction;
    templateModel: AutomationEntityTypeTemplateFormData;
    automationId?: number;
  }): Promise<void> => {
    try {
      const actionWithCommonOptions = {
        ...action,
        settings: {
          ...action.settings,
          allowAnyStage: templateModel.delay ? templateModel.allowAnyStage.asBoolean() : false,
        },
      };

      if (automationId) {
        const updateDto = new UpdateAutomationEntityType({
          stageId,
          actions: [actionWithCommonOptions],
          boardId: this.boardId,
          entityTypeId: this.entityTypeId,
          isActive: templateModel.isActive.value,
          name: templateModel.name.trimmedValue,
          triggers: templateModel.triggers.values,
          conditions: templateModel.conditions.toModel(),
          applyImmediately: templateModel.applyImmediately.value,
        });

        const updatedAutomation = await automationEntityTypeApi.updateEntityTypeAutomation({
          automationId,
          dto: updateDto,
        });

        this.automations = this.automations.map<AutomationEntityType>(a =>
          a.id === automationId ? updatedAutomation : a
        );
      } else {
        const createDto = new CreateAutomationEntityTypeDto({
          stageId,
          actions: [actionWithCommonOptions],
          boardId: this.boardId,
          entityTypeId: this.entityTypeId,
          isActive: templateModel.isActive.value,
          name: templateModel.name.trimmedValue,
          triggers: templateModel.triggers.values,
          conditions: templateModel.conditions.toModel(),
          applyImmediately: templateModel.applyImmediately.value,
        });

        const createdAutomation =
          await automationEntityTypeApi.createEntityTypeAutomation(createDto);

        this.automations = [...this.automations, createdAutomation];
      }
    } catch (e) {
      if (automationId) {
        throw new Error(
          `Failed to edit automation ${automationId} for board ${this.boardId} of entity type ${this.entityTypeId}: ${e}`
        );
      } else {
        throw new Error(
          `Failed to create automation for board ${this.boardId} of entity type ${this.entityTypeId}: ${e}`
        );
      }
    }
  };

  delete = async (id: number): Promise<void> => {
    try {
      await automationEntityTypeApi.deleteEntityTypeAutomation(id);

      this.automations = this.automations.filter(a => a.id !== id);
    } catch (e) {
      throw new Error(
        `Failed to delete automation ${id} for board ${this.boardId} of entity type ${this.entityTypeId}: ${e}`
      );
    }
  };

  reset = async () => {
    this.automations = [];
  };
}

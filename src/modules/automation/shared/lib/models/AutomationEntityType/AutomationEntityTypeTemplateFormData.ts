import {
  BooleanModel,
  EntityTypeTrigger,
  InputModel,
  MultiselectModel,
  type Nullable,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { AutomationEntityType } from './AutomationEntityType';
import type { EntityTypeCondition } from './Condition/EntityTypeCondition';
import { EntityTypeConditionFormData } from './Condition/EntityTypeConditionModel';

export class AutomationEntityTypeTemplateFormData {
  name: InputModel;
  triggers: MultiselectModel<EntityTypeTrigger>;
  conditions: EntityTypeConditionFormData;
  delay: Nullable<number>;
  isActive: BooleanModel;
  applyImmediately: BooleanModel;
  allowAnyStage: InputModel;

  constructor({
    name,
    delay,
    triggers,
    isActive,
    conditions,
    applyImmediately,
    allowAnyStage,
  }: {
    name: string;
    delay: Nullable<number>;
    triggers: EntityTypeTrigger[];
    isActive: boolean;
    conditions: Nullable<EntityTypeCondition>;
    applyImmediately: boolean;
    allowAnyStage: boolean;
  }) {
    this.name = InputModel.create(name).required();
    this.delay = delay;
    this.triggers = MultiselectModel.create<EntityTypeTrigger>(triggers).required();
    this.isActive = BooleanModel.create(isActive);
    this.conditions = conditions
      ? EntityTypeConditionFormData.fromModel(conditions)
      : EntityTypeConditionFormData.empty();
    this.applyImmediately = BooleanModel.create(applyImmediately);
    this.allowAnyStage = InputModel.create(String(allowAnyStage));

    makeAutoObservable(this);
  }

  static fromAutomation(automation: AutomationEntityType): AutomationEntityTypeTemplateFormData {
    return new AutomationEntityTypeTemplateFormData({
      name: automation.name,
      applyImmediately: false,
      isActive: automation.isActive,
      triggers: automation.triggers,
      conditions: automation.conditions ?? null,
      delay: automation.firstAction.delay ?? null,
      allowAnyStage: automation.actions?.[0]?.settings.allowAnyStage ?? false,
    });
  }

  static getDefaultTemplate(defaultName: string): AutomationEntityTypeTemplateFormData {
    return new AutomationEntityTypeTemplateFormData({
      name: defaultName,
      delay: null,
      isActive: true,
      conditions: null,
      allowAnyStage: false,
      applyImmediately: false,
      triggers: [EntityTypeTrigger.CREATE],
    });
  }

  changeDelay = (delay: Nullable<number>): void => {
    this.delay = delay;
  };
}

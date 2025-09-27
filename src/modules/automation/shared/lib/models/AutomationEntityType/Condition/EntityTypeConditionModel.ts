import { MultiselectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { AutomationFieldCondition } from './AutomationFieldCondition';
import type { EntityTypeCondition } from './EntityTypeCondition';
import { EntityTypeFieldConditionFormData } from './EntityTypeFieldConditionFormData';

export class EntityTypeConditionFormData {
  ownerIds: MultiselectModel<number>;
  fieldsFormData: EntityTypeFieldConditionFormData[];

  constructor({ ownerIds, fields }: { ownerIds?: number[]; fields?: AutomationFieldCondition[] }) {
    this.ownerIds = MultiselectModel.createFromOptional(ownerIds);
    this.fieldsFormData = EntityTypeFieldConditionFormData.fromModels(fields ?? []);

    makeAutoObservable(this);
  }

  static empty(): EntityTypeConditionFormData {
    return new EntityTypeConditionFormData({ fields: [] });
  }

  static fromModel(model: EntityTypeCondition): EntityTypeConditionFormData {
    return new EntityTypeConditionFormData({
      fields: model.fields,
      ownerIds: model.ownerIds,
    });
  }

  toModel = (): EntityTypeCondition => {
    return {
      ownerIds: this.ownerIds.valuesOrUndefined,
      fields: this.fieldsFormData
        // non-existent fields will have id === null, form data should not be empty
        .filter(f => f.fieldId.value && f.filterFormData && !f.filterFormData.isEmpty())
        .map<AutomationFieldCondition>(f => f.toModel()),
    };
  };

  createEmptyFieldFormData = (): void => {
    this.fieldsFormData = [EntityTypeFieldConditionFormData.empty(), ...this.fieldsFormData];
  };

  // formDataId does not exist on the backend, only for ui purposes
  deleteFieldsFormData = (formDataId: number): void => {
    this.fieldsFormData = this.fieldsFormData.filter(f => f.formDataId !== formDataId);
  };
}

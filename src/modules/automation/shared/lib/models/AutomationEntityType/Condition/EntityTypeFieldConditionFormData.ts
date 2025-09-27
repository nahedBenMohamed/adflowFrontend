import {
  type BooleanFilter,
  BooleanFilterFormData,
  type DateFilter,
  DateFilterFormData,
  type ExistsFilter,
  ExistsFilterFormData,
  type Nullable,
  type NumberFilter,
  NumberFilterFormData,
  type PossibleFilterFormData,
  type SelectFilter,
  SelectFilterFormData,
  SelectModel,
  SimpleFilterType,
  type StringFilter,
  StringFilterFormData,
  UuidUtil,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { AutomationFieldCondition } from './AutomationFieldCondition';

export class EntityTypeFieldConditionFormData {
  // formDataId does not exist on the backend, only for ui purposes
  formDataId: number;
  fieldId: SelectModel;
  type: Nullable<SimpleFilterType>;
  filterFormData: Nullable<PossibleFilterFormData>;

  constructor({
    formDataId,
    fieldId,
    type,
    filter,
  }: {
    formDataId: number;
    fieldId: Nullable<number>;
    type: Nullable<SimpleFilterType>;
    filter: Nullable<PossibleFilterFormData>;
  }) {
    this.formDataId = formDataId;
    this.fieldId = SelectModel.create(fieldId);
    this.type = type;
    this.filterFormData = filter;

    makeAutoObservable(this);
  }

  private static _generateFormDataId(): number {
    return UuidUtil.generate8number();
  }

  static fromModel(model: AutomationFieldCondition): EntityTypeFieldConditionFormData {
    let filter: PossibleFilterFormData;

    switch (model.type) {
      case SimpleFilterType.BOOLEAN: {
        filter = BooleanFilterFormData.fromModel(model.filter as BooleanFilter);

        break;
      }

      case SimpleFilterType.DATE: {
        filter = DateFilterFormData.fromModel(model.filter as DateFilter);

        break;
      }
      case SimpleFilterType.NUMBER: {
        filter = NumberFilterFormData.fromModel(model.filter as NumberFilter);

        break;
      }
      case SimpleFilterType.SELECT: {
        filter = SelectFilterFormData.fromModel(model.filter as SelectFilter);

        break;
      }

      case SimpleFilterType.STRING: {
        filter = StringFilterFormData.fromModel(model.filter as StringFilter);

        break;
      }

      case SimpleFilterType.EXISTS: {
        filter = ExistsFilterFormData.fromModel(model.filter as ExistsFilter);

        break;
      }
    }

    return new EntityTypeFieldConditionFormData({
      // do not change to "this"
      formDataId: EntityTypeFieldConditionFormData._generateFormDataId(),
      filter,
      type: model.type,
      fieldId: model.fieldId,
    });
  }

  static fromModels(models: AutomationFieldCondition[]): EntityTypeFieldConditionFormData[] {
    return models.map(this.fromModel);
  }

  static empty(): EntityTypeFieldConditionFormData {
    return new EntityTypeFieldConditionFormData({
      // do not change to "this"
      formDataId: EntityTypeFieldConditionFormData._generateFormDataId(),
      fieldId: null,
      type: null,
      filter: null,
    });
  }

  toModel = (): AutomationFieldCondition => {
    if (!this.type || !this.filterFormData)
      throw new Error(
        `Failed to convert form data ${this.fieldId} to model: type or filter is null, type: ${this.type}, filter: ${this.filterFormData}`
      );

    return {
      type: this.type,
      fieldId: this.fieldId.value,
      filter: this.filterFormData.toModel(),
    };
  };
}

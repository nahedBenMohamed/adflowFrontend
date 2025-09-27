import { userStore } from '@/app';
import { BooleanModel, InputModel, type User } from '@/shared';
import type { AutomationProcess } from './AutomationProcess';

export class AutomationProcessRow {
  id: number;
  createdBy: User;
  name: InputModel;
  isActive: BooleanModel;

  private constructor({
    id,
    name,
    isActive,
    createdBy,
  }: {
    id: number;
    name: string;
    createdBy: number;
    isActive: boolean;
  }) {
    this.id = id;
    this.createdBy = userStore.getById(createdBy);
    this.name = InputModel.create(name).required();
    this.isActive = BooleanModel.create(isActive);
  }

  static fromModel(model: AutomationProcess): AutomationProcessRow {
    return new AutomationProcessRow({
      id: model.id,
      name: model.name,
      isActive: model.isActive,
      createdBy: model.createdBy,
    });
  }
}

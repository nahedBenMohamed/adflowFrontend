import { resetAllSchedulesQueries } from '@/modules/scheduler';
import type { DataStore, User } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { departmentsSettingsApi, type CreateDepartmentDto, type UpdateDepartmentDto } from '../api';
import type { Department } from '../shared';

class DepartmentsSettingsStore implements DataStore {
  departments: Department[] = [];

  isLoading = false;
  isLoaded = false;
  isAdding = false;

  constructor() {
    makeAutoObservable(this);
  }

  get departmentsAndSubdepartments(): Department[] {
    return this.departments.flatMap<Department>(d => [d, ...d.subordinates]);
  }

  getById = (id: number): Department => {
    // attempt to find department
    const department = this.departments.find(d => d.id === id);

    if (!department) {
      // attempt to find subdepartment in subordinates
      const subdepartment = this.departments.flatMap(d => d.subordinates).find(d => d.id === id);

      if (!subdepartment) throw new Error(`Department with id ${id} was not found`);

      return subdepartment;
    }

    return department;
  };

  getDepartmentsByIds = (ids: number[]): Department[] => {
    return ids.map<Department>(id => this.getById(id));
  };

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;
      this.isLoaded = false;

      this.departments = await departmentsSettingsApi.getGroups();
    } catch (e) {
      throw new Error(`Error while loading departments: ${e}`);
    } finally {
      this.isLoading = false;
      this.isLoaded = true;
    }
  };

  invalidateDepartmentsCache = async (): Promise<void> => {
    this.departments = await departmentsSettingsApi.getGroups();
  };

  addDepartment = async (dto: CreateDepartmentDto): Promise<void> => {
    try {
      this.isAdding = true;

      const createdGroup = await departmentsSettingsApi.addGroup(dto);

      if (!createdGroup.parentId) {
        this.departments.push(createdGroup);

        return;
      }

      const parentGroup = this.departments.find(d => d.id === createdGroup.parentId);

      if (!parentGroup)
        throw new Error(
          `Parent group ${createdGroup.parentId} for ${createdGroup.name} with id was not found`
        );

      parentGroup.subordinates.push(createdGroup);
    } catch (e) {
      throw new Error(`Error while adding group ${dto.name}: ${e}`);
    } finally {
      this.isAdding = false;
    }
  };

  updateDepartment = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateDepartmentDto;
  }): Promise<void> => {
    try {
      await departmentsSettingsApi.updateGroup({ id, dto });
    } catch (e) {
      throw new Error(`Error while updating group ${id}: ${e}`);
    }
  };

  deleteDepartment = async ({
    id,
    newDepartmentId,
  }: {
    id: number;
    newDepartmentId?: number;
  }): Promise<void> => {
    try {
      await departmentsSettingsApi.deleteGroup({ id, newDepartmentId });

      const parentGroup = this.departments.find(d => d.subordinates.some(s => s.id === id));

      if (!parentGroup) {
        this.departments = this.departments.filter(d => d.id !== id);

        return;
      }

      parentGroup.subordinates = parentGroup.subordinates.filter(d => d.id !== id);

      await resetAllSchedulesQueries();
    } catch (e) {
      throw new Error(`Error while deleting group ${id}: ${e}`);
    }
  };

  checkDepartments = (user: User): { hasDepartment: boolean; hasSubdepartment: boolean } => {
    if (user.departmentId !== null) {
      const department = this.departments.find(d => d.id === user.departmentId);

      if (department) {
        return { hasDepartment: true, hasSubdepartment: false };
      } else {
        const parentDepartment = this.departments.find(d =>
          d.subordinates.some(s => s.id === user.departmentId)
        );

        if (parentDepartment) return { hasDepartment: true, hasSubdepartment: true };
      }
    }

    return { hasDepartment: false, hasSubdepartment: false };
  };

  reset = (): void => {
    this.departments = [];

    this.isLoading = false;
    this.isLoaded = false;
    this.isAdding = false;
  };
}

export const departmentsSettingsStore = new DepartmentsSettingsStore();

import {
  CreateUserDto,
  generalSettingsStore,
  invalidateUserProfilesInCache,
  ObjectPermissionDto,
  UpdateUserDto,
  UpdateUserProfileDto,
  userProfileApi,
  userStore,
} from '@/app';
import { WarehouseStore, type Warehouse } from '@/modules/products';
import {
  BooleanModel,
  InputModel,
  MultiselectModel,
  ObjectPermission,
  PermissionLevel,
  PermissionObjectType,
  SelectModel,
  UserRole,
  validateForm,
  type Nullable,
  type User,
  type UserProfile,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { ObjectPermissionModel } from '../shared';
import { UserCalendarStore } from './UserCalendarStore';

export class EditUserStore {
  currentUser: Nullable<User> = null;
  userProfile: Nullable<UserProfile> = null;
  userCalendar: UserCalendarStore;

  editMode: boolean;
  email: InputModel;
  phone: InputModel;
  role: SelectModel;
  lastName: InputModel;
  position: InputModel;
  firstName: InputModel;
  departmentId: SelectModel;
  accessibleUserIds: MultiselectModel<number>;

  accessibleWarehouses: MultiselectModel<number>;
  warehouseStores: WarehouseStore[];

  addUserPassword: InputModel;
  updateUserPassword: InputModel;

  objectPermissionModels: ObjectPermissionModel[];
  hasDepartment: boolean;
  hasSubdepartment: boolean;

  workingTimeFrom: InputModel;
  workingTimeTo: InputModel;
  inheritWorkingTime: BooleanModel;

  areWarehouseStoresLoaded = false;
  areWarehouseStoresInitialized = false;

  constructor() {
    this.userCalendar = new UserCalendarStore();

    this.editMode = false;
    this.firstName = InputModel.create().required();
    this.lastName = InputModel.create().required();
    this.email = InputModel.create().required().email();
    this.phone = InputModel.create().phoneInternational();

    this.role = SelectModel.create(UserRole.USER);
    this.departmentId = SelectModel.create();
    this.position = InputModel.create();

    this.addUserPassword = InputModel.create().required();
    this.updateUserPassword = InputModel.create();

    this.objectPermissionModels = [];
    this.accessibleUserIds = MultiselectModel.create();

    this.accessibleWarehouses = MultiselectModel.create();
    this.warehouseStores = [];

    this.hasDepartment = false;
    this.hasSubdepartment = false;

    this.workingTimeFrom = InputModel.create(generalSettingsStore.accountSettings?.workingTimeFrom);
    this.workingTimeTo = InputModel.create(generalSettingsStore.accountSettings?.workingTimeTo);
    this.inheritWorkingTime = BooleanModel.create();

    makeAutoObservable(this);
  }

  handleInitializeProductsSectionWarehousesModels = async (
    productsSectionsIds: number[]
  ): Promise<void> => {
    this.warehouseStores = productsSectionsIds.map<WarehouseStore>(id => new WarehouseStore(id));

    this.areWarehouseStoresInitialized = true;

    try {
      this.areWarehouseStoresLoaded = false;

      await Promise.all(this.warehouseStores.map<Promise<void>>(s => s.loadData()));

      this.accessibleWarehouses = MultiselectModel.create(
        this.warehouseStores
          .flatMap<Warehouse>(m => m.activeWarehouses)
          .filter(w => {
            const objectPermission = this.objectPermissionModels.find(
              opm => opm.objectId === w.id && opm.objectType === PermissionObjectType.WAREHOUSE
            );

            return !objectPermission || objectPermission.view.value === PermissionLevel.ALLOWED;
          })
          .map<number>(w => w.id)
      );
    } catch (e) {
      throw new Error(`Failed to initialize products section warehouses models: ${e}`);
    } finally {
      this.areWarehouseStoresLoaded = true;
    }
  };

  getWarehouseStoreByProductsSectionId = (sectionId: number): WarehouseStore => {
    const warehouseStore = this.warehouseStores.find(s => s.sectionId === sectionId);

    if (!warehouseStore)
      throw new Error(`Failed to find warehouse store for products section ${sectionId}`);

    return warehouseStore;
  };

  setUser = async ({
    user,
    hasDepartment,
    hasSubdepartment,
  }: {
    user: User;
    hasDepartment: boolean;
    hasSubdepartment: boolean;
  }): Promise<void> => {
    this.currentUser = user;
    this.userProfile = await userProfileApi.getUserProfile(this.currentUser.id);

    await this.userCalendar.loadData(user.id);

    this.editMode = true;

    this.email.value = user.email;
    this.firstName.value = user.firstName;
    this.lastName.value = user.lastName || '';
    this.position.value = user.position || '';
    this.departmentId.value = user.departmentId;
    this.role.value = user.role || UserRole.USER;

    this.objectPermissionModels = [];
    this.accessibleUserIds.setValue(user.accessibleUserIds);
    this.accessibleWarehouses.setValue(
      user.objectPermissions
        .filter(op => op.objectType !== PermissionObjectType.WAREHOUSE && op.objectId)
        .map<number>(op => op.objectId as number)
    );

    for (const op of user.objectPermissions) {
      this.createObjectPermissionModel(op);
    }

    // this is needed because warehouse stores are only loaded in ObjectPermissions component,
    // which is not rendered if user is admin or owner
    if (user.role !== UserRole.USER) this.areWarehouseStoresLoaded = true;

    this.phone = InputModel.create(user.phone).phoneInternational();

    this.hasDepartment = hasDepartment;
    this.hasSubdepartment = hasSubdepartment;

    this.inheritWorkingTime = BooleanModel.create(
      this.userProfile.workingTimeFrom === null || this.userProfile.workingTimeTo === null
    );

    if (!this.inheritWorkingTime.value) {
      this.workingTimeFrom = InputModel.create(this.userProfile.workingTimeFrom);
      this.workingTimeTo = InputModel.create(this.userProfile.workingTimeTo);
    }
  };

  validate = (): boolean => {
    return this.editMode || validateForm(this);
  };

  getObjectPermissionModel = ({
    objectType,
    objectId,
  }: {
    objectType: PermissionObjectType;
    objectId: Nullable<number>;
  }): ObjectPermissionModel => {
    const model = this.objectPermissionModels.find(
      o => o.objectType === objectType && o.objectId === objectId
    );

    if (!model)
      return this.createObjectPermissionModel(
        ObjectPermission.getDefaultDenied(objectType, objectId)
      );

    return model;
  };

  addUser = async (): Promise<void> => {
    const newUser = new CreateUserDto({
      email: this.email.trimmedValue,
      phone: this.phone.valueOrNull(),
      lastName: this.lastName.trimmedValue,
      password: this.addUserPassword.trimmedValue,
      position: this.position.valueOrNull(),
      firstName: this.firstName.trimmedValue,
      objectPermissions: this.getObjectPermissionDtos(),
      role: this.role.value ? this.role.value : UserRole.USER,
      departmentId: this.departmentId.value ? this.departmentId.value : null,
      accessibleUserIds: this.accessibleUserIds.valuesOrEmptyArray,
    });

    const user = await userStore.add(newUser);
    await this.userCalendar.updateCalendar(user.id);
  };

  updateUser = async (userId: number): Promise<void> => {
    const userDto = new UpdateUserDto({
      role: this.role.value,
      email: this.email.trimmedValue,
      phone: this.phone.valueOrNull(),
      lastName: this.lastName.trimmedValue,
      position: this.position.valueOrNull(),
      firstName: this.firstName.trimmedValue,
      avatarUrl: this.currentUser?.avatarUrl ?? null,
      password: this.updateUserPassword.valueOrNull(),
      objectPermissions: this.getObjectPermissionDtos(),
      departmentId: this.departmentId.value ? this.departmentId.value : null,
      accessibleUserIds: this.accessibleUserIds.valuesOrEmptyArray,
    });

    const profileDto = new UpdateUserProfileDto({
      workingTimeFrom: this.inheritWorkingTime.value ? null : this.workingTimeFrom.value,
      workingTimeTo: this.inheritWorkingTime.value ? null : this.workingTimeTo.value,
    });

    await userStore.update({ id: userId, dto: userDto });
    await userProfileApi.updateUserProfile({ id: userId, dto: profileDto });
    await this.userCalendar.updateCalendar(userId);

    invalidateUserProfilesInCache();
  };

  private getObjectPermissionDtos = (): ObjectPermissionDto[] => {
    return [
      ...this.objectPermissionModels
        // We are handling WAREHOUSE permissions in our own way
        .filter(opm => opm.objectType !== PermissionObjectType.WAREHOUSE)
        .map<ObjectPermissionDto>(
          opm =>
            new ObjectPermissionDto({
              objectId: opm.objectId,
              objectType: opm.objectType,
              viewPermission: opm.view.value as PermissionLevel,
              editPermission: opm.edit.value as PermissionLevel,
              createPermission: opm.create.value as PermissionLevel,
              deletePermission: opm.delete.value as PermissionLevel,
              reportPermission: opm.report.value as PermissionLevel,
              dashboardPermission: opm.dashboard.value as PermissionLevel,
            })
        ),
      // For now, if warehouse is in accessibleWarehouses, it means that user has ALLOWED permission for all properties...
      ...this.accessibleWarehouses.valuesOrEmptyArray.map<ObjectPermissionDto>(id =>
        ObjectPermissionDto.createAllAllowed({
          objectId: id,
          objectType: PermissionObjectType.WAREHOUSE,
        })
      ),
      // ... otherwise, if warehouse is not in accessibleWarehouses, it means that user has DENIED permission for all properties
      ...this.warehouseStores
        .flatMap<Warehouse>(m => m.activeWarehouses)
        .filter(w => !this.accessibleWarehouses.valuesOrEmptyArray.includes(w.id))
        .map<ObjectPermissionDto>(w =>
          ObjectPermissionDto.createAllDenied({
            objectId: w.id,
            objectType: PermissionObjectType.WAREHOUSE,
          })
        ),
    ];
  };

  private createObjectPermissionModel = (
    objectPermission: ObjectPermission
  ): ObjectPermissionModel => {
    const model: ObjectPermissionModel = {
      objectId: objectPermission.objectId,
      objectType: objectPermission.objectType,
      view: InputModel.create(objectPermission.viewPermission),
      edit: InputModel.create(objectPermission.editPermission),
      create: InputModel.create(objectPermission.createPermission),
      delete: InputModel.create(objectPermission.deletePermission),
      report: InputModel.create(objectPermission.reportPermission),
      dashboard: InputModel.create(objectPermission.dashboardPermission),
    };

    this.objectPermissionModels.push(model);

    return model;
  };
}

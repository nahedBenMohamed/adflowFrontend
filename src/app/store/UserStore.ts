import { authStore } from '@/modules/auth';
import { resetAllSchedulesQueries } from '@/modules/scheduler';
import { UserRole, type DataStore, type Nullable, type Option, type User } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  userApi,
  type ChangeUserPasswordDto,
  type CreateUserDto,
  type UpdateUserDto,
} from '../api';

export class UserStore implements DataStore {
  private _users: User[] = [];

  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  get allUsers(): User[] {
    return this._users;
  }

  get activeUsers(): User[] {
    return this._users.filter(u => u.isActive);
  }

  get activeUsersWithoutDepartments(): User[] {
    return this.activeUsers.filter(u => !u.departmentId);
  }

  get activeUsersWithoutCurrent(): User[] {
    const currentUser = authStore.user;

    return this.activeUsers.filter(u => u.id !== currentUser?.id);
  }

  get firstActiveUser(): User {
    const user = this.activeUsers[0];

    if (!user) throw new Error('No active users available, failed to get the first active user');

    return user;
  }

  get activeUserOptions(): Option<number>[] {
    return this.activeUsers.map<Option<number>>(u => ({
      value: u.id,
      label: u.fullName,
    }));
  }

  getById = (id: number): User => {
    const user = this._users.find(u => u.id === id);

    if (!user) throw new Error(`User with id ${id} was not found`);

    return user;
  };

  getActiveById = (id: number): User => {
    const user = this.getById(id);

    if (!user) throw new Error(`User with id ${id} not active`);

    return user;
  };

  getDepartmentActiveUsers = (departmentId: number): User[] => {
    return this.activeUsers.filter(u => u.departmentId === departmentId);
  };

  loadData = async (): Promise<void> => {
    try {
      this.isLoaded = false;

      this._users = await userApi.getUsers();
    } catch (e) {
      throw new Error(`Error while loading users: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  invalidateUsersCache = async (): Promise<void> => {
    this._users = await userApi.getUsers();
  };

  delete = async ({ userId, newUserId }: { userId: number; newUserId?: number }): Promise<void> => {
    try {
      await userApi.deleteUser({ userId, newUserId });
    } catch (e) {
      throw new Error(`Error while deleting user ${userId}: ${e}`);
    }

    const deletedUser = this._users.find(u => u.id === userId);

    if (!deletedUser) throw new Error(`User with id ${userId} was not found`);

    deletedUser.isActive = false;

    await resetAllSchedulesQueries();
  };

  update = async ({ id, dto }: { id: number; dto: UpdateUserDto }): Promise<void> => {
    const updatedUser = await userApi.updateUser({ id, dto });

    this._users = this._users.map<User>(u => (u.id === id ? updatedUser : u));
  };

  add = async (dto: CreateUserDto): Promise<User> => {
    const newUser = await userApi.addUser(dto);

    this._users.push(newUser);

    return newUser;
  };

  isOwner = (id: number): boolean => {
    const user = this.getById(id);

    return user.role === UserRole.OWNER;
  };

  updateUserAvatar = async ({
    id,
    avatarUrl,
  }: {
    id: number;
    avatarUrl: Nullable<string>;
  }): Promise<void> => {
    const user = this.getById(id);

    user.avatarUrl = avatarUrl;
  };

  changeUserPassword = async (dto: ChangeUserPasswordDto): Promise<boolean> => {
    try {
      return await userApi.changeUserPassword(dto);
    } catch (e) {
      return false;
    }
  };

  reset = (): void => {
    this._users = [];

    this.isLoaded = false;
  };
}

export const userStore = new UserStore();

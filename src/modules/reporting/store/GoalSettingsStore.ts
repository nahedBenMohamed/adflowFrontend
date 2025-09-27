import { watchdogStore } from '@/app';
import { type DataStore, UtcDate } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { goalSettingsApi } from '../api';
import type { SalesPlan } from '../shared';

export class GoalSettingsStore implements DataStore {
  private _usersGoals: SalesPlan[] = [];

  etId: number;
  startDate: string;
  endDate: string;
  totalAmount = 0;
  totalQuantity = 0;
  currentTotalAmount = 0;
  currentTotalQuantity = 0;

  isLoading = false;

  constructor({ etId, startDate, endDate }: { etId: number; startDate: string; endDate: string }) {
    this.etId = etId;
    this.startDate = startDate;
    this.endDate = endDate;

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  get goals(): SalesPlan[] {
    return this._usersGoals;
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;

      this._usersGoals = await goalSettingsApi.getUsersGoals({
        entityTypeId: this.etId,
        period: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });

      this.loadSalesPlans();

      this.setTotalAmount();
      this.setTotalQuantity();
    } catch (e) {
      throw new Error(`Error while loading users goals: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  loadSalesPlans = async (): Promise<void> => {
    try {
      const salesPlans = await goalSettingsApi.getSalesPlans({
        entityTypeId: this.etId,
        period: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });

      this.currentTotalAmount = salesPlans.reduce<number>((acc, sp) => acc + sp.currentAmount, 0);
      this.currentTotalQuantity = salesPlans.reduce<number>(
        (acc, sp) => acc + sp.currentQuantity,
        0
      );
    } catch (e) {
      throw new Error(`Error while loading sales plans: ${e}`);
    }
  };

  updateData = async (usersGoals: SalesPlan[]): Promise<void> => {
    try {
      await goalSettingsApi.updateUserGoals({ entityTypeId: this.etId, data: usersGoals });
    } catch (e) {
      throw new Error(`Error while updating users goals: ${e}`);
    }
  };

  updateUsersGoals = (usersGoals: SalesPlan[]): void => {
    this._usersGoals = this._usersGoals.map(u => {
      const user = usersGoals.find(ug => ug.userId === u.userId);

      if (user) return { ...u, amount: user.amount, quantity: user.quantity };

      return u;
    });

    this.setTotalAmount();
    this.setTotalQuantity();
  };

  addUsersGoals = async (usersGoals: SalesPlan[]): Promise<void> => {
    try {
      const editedUsersGoals = await goalSettingsApi.updateUserGoals({
        entityTypeId: this.etId,
        data: usersGoals,
      });

      this._usersGoals = [...this._usersGoals, ...editedUsersGoals];

      this.setTotalAmount();
      this.setTotalQuantity();

      this.loadSalesPlans();
    } catch (e) {
      throw new Error(`Error while adding users goals: ${e}`);
    }
  };

  deleteUserGoals = async (uId: number): Promise<void> => {
    try {
      await goalSettingsApi.deleteUserGoals({
        entityTypeId: this.etId,
        userId: uId,
        period: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });

      const idx = this._usersGoals.findIndex(u => u.userId === uId);

      if (idx === -1) throw new Error(`User with id ${uId} have not goals`);

      this._usersGoals.splice(idx, 1);

      this.loadSalesPlans();
    } catch (e) {
      throw new Error(`Error while deleting user goals: ${e}`);
    }
  };

  deleteAllGoals = async (): Promise<void> => {
    const dateNow = UtcDate.now();

    try {
      await goalSettingsApi.deleteAllGoals({
        entityTypeId: this.etId,
        startDate: UtcDate.fromDate(
          new Date(dateNow.year, Math.floor((dateNow.month + 3) / 3 - 1) * 3, 0)
        ).formatISO(),
      });
    } catch (e) {
      throw new Error(`Error while deleting all goals: ${e}`);
    }
  };

  pickAddedUsers = (userIds: number[]): number[] => {
    return userIds.filter(uId => !this._usersGoals.find(g => g.userId === uId));
  };

  pickDeletedUsers = (userIds: number[]): number[] => {
    return this._usersGoals
      .filter(ug => !userIds.some(id => id === ug.userId))
      .map(ug => ug.userId);
  };

  setTotalAmount = (): void => {
    this.totalAmount = this._usersGoals.reduce<number>((acc, up) => acc + up.amount, 0);
  };

  setTotalQuantity = (): void => {
    this.totalQuantity = this._usersGoals.reduce<number>((acc, up) => acc + up.quantity, 0);
  };

  reset = (): void => {
    this._usersGoals = [];
  };
}

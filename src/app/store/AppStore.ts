import { watchdogStore } from '@/app';
import { authStore } from '@/modules/auth';
import { mailboxSettingsStore } from '@/modules/mailing';
import { notificationsStore, toastNotificationsStore } from '@/modules/notifications';
import { productsModuleStore } from '@/modules/products';
import { schedulerEventHandlerStore } from '@/modules/scheduler';
import { departmentsSettingsStore } from '@/modules/settings';
import { activityTypeStore, taskSettingsStore } from '@/modules/tasks';
import { voximplantConnectorStore } from '@/modules/telephony';
import type { DataStore, SubscriberStore } from '@/shared';
import { flow, makeAutoObservable, runInAction, when } from 'mobx';
import { entityTypeStore } from './EntityTypeStore';
import { featureStore } from './FeatureStore';
import { generalSettingsStore } from './GeneralSettingsStore';
import { identityStore } from './IdentityStore';
import { subscriptionStore } from './SubscriptionStore';
import { userStore } from './UserStore';

class AppStore {
  isLoaded = false;

  private _dataStores: DataStore[] = [
    userStore,
    identityStore,
    featureStore,
    entityTypeStore,
    subscriptionStore,
    activityTypeStore,
    taskSettingsStore,
    productsModuleStore,
    generalSettingsStore,
    departmentsSettingsStore,
    notificationsStore,
    mailboxSettingsStore,
  ];

  private _subscriberStores: SubscriberStore[] = [
    notificationsStore,
    toastNotificationsStore,
    schedulerEventHandlerStore,
  ];

  constructor() {
    makeAutoObservable(this);
  }

  load = flow(function* (this: AppStore) {
    try {
      // wait for auth
      yield when(() => authStore.isAuthenticated);

      // we assume that this data is important but not mandatory for app functionality,
      // so some promises could possibly reject
      Promise.allSettled([voximplantConnectorStore.loadData()]);

      // load global stores, we assume that this data is essential for app functionality
      yield Promise.all(this._dataStores.map(ds => ds.loadData()));

      // subscribe to global events
      yield Promise.all(this._subscriberStores.map(ss => ss.subscribe()));

      this._dataStores.forEach(ds => watchdogStore.watch(ds));
    } catch (e) {
      throw new Error(`Error loading app: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  });

  reset = (): void => {
    // clear all global stores
    runInAction(() => {
      voximplantConnectorStore.reset();

      this._dataStores.forEach(ds => ds.reset());
    });

    // unsubscribe from global events
    runInAction(() => {
      this._subscriberStores.forEach(ss => ss.unsubscribe());
    });

    watchdogStore.reset();

    this.isLoaded = false;
  };
}

export const appStore = new AppStore();

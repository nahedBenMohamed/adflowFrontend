import { authStore } from '@/modules/auth';
import { voximplantConnectorStore } from '@/modules/telephony';
import { type DataStore, UtcDate } from '@/shared';
import { makeAutoObservable } from 'mobx';

// 1 minute – consider data as stale
const INACTIVE_THRESHOLD = 60;

// 2 hours – consider tab as stale
const HARD_RESET_THRESHOLD = 2 * 60 * 60;

// 24 hours – consider tab as old and notify user about page reload
const RELOAD_THRESHOLD = 24 * 60 * 60;

// 5 minutes – monitor tab open time
const HEARTBEAT_INTERVAL = 5 * 60 * 1000;

class WatchdogStore {
  lastVisibilityChange = UtcDate.now();
  tabOpenTime = UtcDate.now();

  isSessionStale = false;

  dataStores: WeakRef<DataStore>[] = [];

  constructor() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.startHeartbeat();

    makeAutoObservable(this);
  }

  watch = (store: DataStore): void => {
    this.dataStores.push(new WeakRef(store));
  };

  handleVisibilityChange = async (): Promise<void> => {
    if (document.visibilityState === 'visible') {
      const now = UtcDate.now();
      const inactiveTime = now.diff(this.lastVisibilityChange);

      if (inactiveTime > RELOAD_THRESHOLD) {
        this.notifyReload();
      } else if (inactiveTime > HARD_RESET_THRESHOLD) {
        await this.hardReloadData();
      } else if (inactiveTime > INACTIVE_THRESHOLD) {
        await this.reloadData();
      }

      this.lastVisibilityChange = now;
    }
  };

  cleanupOldRefs = (): void => {
    this.dataStores = this.dataStores.filter(ref => ref.deref() !== undefined);
  };

  startHeartbeat = (): void => {
    setInterval(() => {
      if (!this.isSessionStale && UtcDate.now().diff(this.tabOpenTime) > RELOAD_THRESHOLD) {
        this.notifyReload();
      } else {
        this.cleanupOldRefs();
      }
    }, HEARTBEAT_INTERVAL);
  };

  reloadData = async (): Promise<void> => {
    this.cleanupOldRefs();

    await Promise.all(this.dataStores.map(ref => ref.deref()?.loadData()));
  };

  hardReloadData = async (): Promise<void> => {
    console.log(
      'Watchdog marked this tab as stale! It is recommended to reload the page in case of errors.'
    );

    await Promise.all([
      this.reloadData(),
      voximplantConnectorStore.loadData(),
      authStore.invalidateCurrentUserInCache(),
    ]);
  };

  notifyReload = () => {
    this.hardReloadData();

    this.isSessionStale = true;
  };

  reset = (): void => {
    this.dataStores = [];
  };
}

export const watchdogStore = new WatchdogStore();

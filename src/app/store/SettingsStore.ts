import { makeAutoObservable, observe } from 'mobx';

export class SettingsStore<T extends Record<string, any>> {
  settings: T;

  private constructor(name: string) {
    const stored = localStorage.getItem(name);
    this.settings = stored ? (JSON.parse(stored) as T) : ({} as T);

    makeAutoObservable(this);
  }

  static getSettingsStore<T extends Record<string, any>>(name: string): SettingsStore<T> {
    const store = new SettingsStore<T>(name);

    observe(store.settings, () => {
      localStorage.setItem(name, JSON.stringify(store.settings));
    });

    return store;
  }
}

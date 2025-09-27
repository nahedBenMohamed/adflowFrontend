// Base interface for all data-manipulating stores.
export interface DataStore {
  // Asynchronously loads data for the store. It is intended to use only for initial data loading.
  loadData: () => Promise<void>;

  // Resets all the store data.
  reset: () => void;
}

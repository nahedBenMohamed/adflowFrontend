class StorageService {
  get = <T>(key: string): T | null => {
    const stored = localStorage.getItem(key);

    return stored ? (JSON.parse(stored) as T) : null;
  };

  set = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };
}

export const storageService = new StorageService();

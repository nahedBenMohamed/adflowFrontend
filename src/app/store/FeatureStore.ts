import type { DataStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { featureApi, type FeatureDto } from '../api';

class FeatureStore implements DataStore {
  features: FeatureDto[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.features = await featureApi.getFeatures();
    } catch (e) {
      throw new Error(`Error while loading features: ${e}`);
    }
  };

  reset = (): void => {
    this.features = [];
  };
}

export const featureStore = new FeatureStore();

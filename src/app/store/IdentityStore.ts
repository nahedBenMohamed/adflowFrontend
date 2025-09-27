import type { DataStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SequenceName, identityApi, type IdentityPool } from '../api';

const ID_POOLS_LS_KEY = 'id_pools';

class IdentityStore implements DataStore {
  isFetchingMore = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    const poolsInStorage = localStorage.getItem(ID_POOLS_LS_KEY);

    if (poolsInStorage) return;

    try {
      const pools = await identityApi.getAllIdPools();

      localStorage.setItem(ID_POOLS_LS_KEY, JSON.stringify(pools));
    } catch (e) {
      throw new Error(`Error while loading id pools: ${e}`);
    }
  };

  getFieldId = (): number => {
    return this.getIdFromPool(SequenceName.FIELD);
  };

  getFieldGroupId = (): number => {
    return this.getIdFromPool(SequenceName.FIELD_GROUP);
  };

  getFieldOptionId = (): number => {
    return this.getIdFromPool(SequenceName.FIELD_OPTION);
  };

  getPoolFromStorage = (seqName: SequenceName): { pool: IdentityPool; idx: number } => {
    const parsedPools = this.getParsedPoolsFromStorage();

    const idx = parsedPools.findIndex(p => p.name === seqName);
    const parsedPool = idx === -1 ? null : parsedPools[idx];

    if (!parsedPool) throw new Error(`Can not get id pool for sequence ${seqName}`);

    return { pool: parsedPool, idx };
  };

  getParsedPoolsFromStorage = (): IdentityPool[] => {
    const pools = localStorage.getItem(ID_POOLS_LS_KEY);

    if (!pools) throw new Error('Id pools are not initialized');

    return JSON.parse(pools) as IdentityPool[];
  };

  addIdsToPool = ({ seqName, ids }: { seqName: SequenceName; ids: number[] }): void => {
    const { pool, idx } = this.getPoolFromStorage(seqName);

    const parsedPools = this.getParsedPoolsFromStorage();
    const parsedPool = parsedPools[idx];

    if (!parsedPool) throw new Error(`Can not addIdsToPool, parsed pool was not found, ${seqName}`);

    parsedPool.values = [...pool.values, ...ids];

    localStorage.setItem(ID_POOLS_LS_KEY, JSON.stringify(parsedPools));
  };

  updateIdsInPool = ({ seqName, ids }: { seqName: SequenceName; ids: number[] }): void => {
    const parsedPools = this.getParsedPoolsFromStorage();
    const { idx } = this.getPoolFromStorage(seqName);

    const parsedPool = parsedPools[idx];

    if (!parsedPool)
      throw new Error(`Can not updateIdsInPool, parsed pool was not found, ${seqName}`);

    parsedPool.values = ids;

    localStorage.setItem(ID_POOLS_LS_KEY, JSON.stringify(parsedPools));
  };

  getIdFromPool = (seqName: SequenceName): number => {
    const { pool } = this.getPoolFromStorage(seqName);

    let poolValues = pool.values;

    if (poolValues.length <= 10 && !this.isFetchingMore) {
      let additionalIds: number[] = [];

      this.isFetchingMore = true;

      identityApi
        .getIdPoolValues(seqName)
        .then(res => {
          additionalIds = res;

          this.addIdsToPool({ seqName, ids: additionalIds });
        })
        .catch(err => {
          console.error('Error while getting more ids for pool', err);
        })
        .finally(() => {
          this.isFetchingMore = false;
        });
    }

    const id = poolValues.shift();

    if (id) {
      this.updateIdsInPool({ seqName, ids: poolValues });

      return id;
    }

    throw new Error(`Can not get id from pool ${seqName}`);
  };

  reset = (): void => {
    localStorage.removeItem(ID_POOLS_LS_KEY);

    this.isFetchingMore = false;
  };
}

export const identityStore = new IdentityStore();

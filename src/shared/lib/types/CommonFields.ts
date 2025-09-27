import { type CommonKeys } from './CommonKeys';

export type CommonFields<T, U> = {
  [K in CommonKeys<T, U>]: T[K];
};

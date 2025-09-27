export type CommonKeys<T, U> = Extract<keyof T, keyof U>;

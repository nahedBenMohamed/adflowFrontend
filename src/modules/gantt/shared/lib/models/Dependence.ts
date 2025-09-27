import type { DependenceType } from '../types';

export interface Dependence {
  from: string;
  to: string;
  type: DependenceType;
  color?: string;
}

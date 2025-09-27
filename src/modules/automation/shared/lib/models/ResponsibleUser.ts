import type { Nullable } from '@/shared';
import type { ResponsibleUserType } from './ResponsibleUserType';

export class ResponsibleUser {
  type: ResponsibleUserType;
  id: Nullable<number>;

  constructor({ type, id }: ResponsibleUser) {
    this.type = type;
    this.id = id;
  }
}

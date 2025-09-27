import type { Nullable } from '../../types';

export interface EntitySettings {
  contactEntityTypeId?: Nullable<number>;
  leadEntityTypeId?: Nullable<number>;
  leadBoardId?: Nullable<number>;
  leadStageId?: Nullable<number>;
  leadName?: Nullable<string>;
  ownerId?: Nullable<number>;
  checkActiveLead?: Nullable<boolean>;
  checkDuplicate?: Nullable<boolean>;
}

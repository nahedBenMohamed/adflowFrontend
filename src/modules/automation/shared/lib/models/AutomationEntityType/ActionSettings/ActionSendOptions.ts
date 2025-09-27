import type { Nullable } from '@/shared';
import type { ActionSendOptionsEntity } from './ActionSendOptionsEntity';
import type { ActionSendOptionsValue } from './ActionSendOptionsValue';

export interface ActionSendOptions {
  main?: Nullable<ActionSendOptionsValue>;
  contact?: Nullable<ActionSendOptionsEntity>;
  company?: Nullable<ActionSendOptionsEntity>;
}

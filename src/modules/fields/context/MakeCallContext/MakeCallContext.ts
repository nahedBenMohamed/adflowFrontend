import type { Entity, Nullable } from '@/shared';
import { createContext } from 'react';

export interface MakeCallContextValue {
  entity: Nullable<Entity>;
  linkedEntity: Nullable<Entity>;
  setEntity: (entity: Entity) => void;
  setLinkedEntity: (entity: Entity) => void;
}

export const MakeCallContext = createContext<Nullable<MakeCallContextValue>>(null);

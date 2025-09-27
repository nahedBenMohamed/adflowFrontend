import type { EntityTypeActionType } from '@/shared';
import type { ReactNode } from 'react';

export class ActionTypeEntityTypeInfo {
  type: EntityTypeActionType;
  icon: ReactNode;

  constructor({ type, icon }: ActionTypeEntityTypeInfo) {
    this.type = type;
    this.icon = icon;
  }
}

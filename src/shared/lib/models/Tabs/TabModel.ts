import type { ReactNode } from 'react';

export interface TabModel {
  href: string;
  title: string;
  Icon?: ReactNode;
  active?: boolean;
  tooltip?: string;
  disabled?: boolean;
}

import type { ReactNode } from 'react';

export interface FormulaKey {
  label: ReactNode;
  danger?: boolean;
  outlined?: boolean;
  secondary?: boolean;
  smallText?: boolean;
  handler: () => void;
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { TelephonyButtonSize } from '../../types';

export interface TelephonyFunctionalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icons?: {
    large: ReactNode;
    small: ReactNode;
  };
  label?: string;
  size?: TelephonyButtonSize;
  active?: boolean;
  disabled?: boolean;
  CustomButton?: ReactNode;
}

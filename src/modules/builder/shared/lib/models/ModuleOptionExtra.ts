import type { ProductsSectionType } from '@/modules/products';
import type { ReactNode } from 'react';

export interface ModuleOptionExtra {
  color: string;
  link?: string;
  icon: ReactNode;
  tag?: string;
  comingSoon?: boolean;
  productsSectionType?: ProductsSectionType;
}

import type { AppSumoTiers } from '@/shared';

export interface AppSumoTierData {
  name: AppSumoTiers;
  users: number;
  features: string[];
}

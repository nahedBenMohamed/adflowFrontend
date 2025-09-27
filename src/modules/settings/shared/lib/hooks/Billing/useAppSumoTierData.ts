import type { Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import type { AppSumoTierData } from '../../models';

export const useAppSumoTierData = (name?: string): Nullable<AppSumoTierData> => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.app_sumo_tiers_data',
  });

  if (!name) return null;

  const features = [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4'), t('feature_5')];

  const data: AppSumoTierData[] = [
    {
      name: 'AppSumo Tier 1',
      users: 1,
      features: [...features, t('storage', { storage: 5 })],
    },
    {
      name: 'AppSumo Tier 2',
      users: 5,
      features: [...features, t('storage', { storage: 25 })],
    },
    {
      name: 'AppSumo Tier 3',
      users: 15,
      features: [...features, t('storage', { storage: 75 })],
    },
    {
      name: 'AppSumo Tier 4',
      users: 30,
      features: [...features, t('storage', { storage: 150 })],
    },
    {
      name: 'AppSumo Tier 5',
      users: 50,
      features: [...features, t('storage', { storage: 250 })],
    },
  ];

  return data.find(d => d.name === name) ?? null;
};

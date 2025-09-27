import {
  envUtil,
  OneHundredGbStorageCardIcon,
  OneTbStorageCardIcon,
  type Option,
  TenGbStorageCardIcon,
} from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BuilderAdditionalStorageCategory, type ModuleOptionExtra } from '../models';

export const useGetAdditionalStorageOptions = (): Option<
  BuilderAdditionalStorageCategory,
  ModuleOptionExtra
>[] => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page.module_names',
  });

  return useMemo(
    () => [
      {
        value: BuilderAdditionalStorageCategory.TEN_GB,
        label: t(BuilderAdditionalStorageCategory.TEN_GB),
        extra: {
          icon: <TenGbStorageCardIcon />,
          color: '#000000',
          tag: envUtil.appRUSegment
            ? t('storage.ten_gb_ru_price_tag')
            : t('storage.ten_gb_us_price_tag'),
        },
      },
      {
        value: BuilderAdditionalStorageCategory.ONE_HUNDRED_GB,
        label: t(BuilderAdditionalStorageCategory.ONE_HUNDRED_GB),
        extra: {
          icon: <OneHundredGbStorageCardIcon />,
          color: '#000000',
          tag: envUtil.appRUSegment
            ? t('storage.one_hundred_gb_ru_price_tag')
            : t('storage.one_hundred_gb_us_price_tag'),
        },
      },
      {
        value: BuilderAdditionalStorageCategory.ONE_TB,
        label: t(BuilderAdditionalStorageCategory.ONE_TB),
        extra: {
          icon: <OneTbStorageCardIcon />,
          color: '#000000',
          tag: envUtil.appRUSegment
            ? t('storage.one_tb_ru_price_tag')
            : t('storage.one_tb_us_price_tag'),
        },
      },
    ],
    [t]
  );
};

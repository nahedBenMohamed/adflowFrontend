import { routes } from '@/app';
import {
  DocumentsBuilderCardIcon,
  envUtil,
  FormsBuilderCardIcon,
  MailingBuilderCardIcon,
  MessengerBuilderCardIcon,
  WebsiteChatBuilderCardIcon,
  type Option,
} from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AdditionalModuleCategory, type ModuleOptionExtra } from '../models';

export const useAdditionalModulesOptions = (): Option<
  AdditionalModuleCategory,
  ModuleOptionExtra
>[] => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page.module_names',
  });

  return useMemo(() => {
    let options = [
      {
        value: AdditionalModuleCategory.MAILING,
        label: t('mailing'),
        extra: {
          icon: <MailingBuilderCardIcon />,
          color: '#69D222',
          link: routes.settingsMailing(),
        },
      },
      {
        value: AdditionalModuleCategory.MESSENGER,
        label: t('messenger'),
        extra: {
          icon: <MessengerBuilderCardIcon />,
          color: '#69D222',
          link: routes.settingsIntegrations(),
        },
      },
      {
        value: AdditionalModuleCategory.DOCUMENTS,
        label: t('documents'),
        extra: {
          icon: <DocumentsBuilderCardIcon />,
          color: '#69D222',
          link: routes.settingsDocumentCreationFields(),
        },
      },
      {
        value: AdditionalModuleCategory.SITE_FORMS,
        label: t('forms'),
        extra: {
          icon: <FormsBuilderCardIcon />,
          color: '#69D222',
        },
      },
      {
        value: AdditionalModuleCategory.HEADLESS_SITE_FORMS,
        label: t('headless_forms'),
        extra: {
          icon: <FormsBuilderCardIcon />,
          color: '#69D222',
        },
      },
      {
        value: AdditionalModuleCategory.ONLINE_BOOKING,
        label: t('online_booking'),
        extra: {
          icon: <FormsBuilderCardIcon />,
          color: '#69D222',
        },
      },
      {
        value: AdditionalModuleCategory.WEBSITE_CHAT,
        label: t('website_chat'),
        extra: {
          icon: <WebsiteChatBuilderCardIcon />,
          color: '#69D222',
          comingSoon: true,
        },
      },
    ];

    if (envUtil.builderHideFormBuilder)
      options = options.filter(o => o.value !== AdditionalModuleCategory.SITE_FORMS);

    return options;
  }, [t]);
};

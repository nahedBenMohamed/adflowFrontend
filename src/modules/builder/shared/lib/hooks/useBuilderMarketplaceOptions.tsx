import { routes } from '@/app';
import {
  AlbatoBuilderCardIcon,
  ApixDriveBuilderCardIcon,
  AutomatisationBuilderCardIcon,
  envUtil,
  FacebookBuilderCardIcon,
  MakeBuilderCardIcon,
  OneCBuilderCardIcon,
  SalesforceBuilderCardIcon,
  TelephonyBuilderCardIcon,
  TildaBuilderCardIcon,
  WhatsappBuilderCardIcon,
  WordpressBuilderCardIcon,
  type Option,
} from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { WazzupIcon } from '../../assets';
import { BuilderMarketplaceCategory, type ModuleOptionExtra } from '../models';

export const useBuilderMarketplaceOptions = (): Option<
  BuilderMarketplaceCategory,
  ModuleOptionExtra
>[] => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page.module_names',
  });

  return useMemo(() => {
    let options: Option<BuilderMarketplaceCategory, ModuleOptionExtra>[] = [];

    if (envUtil.voximplantShowTelephony && !envUtil.builderHideTelephony)
      options.unshift({
        value: BuilderMarketplaceCategory.TELEPHONY,
        label: t(BuilderMarketplaceCategory.TELEPHONY),
        extra: {
          icon: <TelephonyBuilderCardIcon />,
          color: '#69D222',
          link: routes.settingsCallsAccount(),
        },
      });

    if (!envUtil.builderHideBpmn)
      options.push({
        value: BuilderMarketplaceCategory.AUTOMATISATION,
        label: t(BuilderMarketplaceCategory.AUTOMATISATION),
        extra: {
          icon: <AutomatisationBuilderCardIcon />,
          color: '#FBD437',
          tag: envUtil.appRUSegment ? t('bpmn.ru_price_tag') : t('bpmn.us_price_tag'),
        },
      });

    // INTEGRATIONS
    if (envUtil.integrationsShowMake)
      options.push({
        value: BuilderMarketplaceCategory.MAKE,
        label: t(BuilderMarketplaceCategory.MAKE),
        extra: {
          icon: <MakeBuilderCardIcon />,
          color: '#7715f0',
          link: routes.settingsIntegrationsMakeInfo(),
        },
      });

    if (envUtil.integrationsShowApixDrive)
      options.push({
        value: BuilderMarketplaceCategory.APIX_DRIVE,
        label: t(BuilderMarketplaceCategory.APIX_DRIVE),
        extra: {
          icon: <ApixDriveBuilderCardIcon />,
          color: '#5e3295',
          link: routes.settingsIntegrationsApixDriveInfo(),
        },
      });

    if (envUtil.integrationsShowAlbato)
      options.push({
        value: BuilderMarketplaceCategory.ALBATO,
        label: t(BuilderMarketplaceCategory.ALBATO),
        extra: {
          icon: <AlbatoBuilderCardIcon />,
          color: '#ec653e',
          link: routes.settingsIntegrationsAlbatoInfo(),
        },
      });

    if (envUtil.integrationsShowTwilio)
      options.push({
        value: BuilderMarketplaceCategory.TWILIO,
        label: t(BuilderMarketplaceCategory.TWILIO),
        extra: {
          icon: <WhatsappBuilderCardIcon />,
          color: '#00e676',
          link: routes.settingsIntegrationsTwilioInfo(),
        },
      });

    if (envUtil.integrationsShowFbMessenger)
      options.push({
        value: BuilderMarketplaceCategory.FB_MESSENGER,
        label: t(BuilderMarketplaceCategory.FB_MESSENGER),
        extra: {
          icon: <FacebookBuilderCardIcon />,
          color: '#0695ff',
          link: routes.settingsIntegrationsFbMessengerInfo(),
        },
      });

    options.push(
      ...[
        {
          value: BuilderMarketplaceCategory.WAZZUP,
          label: t(BuilderMarketplaceCategory.WAZZUP),
          extra: {
            icon: <WazzupIcon />,
            color: '#4CAF50',
            link: routes.settingsIntegrationsWazzupInfo(),
          },
        },
        {
          value: BuilderMarketplaceCategory.TILDA,
          label: t(BuilderMarketplaceCategory.TILDA),
          extra: {
            icon: <TildaBuilderCardIcon />,
            color: '#000000',
            link: routes.settingsIntegrationsTildaInfo(),
          },
        },
        {
          value: BuilderMarketplaceCategory.WORDPRESS,
          label: t(BuilderMarketplaceCategory.WORDPRESS),
          extra: {
            icon: <WordpressBuilderCardIcon />,
            color: '#00749c',
            link: routes.settingsIntegrationsWordpressInfo(),
          },
        },
      ]
    );

    if (envUtil.integrationsShowSalesforce)
      options.push({
        value: BuilderMarketplaceCategory.SALESFORCE,
        label: t(BuilderMarketplaceCategory.SALESFORCE),
        extra: {
          icon: <SalesforceBuilderCardIcon />,
          color: '#00a1e0',
          link: routes.settingsIntegrationsSalesforceInfo(),
        },
      });

    if (envUtil.integrationsShow1C)
      options.push({
        value: BuilderMarketplaceCategory.ONE_C,
        label: t(BuilderMarketplaceCategory.ONE_C),
        extra: {
          icon: <OneCBuilderCardIcon />,
          color: '#ffdd00',
          link: routes.settingsIntegrationsOneCInfo(),
        },
      });

    return options;
  }, [t]);
};

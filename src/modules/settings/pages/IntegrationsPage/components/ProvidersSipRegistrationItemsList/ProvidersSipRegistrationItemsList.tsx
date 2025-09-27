import { routes } from '@/app';
import { PbxProviderType, useGetVoximplantSIPRegistrations } from '@/modules/telephony';
import { envUtil, type Optional } from '@/shared';
import { memo, useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BeelineIcon,
  MangoOfficeIcon,
  MegafonIcon,
  MgtsIcon,
  MtsIcon,
  RostelecomIcon,
  Tele2Icon,
  UisIcon,
  UnknownIcon,
  ZadarmaIcon,
} from '../../../../shared';
import { ProviderSipRegistrationItem } from './ProviderSipRegistrationItem';

interface IntegrationItemBlock {
  Icon: ReactNode;
  installTo: string;
  description: string;
  providerType: PbxProviderType;
  count?: number;
  manageTo?: string;
}

const ProvidersSipRegistrationItemsList = memo(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.providers_sip_registration_items_list',
  });

  const { data: sipRegistrations } = useGetVoximplantSIPRegistrations({});

  const integrationsCountMap = useMemo<Map<PbxProviderType, number>>(() => {
    const map = new Map<PbxProviderType, number>();

    if (!sipRegistrations) return map;

    sipRegistrations.forEach(s => {
      const count = map.get(s.type) || 0;

      map.set(s.type, count + 1);
    });

    return map;
  }, [sipRegistrations]);

  const getManageToLink = useCallback(
    (providerType: PbxProviderType): Optional<string> =>
      (integrationsCountMap.get(providerType) || 0) >= 1
        ? routes.settingsCallsSipRegistrations({})
        : undefined,
    [integrationsCountMap]
  );

  const integrationsBlocks = useMemo<IntegrationItemBlock[]>(
    () => [
      {
        Icon: <UnknownIcon />,
        description: t('another_pbx'),
        installTo: routes.settingsCallsSipRegistrations({
          add: true,
          pbxProviderType: PbxProviderType.UNKNOWN,
        }),
        count: integrationsCountMap.get(PbxProviderType.UNKNOWN),
        manageTo: getManageToLink(PbxProviderType.UNKNOWN),
        providerType: PbxProviderType.UNKNOWN,
      },
      {
        Icon: <UisIcon />,
        description: t('uis'),
        installTo: routes.settingsCallsSipRegistrations({
          add: true,
          pbxProviderType: PbxProviderType.UIS,
        }),
        count: integrationsCountMap.get(PbxProviderType.UIS),
        manageTo: getManageToLink(PbxProviderType.UIS),
        providerType: PbxProviderType.UIS,
      },
      {
        Icon: <ZadarmaIcon />,
        description: t('zadarma'),
        installTo: routes.settingsCallsSipRegistrations({
          add: true,
          pbxProviderType: PbxProviderType.ZADARMA,
        }),
        count: integrationsCountMap.get(PbxProviderType.ZADARMA),
        manageTo: getManageToLink(PbxProviderType.ZADARMA),
        providerType: PbxProviderType.ZADARMA,
      },
      ...(envUtil.integrationsShowRuPbxProviders
        ? [
            {
              Icon: <MangoOfficeIcon />,
              description: t('mango_office'),
              installTo: routes.settingsCallsSipRegistrations({
                add: true,
                pbxProviderType: PbxProviderType.MANGO_OFFICE,
              }),
              count: integrationsCountMap.get(PbxProviderType.MANGO_OFFICE),
              manageTo: getManageToLink(PbxProviderType.MANGO_OFFICE),
              providerType: PbxProviderType.MANGO_OFFICE,
            },
            {
              Icon: <BeelineIcon />,
              description: t('beeline'),
              installTo: routes.settingsCallsSipRegistrations({
                add: true,
                pbxProviderType: PbxProviderType.BEELINE,
              }),
              count: integrationsCountMap.get(PbxProviderType.BEELINE),
              manageTo: getManageToLink(PbxProviderType.BEELINE),
              providerType: PbxProviderType.BEELINE,
            },
            {
              Icon: <MtsIcon />,
              description: t('mts'),
              installTo: routes.settingsCallsSipRegistrations({
                add: true,
                pbxProviderType: PbxProviderType.MTS,
              }),
              count: integrationsCountMap.get(PbxProviderType.MTS),
              manageTo: getManageToLink(PbxProviderType.MTS),
              providerType: PbxProviderType.MTS,
            },
            {
              Icon: <MgtsIcon />,
              description: t('mgts'),
              installTo: routes.settingsCallsSipRegistrations({
                add: true,
                pbxProviderType: PbxProviderType.MGTS,
              }),
              count: integrationsCountMap.get(PbxProviderType.MGTS),
              manageTo: getManageToLink(PbxProviderType.MGTS),
              providerType: PbxProviderType.MGTS,
            },
            {
              Icon: <Tele2Icon />,
              description: t('tele2'),
              installTo: routes.settingsCallsSipRegistrations({
                add: true,
                pbxProviderType: PbxProviderType.TELE2,
              }),
              count: integrationsCountMap.get(PbxProviderType.TELE2),
              manageTo: getManageToLink(PbxProviderType.TELE2),
              providerType: PbxProviderType.TELE2,
            },
            {
              Icon: <MegafonIcon />,
              description: t('megafon'),
              installTo: routes.settingsCallsSipRegistrations({
                add: true,
                pbxProviderType: PbxProviderType.MEGAFON,
              }),
              count: integrationsCountMap.get(PbxProviderType.MEGAFON),
              manageTo: getManageToLink(PbxProviderType.MEGAFON),
              providerType: PbxProviderType.MEGAFON,
            },
            {
              Icon: <RostelecomIcon />,
              description: t('rostelecom'),
              installTo: routes.settingsCallsSipRegistrations({
                add: true,
                pbxProviderType: PbxProviderType.ROSTELECOM,
              }),
              count: integrationsCountMap.get(PbxProviderType.ROSTELECOM),
              manageTo: getManageToLink(PbxProviderType.ROSTELECOM),
              providerType: PbxProviderType.ROSTELECOM,
            },
          ]
        : []),
    ],
    [integrationsCountMap, t, getManageToLink]
  );

  return integrationsBlocks.map(
    ({ Icon, installTo, manageTo, description, count, providerType }, idx) => (
      <ProviderSipRegistrationItem
        key={`${installTo}-${idx}`}
        Icon={Icon}
        count={count}
        manageTo={manageTo}
        installTo={installTo}
        description={description}
        providerType={providerType}
      />
    )
  );
});

ProvidersSipRegistrationItemsList.displayName = 'ProvidersSipRegistrationItemsList';
export { ProvidersSipRegistrationItemsList };

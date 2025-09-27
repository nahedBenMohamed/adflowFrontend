import { userStore } from '@/app';
import { SpanWithEllipsis, type User } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import countryCodeToFlagEmoji from 'country-code-to-flag-emoji';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  VoximplantNumbersBlockStateCell,
  VoximplantNumbersBlockUsersCell,
} from '../../../../pages';
import {
  VoximplantNumberRowsColumnsIds,
  type VoximplantNumberRow,
  type VoximplantUser,
} from '../../models';

export const useVoximplantNumbersBlockColumns = (voximplantUsers?: VoximplantUser[]) => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<VoximplantNumberRow>();

    const availableUsers: User[] = userStore.activeUsers.filter(u =>
      voximplantUsers?.some(vu => vu.userId === u.id)
    );

    return [
      columnHelper.accessor('phoneNumber', {
        id: VoximplantNumberRowsColumnsIds.PHONE_NUMBER,
        header: t('phone_number'),
        cell: info => <SpanWithEllipsis medium text={info.getValue()} />,
      }),

      columnHelper.display({
        id: VoximplantNumberRowsColumnsIds.REGION,
        header: t('region'),
        cell: info => {
          const { countryCode, regionName } = info.row.original;

          if (!countryCode || !regionName) return <i>{t('unknown')}</i>;

          return (
            <SpanWithEllipsis
              text={`${countryCodeToFlagEmoji(countryCode.toUpperCase())} ${countryCode}${regionName ? ' – ' : ''}${regionName ?? ''}`}
            />
          );
        },
      }),

      columnHelper.accessor('userIds', {
        header: t('users'),
        size: 240,
        cell: info => {
          const userIds = info.getValue();
          const { id: numberId } = info.row.original;

          return (
            <VoximplantNumbersBlockUsersCell
              userIds={userIds}
              numberId={numberId}
              availableUsers={availableUsers}
            />
          );
        },
      }),

      columnHelper.display({
        id: VoximplantNumberRowsColumnsIds.STATE,
        header: t('state'),
        cell: info => <VoximplantNumbersBlockStateCell cellContext={info} />,
      }),
    ];
  }, [voximplantUsers, t]);
};

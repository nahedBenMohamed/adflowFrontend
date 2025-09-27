import { useDeleteUserAccessToken } from '@/modules/settings';
import { DeleteButton, SpanWithEllipsis } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserToken } from '../../models';

export const useUserTokenTableColumns = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.account_api_access_page.api_tokens_list.table',
  });

  const { mutateAsync, isPending } = useDeleteUserAccessToken();

  return useMemo(() => {
    const columnHelper = createColumnHelper<UserToken>();

    return [
      columnHelper.accessor('name', {
        id: 'name',
        header: t('name'),
        cell: info => <SpanWithEllipsis medium text={info.getValue()} />,
      }),

      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: t('created_at'),
        cell: info => <SpanWithEllipsis medium text={info.getValue().displayLong()} />,
      }),

      columnHelper.accessor('expiresAt', {
        id: 'expiresAt',
        header: t('expires_at'),
        cell: info => {
          const value = info.getValue();

          if (!value) {
            return t('never');
          } else {
            return <SpanWithEllipsis medium text={value.displayLong()} />;
          }
        },
      }),

      columnHelper.accessor('lastUsedAt', {
        id: 'lastUsedAt',
        header: t('last_used_at'),
        cell: info => {
          const value = info.getValue();

          if (!value) {
            return t('never');
          } else {
            return <SpanWithEllipsis medium text={value.displayLong()} />;
          }
        },
      }),

      columnHelper.display({
        id: 'delete',
        header: t('actions'),
        cell: info => (
          <DeleteButton
            text={t('delete')}
            onClick={() => mutateAsync(info.row.original.id)}
            deleting={isPending}
          />
        ),
      }),
    ];
  }, [isPending, mutateAsync, t]);
};

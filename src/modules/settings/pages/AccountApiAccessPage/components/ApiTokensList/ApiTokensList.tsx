import {
  useGetUserAccessTokens,
  type UserToken,
  useUserTokenTableColumns,
} from '@/modules/settings';
import { BaseTable, EmptyTableBlock, TableSkeleton } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import styled, { type CSSProperties } from 'styled-components';
import { CreateUserTokenBlock } from '../CreateUserTokenBlock/CreateUserTokenBlock';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-bottom: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-priory-text);
`;

const Annotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const ApiTokensList = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.account_api_access_page.api_tokens_list',
  });

  const { data, isLoading } = useGetUserAccessTokens();

  const columns = useUserTokenTableColumns();

  const table = useReactTable<UserToken>({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Root>
      <Wrapper>
        <Title>{t('title')}</Title>

        <Annotation>{t('annotation')}</Annotation>
      </Wrapper>

      <Wrapper>
        <CreateUserTokenBlock />

        {isLoading ? (
          <TableSkeleton
            small
            rows={2}
            headRowProps={{
              $backgroundColor: 'var(--graphite-graphite-20)',
            }}
          />
        ) : data?.length === 0 ? (
          <EmptyTableBlock $height="140px">{t('empty_user_tokens')}</EmptyTableBlock>
        ) : (
          <BaseTable
            table={table}
            headProps={{
              headRowProps: {
                $backgroundColor: 'var(--graphite-graphite-20)',
              },
              getCellStyleFn: (): CSSProperties => {
                return { width: '100%' };
              },
            }}
            bodyProps={{
              bodyRowProps: {
                $filled: true,
              },
              getCellStyleFn: (): CSSProperties => {
                return { width: '100%' };
              },
            }}
          />
        )}
      </Wrapper>
    </Root>
  );
};

export { ApiTokensList };

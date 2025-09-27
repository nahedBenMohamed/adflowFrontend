import { FormItem, FormItemLabel, MyDrawer, MyDrawerHeaderTitle } from '@/shared';
import { ColumnsVisibilitySettingsGrid } from '@/shared/lib/components/ColumnsVisibilitySettingsGrid/ColumnsVisibilitySettingsGrid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  overflow-x: hidden;
  padding: 16px;
`;

interface Props<T> {
  opened: boolean;
  table: Table<T>;
  hideIds?: string[];
  hide: () => void;
}

const ProductsTableSettingsDrawer = <T extends unknown>(props: Props<T>) => {
  const { opened, table, hideIds, hide } = props;

  const { t } = useTranslation('module.products', { keyPrefix: 'products.pages.products_page' });

  return (
    <MyDrawer
      opened={opened}
      Header={<MyDrawerHeaderTitle>{t('table_settings')}</MyDrawerHeaderTitle>}
      hide={hide}
      ensurePageSubheader
    >
      <Content>
        <FormItem gap="8px">
          <FormItemLabel $color="var(--button-text-graphite-primary-text)">
            {t('display_columns')}
          </FormItemLabel>

          <ColumnsVisibilitySettingsGrid table={table} hideIds={hideIds} />
        </FormItem>
      </Content>
    </MyDrawer>
  );
};

export { ProductsTableSettingsDrawer };

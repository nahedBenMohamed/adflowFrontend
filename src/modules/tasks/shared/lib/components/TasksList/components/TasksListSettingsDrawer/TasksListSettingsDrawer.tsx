import {
  ColumnsVisibilitySettingsGrid,
  FormItem,
  FormItemLabel,
  MyDrawer,
  MyDrawerHeaderTitle,
} from '@/shared';
import { type Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TasksColumnsIds, type TaskRow } from '../../../../models';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  overflow-x: hidden;
  padding: 16px 16px 8px;
`;

interface Props {
  opened: boolean;
  table: Table<TaskRow>;
  hide: () => void;
}

const HIDE_COLUMNS = [TasksColumnsIds.CHECKBOX, TasksColumnsIds.DELETE];

const TasksListSettingsDrawer = (props: Props) => {
  const { opened, table, hide } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_list_settings_drawer',
  });

  return (
    <MyDrawer
      paddingBottom
      opened={opened}
      ensurePageSubheader
      Header={<MyDrawerHeaderTitle>{t('table_settings')}</MyDrawerHeaderTitle>}
      hide={hide}
    >
      <Content>
        <FormItem gap="8px">
          <FormItemLabel $color="var(--button-text-graphite-primary-text)">
            {t('display_columns')}
          </FormItemLabel>

          <ColumnsVisibilitySettingsGrid table={table} hideIds={HIDE_COLUMNS} />
        </FormItem>
      </Content>
    </MyDrawer>
  );
};

export { TasksListSettingsDrawer };

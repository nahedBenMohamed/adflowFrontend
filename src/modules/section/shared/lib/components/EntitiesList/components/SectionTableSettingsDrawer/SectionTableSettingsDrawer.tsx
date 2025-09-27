import { authStore } from '@/modules/auth';
import {
  ApplyToAllButton,
  ColumnsVisibilitySettingsGrid,
  FormItem,
  FormItemLabel,
  MyDrawer,
  MyDrawerHeaderTitle,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { Table } from '@tanstack/react-table';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SectionTableColumnsIds, type SectionTableRow } from '../../../../models';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  overflow-x: hidden;
  padding: 16px 16px 8px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
`;

const GAP = '8px';
const LABEL_COLOR = 'var(--button-text-graphite-primary-text)';

interface Props {
  opened: boolean;
  table: Table<SectionTableRow>;
  areSettingsUpdating: boolean;
  updateSettings: () => Promise<void>;
  hide: () => void;
}

const HIDE_COLUMNS = [SectionTableColumnsIds.CHECKBOX];

const SectionTableSettingsDrawer = (props: Props) => {
  const { opened, table, areSettingsUpdating, updateSettings, hide } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.section_table_settings_sidebar',
  });

  const [isApplyWarningOpened, { close: hideApplyWarning, open: showApplyWarning }] =
    useDisclosure(false);

  const handleApprove = useCallback(async (): Promise<void> => {
    try {
      await updateSettings();
    } catch (e) {
      throw new Error(`Failed to update section table settings: ${e}`);
    } finally {
      hideApplyWarning();
    }
  }, [updateSettings, hideApplyWarning]);

  return (
    <MyDrawer
      paddingBottom
      opened={opened}
      ensurePageSubheader
      Header={<MyDrawerHeaderTitle>{t('table_settings')}</MyDrawerHeaderTitle>}
      Controls={
        authStore.isAdmin() && (
          <Controls>
            <ApplyToAllButton
              isApproveLoading={areSettingsUpdating}
              isApplyWarningOpened={isApplyWarningOpened}
              onClick={showApplyWarning}
              onApprove={handleApprove}
              onClose={hideApplyWarning}
            />
          </Controls>
        )
      }
      hide={hide}
    >
      <Content>
        <FormItem gap={GAP}>
          <FormItemLabel $color={LABEL_COLOR}>{t('display_columns')}</FormItemLabel>

          <ColumnsVisibilitySettingsGrid table={table} hideIds={HIDE_COLUMNS} />
        </FormItem>
      </Content>
    </MyDrawer>
  );
};

export { SectionTableSettingsDrawer };

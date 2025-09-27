import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  DropdownListItem,
  DropdownScrollbarMixin,
  ListItemLink,
  MyDropdown,
  SubheaderButton,
  SubheaderSettingsIcon,
  TableSettingsIcon,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SettingsIcon } from '../../../../shared';

const List = styled.div`
  max-height: 320px;

  display: flex;
  flex-direction: column;

  ${DropdownScrollbarMixin}
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export interface SchedulerStatsSettingsProps {
  opened: boolean;
  toggle: () => void;
}

interface Props {
  scheduleId: number;
  statsSettingsProps?: SchedulerStatsSettingsProps;
  showReportsSettingsDrawer?: () => void;
}

const SchedulerSettingsButton = observer((props: Props) => {
  const { scheduleId, statsSettingsProps, showReportsSettingsDrawer } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  const isAdmin = authStore.isAdmin();

  const [opened, { close, open }] = useDisclosure(false);

  const handleShowReportsSettingsDrawer = useCallback(() => {
    showReportsSettingsDrawer?.();
    close();
  }, [close, showReportsSettingsDrawer]);

  const handleShowStatsSettingsDrawer = useCallback(() => {
    statsSettingsProps?.toggle();
    close();
  }, [close, statsSettingsProps]);

  return isAdmin || showReportsSettingsDrawer ? (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-end"
      Button={
        <SubheaderButton
          iconChangeState
          active={opened}
          text={t('settings')}
          Icon={<SubheaderSettingsIcon />}
        />
      }
      show={open}
      hide={close}
    >
      <List>
        {isAdmin && (
          <ListItemLink $justify="flex-start" to={routes.builderUpdateScheduler(scheduleId)}>
            <IconWrapper>
              <SettingsIcon />
            </IconWrapper>

            {t('module_settings')}
          </ListItemLink>
        )}

        {statsSettingsProps && (
          <DropdownListItem $justify="flex-start" onClick={handleShowStatsSettingsDrawer}>
            <TableSettingsIcon />

            {t('stats_settings')}
          </DropdownListItem>
        )}

        {showReportsSettingsDrawer && (
          <DropdownListItem $justify="flex-start" onClick={handleShowReportsSettingsDrawer}>
            <IconWrapper>
              <TableSettingsIcon />
            </IconWrapper>

            {t('report_settings')}
          </DropdownListItem>
        )}

        <ListItemLink $justify="flex-start" to={routes.settingsIntegrationsGoogleCalendarManage()}>
          <IconWrapper>
            <TableSettingsIcon />
          </IconWrapper>

          {t('sync')}
        </ListItemLink>
      </List>
    </MyDropdown>
  ) : null;
});

SchedulerSettingsButton.displayName = 'SchedulerSettingsButton';
export { SchedulerSettingsButton };

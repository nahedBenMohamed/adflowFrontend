import { routes } from '@/app';
import {
  DropdownListItem,
  GearIcon,
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

const List = styled.ul`
  display: flex;
  flex-direction: column;

  padding: 6px 0;
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export interface TasksTableSettingsDrawerProps {
  drawerOpened: boolean;
  toggleDrawer: () => void;
}

interface Props {
  boardId: number;
  entityId?: number;
  entityTypeId?: number;
  currentPageEncodedUrl?: string;
  tableSettingsDrawerProps?: TasksTableSettingsDrawerProps;
}

const TasksSettingsButton = observer((props: Props) => {
  const { boardId, entityId, entityTypeId, currentPageEncodedUrl, tableSettingsDrawerProps } =
    props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_page_header.settings_button',
  });

  const [opened, { open: showSettings, close: closeSettings }] = useDisclosure(false);

  const handleToggleSettingsDrawer = useCallback(() => {
    if (tableSettingsDrawerProps) tableSettingsDrawerProps.toggleDrawer();

    closeSettings();
  }, [tableSettingsDrawerProps, closeSettings]);

  return (
    <>
      <MyDropdown
        withinPortal
        position="bottom-end"
        opened={opened}
        Button={
          <SubheaderButton
            active={opened}
            iconChangeState
            text={t('settings')}
            Icon={<SubheaderSettingsIcon />}
          />
        }
        hide={closeSettings}
        show={showSettings}
      >
        <List>
          <ListItemLink
            $justify="flex-start"
            // entityId and entityTypeId should be provided if this is a project board,
            // so that after deletion we can navigate back to project overview
            to={routes.taskBoardSettings({
              boardId,
              entityId,
              entityTypeId,
              from: currentPageEncodedUrl,
            })}
          >
            <IconWrapper>
              <GearIcon />
            </IconWrapper>

            {t('board_settings')}
          </ListItemLink>

          {tableSettingsDrawerProps && (
            <DropdownListItem $justify="flex-start" onClick={handleToggleSettingsDrawer}>
              <IconWrapper>
                <TableSettingsIcon />
              </IconWrapper>

              {t('table_settings')}
            </DropdownListItem>
          )}

          <ListItemLink
            $justify="flex-start"
            to={routes.settingsIntegrationsGoogleCalendarManage()}
          >
            <IconWrapper>
              <TableSettingsIcon />
            </IconWrapper>

            {t('sync')}
          </ListItemLink>
        </List>
      </MyDropdown>
    </>
  );
});

TasksSettingsButton.displayName = 'TasksSettingsButton';
export { TasksSettingsButton };

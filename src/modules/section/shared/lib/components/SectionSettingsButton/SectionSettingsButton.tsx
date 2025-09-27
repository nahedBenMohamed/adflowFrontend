import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { RequestSetupFormModal } from '@/modules/settings/shared/lib/components/RequestSetupForm/components';
import {
  DropdownListItem,
  envUtil,
  ListItemLink,
  MyDropdown,
  SubheaderButton,
  SubheaderSettingsIcon,
  TableSettingsIcon,
  type EntityType,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ManageAccountsIcon } from '../../../assets';
import {
  GearIcon,
  IconWrapper,
  ImportEntitiesButton,
  ImportEntitiesModal,
  ImportInBackgroundInfoModal,
} from './components';

const List = styled.ul`
  display: flex;
  flex-direction: column;

  padding: 6px 0;
`;

export interface SectionSettingsButtonTableSettingsProps {
  opened: boolean;
  toggle: () => void;
}

interface Props {
  entityType: EntityType;
  boardId: Nullable<number>;
  currentPageEncodedUrl: string;
  hideSettings?: boolean;
  tableSettingsProps?: SectionSettingsButtonTableSettingsProps;
}

const SectionSettingsButton = observer((props: Props) => {
  const { entityType, boardId, currentPageEncodedUrl, hideSettings, tableSettingsProps } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.settings_button',
  });

  const isAdmin = authStore.isAdmin();
  const isProject = entityType.isProjectCategory();

  const [importModalOpened, { open: showImportModal, close: hideImportModal }] =
    useDisclosure(false);
  const [
    importInBackgroundInfoModalOpened,
    { open: showImportInBackgroundInfoModal, close: hideImportInBackgroundInfoModal },
  ] = useDisclosure(false);
  const [
    requestSetupFormModalOpened,
    { open: showRequestSetupFormModal, close: hideRequestSetupFormModal },
  ] = useDisclosure(false);

  const [opened, { open: showSettings, close: closeSettings }] = useDisclosure(false);

  const handleShowImportSettings = () => {
    closeSettings();
    showImportModal();
  };

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
          <ImportEntitiesButton onClick={handleShowImportSettings} />

          {boardId && !hideSettings && (
            <ListItemLink
              $justify="flex-start"
              to={routes.entityTypeBoardSettings({
                boardId,
                from: currentPageEncodedUrl,
                entityTypeId: entityType.id,
              })}
            >
              <GearIcon />

              {t('board_settings')}
            </ListItemLink>
          )}

          {isAdmin && (
            <ListItemLink $justify="flex-start" to={routes.builderUpdateEt(entityType.id)}>
              <GearIcon />

              {t('module_settings')}
            </ListItemLink>
          )}

          {tableSettingsProps && (
            <DropdownListItem
              $justify="flex-start"
              onClick={() => {
                tableSettingsProps.toggle();
                closeSettings();
              }}
            >
              <TableSettingsIcon />

              {t('table_settings')}
            </DropdownListItem>
          )}

          {isAdmin && !isProject && (
            <ListItemLink $justify="flex-start" to={routes.goalSettings(entityType.id)}>
              <IconWrapper>
                <ManageAccountsIcon />
              </IconWrapper>

              {t('sales_pipeline_settings')}
            </ListItemLink>
          )}

          {isAdmin && (
            <DropdownListItem
              $justify="flex-start"
              onClick={() => {
                showRequestSetupFormModal();
                closeSettings();
              }}
            >
              <TableSettingsIcon />

              {t('request_setup', { company: envUtil.appName })}
            </DropdownListItem>
          )}
        </List>
      </MyDropdown>

      {importModalOpened && (
        <ImportEntitiesModal
          entityTypeId={entityType.id}
          entityTypeName={entityType.name}
          opened={importModalOpened}
          onClose={hideImportModal}
          showInfoModal={showImportInBackgroundInfoModal}
        />
      )}

      {importInBackgroundInfoModalOpened && (
        <ImportInBackgroundInfoModal
          opened={importInBackgroundInfoModalOpened}
          onClose={hideImportInBackgroundInfoModal}
        />
      )}

      {requestSetupFormModalOpened && (
        <RequestSetupFormModal
          isOpened={requestSetupFormModalOpened}
          titleKey="request_setup"
          onClose={hideRequestSetupFormModal}
        />
      )}
    </>
  );
});

SectionSettingsButton.displayName = 'SectionSettingsButton';
export { SectionSettingsButton };

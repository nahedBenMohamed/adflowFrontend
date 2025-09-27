import { CreateButton } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateAutomationProcessModal } from '../CreateAutomationProcessModal/CreateAutomationProcessModal';

interface Props {
  entityTypeId: number;
}

const CreateAutomationButton = memo((props: Props) => {
  const { entityTypeId } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.bpmn_automations_settings_header',
  });

  const [
    isCreateProcessModalOpened,
    { close: hideCreateProcessModal, open: showCreateProcessModal },
  ] = useDisclosure(false);

  return (
    <>
      <CreateButton
        titleType="add"
        tooltip={t('create_bpmn_automation')}
        onClick={showCreateProcessModal}
      />

      {isCreateProcessModalOpened && (
        <CreateAutomationProcessModal
          entityTypeId={entityTypeId}
          isOpened={isCreateProcessModalOpened}
          onClose={hideCreateProcessModal}
        />
      )}
    </>
  );
});

CreateAutomationButton.displayName = 'CreateAutomationButton';
export { CreateAutomationButton };

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { OutgoingUnknownFormData } from '../../../../../../store';
import { EntityScenarioRadioGroup } from '../../../EntityScenarioRadioGroup/EntityScenarioGroup';

interface Props {
  outgoingUnknownFormData: OutgoingUnknownFormData;
  clearOutgoingUnknownFormData: () => void;
}

const OutgoingUnknownScenarioBlock = observer((props: Props) => {
  const {
    outgoingUnknownFormData: { autoCreate, contactId, dealId, boardId },
    clearOutgoingUnknownFormData,
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.outgoing_unknown_scenario_block',
  });

  return (
    <EntityScenarioRadioGroup
      dealId={dealId}
      boardId={boardId}
      contactId={contactId}
      autoCreate={autoCreate}
      groupTitle={t('call_to_unknown_number')}
      autoCreateDisabledTitle={t('creates_manually')}
      clearFormData={clearOutgoingUnknownFormData}
    />
  );
});

OutgoingUnknownScenarioBlock.displayName = 'OutgoingUnknownScenarioBlock';
export { OutgoingUnknownScenarioBlock };

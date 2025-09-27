import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { IncomingUnknownFormData } from '../../../../../../store';
import { EntityScenarioRadioGroup } from '../../../EntityScenarioRadioGroup/EntityScenarioGroup';

interface Props {
  incomingUnknownFormData: IncomingUnknownFormData;
  clearIncomingUnknownFormData: () => void;
}

const IncomingUnknownScenarioBlock = observer((props: Props) => {
  const {
    incomingUnknownFormData: { autoCreate, contactId, dealId, boardId },
    clearIncomingUnknownFormData,
  } = props;

  const { t } = useTranslation('module.telephony');

  return (
    <EntityScenarioRadioGroup
      dealId={dealId}
      boardId={boardId}
      contactId={contactId}
      autoCreate={autoCreate}
      autoCreateDisabledTitle={t(
        'telephony.pages.calls_configuring_scenarios_page.creates_manually'
      )}
      autoCreateDisabledHint={t(
        'telephony.pages.calls_configuring_scenarios_page.creates_manually_hint'
      )}
      groupTitle={t(
        'telephony.pages.calls_configuring_scenarios_page.components.incoming_unknown_scenario_block.call_from_unknown_number'
      )}
      clearFormData={clearIncomingUnknownFormData}
    />
  );
});

IncomingUnknownScenarioBlock.displayName = 'IncomingUnknownScenarioBlock';
export { IncomingUnknownScenarioBlock };

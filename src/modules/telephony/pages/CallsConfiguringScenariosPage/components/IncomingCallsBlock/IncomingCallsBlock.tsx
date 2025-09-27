import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { VoximplantScenariosStore } from '../../../../store';
import { CallTypeBlock } from '../CallTypeBlock/CallTypeBlock';
import {
  IncomingKnownMissingScenarioBlock,
  IncomingUnknownMissingScenarioBlock,
  IncomingUnknownScenarioBlock,
} from './components';

interface Props {
  voximplantScenariosStore: VoximplantScenariosStore;
}

const IncomingCallsBlock = observer((props: Props) => {
  const {
    voximplantScenariosStore: {
      incomingCallsFormDatas: {
        incomingUnknownFormData,
        incomingUnknownMissingFormData,
        incomingKnownMissingFormData,
        createEmptyIncomingUnknownFormData,
        createEmptyIncomingUnknownMissingFormData,
      },
    },
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_configuring_scenarios_page.components.incoming_calls_block',
  });

  return (
    <CallTypeBlock title={t('incoming_calls')}>
      <IncomingUnknownScenarioBlock
        incomingUnknownFormData={incomingUnknownFormData}
        clearIncomingUnknownFormData={createEmptyIncomingUnknownFormData}
      />

      <IncomingUnknownMissingScenarioBlock
        incomingUnknownMissingFormData={incomingUnknownMissingFormData}
        clearIncomingUnknownMissingFormData={createEmptyIncomingUnknownMissingFormData}
      />

      <IncomingKnownMissingScenarioBlock
        incomingKnownMissingFormData={incomingKnownMissingFormData}
      />
    </CallTypeBlock>
  );
});

IncomingCallsBlock.displayName = 'IncomingCallsBlock';
export { IncomingCallsBlock };

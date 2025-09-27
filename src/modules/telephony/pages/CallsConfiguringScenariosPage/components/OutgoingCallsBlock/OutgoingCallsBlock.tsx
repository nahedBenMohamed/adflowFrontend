import type { VoximplantScenariosStore } from '@/modules/telephony';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CallTypeBlock } from '../CallTypeBlock/CallTypeBlock';
import { OutgoingUnansweredScenarioBlock, OutgoingUnknownScenarioBlock } from './components';

interface Props {
  voximplantScenariosStore: VoximplantScenariosStore;
}

const OutgoingCallsBlock = observer((props: Props) => {
  const {
    voximplantScenariosStore: {
      outgoingCallsFormDatas: {
        outgoingUnknownFormData,
        outgoingUnansweredFormData,
        createEmptyUnknownFormData,
        createEmptyUnansweredFormData,
      },
    },
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_configuring_scenarios_page.components.outgoing_calls_block',
  });

  return (
    <CallTypeBlock title={t('outgoing_calls')}>
      <OutgoingUnknownScenarioBlock
        outgoingUnknownFormData={outgoingUnknownFormData}
        clearOutgoingUnknownFormData={createEmptyUnknownFormData}
      />

      <OutgoingUnansweredScenarioBlock
        outgoingUnansweredFormData={outgoingUnansweredFormData}
        clearOutgoingUnansweredFormData={() => createEmptyUnansweredFormData(t('failed_to_reach'))}
      />
    </CallTypeBlock>
  );
});

OutgoingCallsBlock.displayName = 'OutgoingCallsBlock';
export { OutgoingCallsBlock };

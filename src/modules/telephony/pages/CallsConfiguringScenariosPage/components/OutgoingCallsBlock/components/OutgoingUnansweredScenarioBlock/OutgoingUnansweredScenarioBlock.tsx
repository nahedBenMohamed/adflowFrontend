import { MyCheckbox, MyInput, TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { OutgoingUnansweredFormData } from '../../../../../../store';
import { CallTypeGroup } from '../../../CallTypeGroup/CallTypeGroup';

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  outgoingUnansweredFormData: OutgoingUnansweredFormData;
  clearOutgoingUnansweredFormData: () => void;
}

const OutgoingUnansweredScenarioBlock = observer((props: Props) => {
  const {
    outgoingUnansweredFormData: { createNoteInFeed, noteText, setCreateNoteInFeed },
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.outgoing_unanswered_scenario_block',
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;

      if (!checked) {
        noteText.setValue(t('failed_to_reach'));
      }

      setCreateNoteInFeed(e.target.checked);
    },
    [noteText, setCreateNoteInFeed, t]
  );

  return (
    <CallTypeGroup title={t('unanswered_outgoing_calls')}>
      <CheckboxWrapper>
        <MyCheckbox checked={createNoteInFeed} onChange={handleChange} />

        <CheckboxLabel>
          {t('create_note')}
          <span>-</span>
          <MyInput
            width="240px"
            model={noteText}
            variant="outlined"
            placeholder={t('placeholders.note_content')}
          />
        </CheckboxLabel>
      </CheckboxWrapper>
    </CallTypeGroup>
  );
});

OutgoingUnansweredScenarioBlock.displayName = 'OutgoingUnansweredScenarioBlock';
export { OutgoingUnansweredScenarioBlock };

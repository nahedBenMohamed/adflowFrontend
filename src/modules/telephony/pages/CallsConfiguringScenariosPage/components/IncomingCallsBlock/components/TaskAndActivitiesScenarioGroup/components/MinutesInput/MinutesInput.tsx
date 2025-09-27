import { MyInput, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Unit = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  model: InputModel;
  hiddenlyDisabled: boolean;
}

const MinutesInput = observer((props: Props) => {
  const { model, hiddenlyDisabled } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.task_and_activities_scenario_group',
  });

  return (
    <Root>
      <MyInput
        width="88px"
        model={model}
        placeholder="0"
        variant="outlined"
        hiddenlyDisabled={hiddenlyDisabled}
      />

      <Unit>{t('minutes')}</Unit>
    </Root>
  );
});

MinutesInput.displayName = 'MinutesInput';
export { MinutesInput };

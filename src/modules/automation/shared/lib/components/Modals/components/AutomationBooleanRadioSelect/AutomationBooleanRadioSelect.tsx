import { FormItem, type InputModel } from '@/shared';
import { AutomationRadioButton } from '../AutomationRadioButton/AutomationRadioButton';

interface Props {
  model: InputModel;
  trueLabel: string;
  falseLabel: string;
}

const AutomationBooleanRadioSelect = (props: Props) => {
  const { model, trueLabel, falseLabel } = props;

  return (
    <FormItem gap="8px">
      <AutomationRadioButton model={model} value="false" label={falseLabel} />

      <AutomationRadioButton model={model} value="true" label={trueLabel} />
    </FormItem>
  );
};

export { AutomationBooleanRadioSelect };

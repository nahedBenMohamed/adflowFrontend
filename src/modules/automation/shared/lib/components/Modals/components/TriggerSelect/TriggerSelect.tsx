import { MultiselectWithCheckboxes, type EntityTypeTrigger, type MultiselectModel } from '@/shared';
import { useGetTriggerOptions } from '../../../../hooks';

interface Props {
  model: MultiselectModel<EntityTypeTrigger>;
  isListAutomation?: boolean;
}

const TriggerSelect = (props: Props) => {
  const { model, isListAutomation } = props;

  const triggerOptions = useGetTriggerOptions(isListAutomation);

  return <MultiselectWithCheckboxes withinPortal model={model} options={triggerOptions} />;
};

export { TriggerSelect };

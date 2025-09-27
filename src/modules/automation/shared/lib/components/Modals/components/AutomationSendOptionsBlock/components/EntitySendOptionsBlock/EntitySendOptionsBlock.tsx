import { FormItem, type InputModel } from '@/shared';
import { useTranslation } from 'react-i18next';
import { ActionSendVariant } from '../../../../../../models';
import { AutomationRadioButton } from '../../../AutomationRadioButton/AutomationRadioButton';

interface Props {
  model: InputModel;
  localePrefix: string;
  localeModalPrefix: 'email' | 'external_chat';
}

const EntitySendOptionsBlock = (props: Props) => {
  const { model, localePrefix, localeModalPrefix } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: `automation.modals.send_${localeModalPrefix}_automation_modal.options`,
  });

  return (
    <>
      <FormItem gap="8px">
        <AutomationRadioButton
          model={model}
          value={ActionSendVariant.ALL_ENTITIES_ALL_VALUES}
          label={t(`${localePrefix}_all_entities_all_values`)}
        />

        <AutomationRadioButton
          model={model}
          value={ActionSendVariant.ALL_ENTITIES_FIRST_VALUE}
          label={t(`${localePrefix}_all_entities_first_value`)}
        />

        <AutomationRadioButton
          model={model}
          value={ActionSendVariant.FIRST_ENTITY_ALL_VALUES}
          label={t(`${localePrefix}_first_entity_all_values`)}
        />

        <AutomationRadioButton
          model={model}
          value={ActionSendVariant.FIRST_ENTITY_FIRST_VALUE}
          label={t(`${localePrefix}_first_entity_first_value`)}
        />
      </FormItem>
    </>
  );
};

export { EntitySendOptionsBlock };

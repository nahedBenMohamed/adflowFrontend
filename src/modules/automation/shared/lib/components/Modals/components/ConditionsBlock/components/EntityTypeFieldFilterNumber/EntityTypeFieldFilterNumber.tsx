import { MyInput, type NumberFilterFormData } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AutomationFormItem } from '../../../AutomationFormItem/AutomationFormItem';

const InputsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Delimiter = styled.hr`
  width: 6px;

  flex-shrink: 0;

  border-top: 1px solid var(--button-text-graphite-primary-text);
`;

interface Props {
  formData: NumberFilterFormData;
}

const EntityTypeFieldFilterNumber = observer((props: Props) => {
  const { formData } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });

  return (
    <AutomationFormItem text={t('condition')}>
      <InputsWrapper>
        <MyInput
          type="number"
          variant="outlined"
          model={formData.min}
          hideNumberInputControls
          placeholder={t('entity_type_field_filter_number.placeholders.from')}
        />

        <Delimiter />

        <MyInput
          type="number"
          variant="outlined"
          model={formData.max}
          hideNumberInputControls
          placeholder={t('entity_type_field_filter_number.placeholders.to')}
        />
      </InputsWrapper>
    </AutomationFormItem>
  );
});

EntityTypeFieldFilterNumber.displayName = 'EntityTypeFieldFilterNumber';
export { EntityTypeFieldFilterNumber };

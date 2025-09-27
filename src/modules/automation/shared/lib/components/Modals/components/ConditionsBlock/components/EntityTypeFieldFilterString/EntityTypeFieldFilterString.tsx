import {
  MyInput,
  MySelect,
  StringFilterType,
  type Option,
  type StringFilterFormData,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AutomationFormItem } from '../../../AutomationFormItem/AutomationFormItem';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  formData: StringFilterFormData;
}

const EntityTypeFieldFilterString = observer((props: Props) => {
  const { formData } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });

  const typeOptions = useMemo<Option<StringFilterType>[]>(
    () => [
      { label: t('entity_type_field_filter_string.is_empty'), value: StringFilterType.EMPTY },
      {
        label: t('entity_type_field_filter_string.is_not_empty'),
        value: StringFilterType.NOT_EMPTY,
      },
      { label: t('entity_type_field_filter_string.contains'), value: StringFilterType.CONTAINS },
    ],
    [t]
  );

  const handleChangeType = useCallback(
    (type: StringFilterType) => {
      if (type !== StringFilterType.CONTAINS) formData.text.setValue('');
    },
    [formData]
  );

  return (
    <AutomationFormItem text={t('condition')}>
      <Root>
        <MySelect
          withinPortal
          variant="outlined"
          options={typeOptions}
          model={formData.type}
          handleChange={handleChangeType}
        />

        {formData.type.value === StringFilterType.CONTAINS && (
          <MyInput
            autoFocus
            variant="outlined"
            model={formData.text}
            placeholder={t('entity_type_field_filter_string.placeholders.value')}
          />
        )}
      </Root>
    </AutomationFormItem>
  );
});

export { EntityTypeFieldFilterString };

import { userStore } from '@/app';
import { PlusIconButton, UsersMultiselect, type EntityType } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { EntityTypeConditionFormData } from '../../../../models';
import { AutomationFormItem } from '../AutomationFormItem/AutomationFormItem';
import { WrapperWithLeftOffset } from '../WrapperWithLeftOffset/WrapperWithLeftOffset';
import { EntityTypeFieldsConditions } from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  entityType: EntityType;
  conditions: EntityTypeConditionFormData;
}

const ConditionsBlock = observer((props: Props) => {
  const { entityType, conditions } = props;

  const { ownerIds, fieldsFormData, createEmptyFieldFormData, deleteFieldsFormData } = conditions;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });

  return (
    <Root>
      <AutomationFormItem text={t('responsible_users')}>
        <UsersMultiselect
          withinPortal
          model={ownerIds}
          variant="outlined"
          users={userStore.activeUsers}
          placeholder={t('placeholders.select_responsible')}
        />
      </AutomationFormItem>

      <AutomationFormItem text={t('fields_conditions')}>
        <WrapperWithLeftOffset>
          <PlusIconButton
            isGreen
            text={t('add_field_condition')}
            onClick={createEmptyFieldFormData}
          />

          <EntityTypeFieldsConditions
            entityType={entityType}
            fieldsFormData={fieldsFormData}
            deleteFieldsFormData={deleteFieldsFormData}
          />
        </WrapperWithLeftOffset>
      </AutomationFormItem>
    </Root>
  );
});

ConditionsBlock.displayName = 'ConditionsBlock';
export { ConditionsBlock };

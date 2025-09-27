import { entityTypeStore } from '@/app';
import type { InputModel, Option, SelectModel } from '@/shared';
import { ChangeStageType, MyRadio, StagesSelect } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AutomationFormItem, WrapperWithLeftOffset } from '../components';

const RadioWrapper = styled.label`
  display: flex;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);
`;

const SelectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export interface ChangeStageAutomationModalContentForm {
  stageId: SelectModel;
  operationType: InputModel;
}

interface Props {
  entityTypeId: number;
  form: ChangeStageAutomationModalContentForm;
}

const ChangeStageAutomationModalContent = observer((props: Props) => {
  const { entityTypeId, form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.change_stage_automation_modal',
  });

  const entityType = entityTypeStore.getById(entityTypeId);

  const changeStageTypesOptions = useMemo<Option<ChangeStageType>[]>(
    () => [
      {
        label: t('automation_copy.move_label'),
        value: ChangeStageType.MOVE,
      },
      {
        label: t('automation_copy.copy_original_label'),
        value: ChangeStageType.COPY_ORIGINAL,
      },
      {
        label: t('automation_copy.copy_new_label'),
        value: ChangeStageType.COPY_NEW,
      },
    ],
    [t]
  );

  return (
    <AutomationFormItem gap="16px" text={t('change_stage')}>
      <WrapperWithLeftOffset>
        <SelectsWrapper>
          <AutomationFormItem gap="16px" text={t('stage')}>
            <StagesSelect
              monochrome
              withinPortal
              variant="outlined"
              model={form.stageId}
              entityTypeId={entityType.id}
            />
          </AutomationFormItem>
        </SelectsWrapper>

        <AutomationFormItem gap="16px" text={t('cards_copies')} hint={t('automation_copy.hint')}>
          {changeStageTypesOptions.map(o => (
            <RadioWrapper key={o.value}>
              <MyRadio model={form.operationType} value={o.value} />

              {o.label}
            </RadioWrapper>
          ))}
        </AutomationFormItem>
      </WrapperWithLeftOffset>
    </AutomationFormItem>
  );
});

ChangeStageAutomationModalContent.displayName = 'ChangeStageAutomationModalContent';
export { ChangeStageAutomationModalContent };

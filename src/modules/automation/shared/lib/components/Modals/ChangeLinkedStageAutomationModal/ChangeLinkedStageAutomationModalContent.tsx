import { boardApiUtil, entityTypeStore } from '@/app';
import {
  ChangeStageType,
  InputModel,
  MyRadio,
  MySelect,
  Option,
  SelectModel,
  StagesSelect,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';
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

const BoardLabel = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

export interface ChangeLinkedStageAutomationModalContentForm {
  stageId: SelectModel;
  entityTypeId: SelectModel;
  operationType: InputModel;
}

interface Props {
  entityTypeId: number;
  form: ChangeLinkedStageAutomationModalContentForm;
}

const ChangeLinkedStageAutomationModalContent = observer((props: Props) => {
  const { entityTypeId, form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.change_linked_stage_automation_modal',
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current && autoAnimate(ref.current);
  }, [ref]);

  const entityType = entityTypeStore.getById(entityTypeId);

  const { data: boards, isLoading } = boardApiUtil.useGetBoardsByEntityTypeId({
    entityTypeId: form.entityTypeId.value,
  });

  const entityTypes = useMemo(
    () =>
      entityTypeStore.entityTypesOptions.filter(et =>
        entityType.linkedEntityTypes.map(le => le.targetId).includes(et.value)
      ),
    [entityType]
  );

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
          <AutomationFormItem gap="16px" text={t('entity_type')}>
            <MySelect
              withinPortal
              variant="outlined"
              model={form.entityTypeId}
              options={entityTypes}
            />
          </AutomationFormItem>

          <div ref={ref}>
            {(boards && boards.length > 0) || isLoading ? (
              <AutomationFormItem gap="16px" text={t('stage')}>
                <StagesSelect
                  monochrome
                  withinPortal
                  variant="outlined"
                  model={form.stageId}
                  entityTypeId={form.entityTypeId.value}
                />
              </AutomationFormItem>
            ) : form.entityTypeId.value ? (
              <BoardLabel>{t('no_stages')}</BoardLabel>
            ) : null}
          </div>
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

ChangeLinkedStageAutomationModalContent.displayName = 'ChangeLinkedStageAutomationModalContent';
export { ChangeLinkedStageAutomationModalContent };

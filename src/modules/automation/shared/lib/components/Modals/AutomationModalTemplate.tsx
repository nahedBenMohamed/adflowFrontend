import { entityTypeStore } from '@/app';
import {
  DelaySelect,
  DeleteButton,
  DialogModalSecondary,
  Hint,
  MyCheckboxWithBooleanModel,
  MyInput,
  MyRadio,
  MySwitchWithModel,
  validateForm,
  type Nullable,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { AutomationStore } from '../../../../store';
import { useGetAutomationDelayOptions } from '../../hooks';
import type { AutomationEntityType, AutomationEntityTypeTemplateFormData } from '../../models';
import {
  AutomationFormItem,
  ConditionsBlock,
  DeleteAutomationModal,
  TriggerSelect,
  WrapperWithLeftOffset,
} from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 24px 32px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Delimiter = styled.div`
  height: 1px;
  width: 100%;

  background-color: var(--graphite-graphite-80);
`;

const AutomationControlBlock = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const AutomationControlTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AutomationControlTitle = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const AutomationControlSubtitle = styled.div<{ $paddingLeft?: CSSProperties['paddingLeft'] }>`
  line-height: 1;
  font-size: 10px;
  font-weight: 400;
  color: var(--button-text-graphite-secondary-text);

  padding-left: ${p => p.$paddingLeft};
`;

const DelayItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NarrowBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ControlWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);
`;

const DeleteButtonWrapper = styled.div`
  margin-right: auto;
`;

interface Props {
  title: string;
  isOpened: boolean;
  children: ReactNode;
  automationStore: AutomationStore;
  templateFormData: AutomationEntityTypeTemplateFormData;
  hint?: string;
  width?: string;
  maxHeight?: string;
  automation?: Nullable<AutomationEntityType>;
  onClose: () => void;
  onSave: (templateFormData: AutomationEntityTypeTemplateFormData) => Promise<void>;
}

const AutomationModalTemplate = observer((props: Props) => {
  const {
    title,
    isOpened,
    children,
    automationStore,
    templateFormData,
    hint,
    width = '592px',
    automation = null,
    maxHeight = '720px',
    onClose,
    onSave,
  } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.automation_modal_template',
  });

  const delayStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    delayStageRef.current && autoAnimate(delayStageRef.current);
  }, [delayStageRef]);

  const isEditMode = Boolean(automation);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpened, { close: hideDeleteModal, open: showDeleteModal }] =
    useDisclosure(false);

  const delayOptions = useGetAutomationDelayOptions();

  const handleSave = useCallback(async (): Promise<void> => {
    if (!validateForm(templateFormData)) return;

    try {
      setIsSaving(true);

      await onSave(templateFormData);
    } catch (e) {
      if (automation) {
        throw new Error(
          `Failed to save automation ${automation.id} with name ${templateFormData.name.trimmedValue}: ${e}`
        );
      } else {
        throw new Error(
          `Failed to create automation with name ${templateFormData.name.trimmedValue}: ${e}`
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [templateFormData, automation, onSave]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!automation) throw new Error('Failed to delete automation: automation does not exist');

    await automationStore.delete(automation.id);

    onClose();
    hideDeleteModal();
  }, [automation, automationStore, onClose, hideDeleteModal]);

  const entityType = entityTypeStore.getById(automationStore.entityTypeId);

  const isListAutomation = automationStore.boardId === null;

  return (
    <DialogModalSecondary
      width={width}
      loading={isSaving}
      isOpened={isOpened}
      maxHeight={maxHeight}
      approveDisabled={isSaving}
      Header={
        <HeaderWrapper>
          {title} {hint && <Hint text={hint} />}
        </HeaderWrapper>
      }
      LeftControls={
        isEditMode && (
          <DeleteButtonWrapper>
            <DeleteButton text={t('delete_automation')} onClick={showDeleteModal} />
          </DeleteButtonWrapper>
        )
      }
      onClose={onClose}
      onApprove={handleSave}
    >
      <Root>
        <AutomationFormItem text={t('automation_name')}>
          <MyInput
            variant="outlined"
            model={templateFormData.name}
            placeholder={t('placeholders.name')}
          />
        </AutomationFormItem>

        <AutomationFormItem text={t('trigger')}>
          <TriggerSelect isListAutomation={isListAutomation} model={templateFormData.triggers} />
        </AutomationFormItem>

        <AutomationFormItem text={t('conditions')}>
          <WrapperWithLeftOffset>
            <ConditionsBlock entityType={entityType} conditions={templateFormData.conditions} />
          </WrapperWithLeftOffset>
        </AutomationFormItem>

        <DelayItemsWrapper>
          <AutomationFormItem text={t('delay')}>
            <DelaySelect
              options={delayOptions}
              delay={templateFormData.delay}
              onChange={templateFormData.changeDelay}
            />
          </AutomationFormItem>

          <div ref={delayStageRef}>
            {Boolean(templateFormData.delay && templateFormData.delay > 0 && !isListAutomation) && (
              <NarrowBlock>
                <ControlWrapper>
                  <MyRadio model={templateFormData.allowAnyStage} value="false" />

                  <ControlText>{t('delay_one_stage_title')}</ControlText>

                  <Hint text={t('delay_one_stage_hint')} />
                </ControlWrapper>

                <ControlWrapper>
                  <MyRadio model={templateFormData.allowAnyStage} value="true" />

                  <ControlText>{t('delay_all_stages_title')}</ControlText>

                  <Hint text={t('delay_all_stages_hint')} />
                </ControlWrapper>
              </NarrowBlock>
            )}
          </div>
        </DelayItemsWrapper>

        {children}

        <AutomationControlBlock>
          <AutomationControlTitleWrapper>
            <AutomationControlTitle>{t('enable')}</AutomationControlTitle>
            <AutomationControlSubtitle>{t('enable_annotation')}</AutomationControlSubtitle>
          </AutomationControlTitleWrapper>

          <MySwitchWithModel model={templateFormData.isActive} label={t('on')} />
        </AutomationControlBlock>

        <Delimiter />

        <NarrowBlock>
          <ControlWrapper>
            <MyCheckboxWithBooleanModel model={templateFormData.applyImmediately} />

            <ControlText>
              {isListAutomation ? t('apply_trigger_list') : t('apply_trigger')}
            </ControlText>
          </ControlWrapper>

          <AutomationControlSubtitle $paddingLeft="24px">
            {isListAutomation ? t('apply_trigger_hint_list') : t('apply_trigger_hint')}
          </AutomationControlSubtitle>
        </NarrowBlock>
      </Root>

      {isDeleteModalOpened && (
        <DeleteAutomationModal
          isOpened={isDeleteModalOpened}
          onApprove={handleDelete}
          onClose={hideDeleteModal}
        />
      )}
    </DialogModalSecondary>
  );
});

AutomationModalTemplate.displayName = 'AutomationModalTemplate';
export { AutomationModalTemplate };

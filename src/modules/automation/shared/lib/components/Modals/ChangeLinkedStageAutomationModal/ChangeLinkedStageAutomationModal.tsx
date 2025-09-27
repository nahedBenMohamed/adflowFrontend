import {
  ChangeStageType,
  EntityTypeActionType,
  InputModel,
  SelectModel,
  UuidUtil,
  validateForm,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AutomationEntityTypeTemplateFormData,
  type ActionEntityLinkedStageChangeSettings,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  ChangeLinkedStageAutomationModalContent,
  type ChangeLinkedStageAutomationModalContentForm,
} from './ChangeLinkedStageAutomationModalContent';

const ChangeLinkedStageAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { stageId, isOpened, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.change_linked_stage_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('change_stage_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionEntityLinkedStageChangeSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionEntityLinkedStageChangeSettings>,
    [automation]
  );

  const form = useLocalObservable<ChangeLinkedStageAutomationModalContentForm>(() => ({
    stageId: SelectModel.create(settings?.stageId).required(),
    entityTypeId: SelectModel.create(settings?.entityTypeId).required(),
    operationType: InputModel.create(settings?.operationType ?? ChangeStageType.MOVE).required(),
  }));

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const changeLinkedStageActionSettings: ActionEntityLinkedStageChangeSettings = {
        stageId: form.stageId.value,
        entityTypeId: form.entityTypeId.value,
        operationType: form.operationType.value as ChangeStageType,
      };

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: changeLinkedStageActionSettings,
          type: EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE,
        },
      });

      onClose();
    },
    [automation, automationStore, form, stageId, onClose]
  );

  return (
    <AutomationModalTemplate
      maxHeight="748px"
      isOpened={isOpened}
      automation={automation}
      templateFormData={templateModel}
      automationStore={automationStore}
      title={automation ? t('title_update') : t('title_add')}
      onClose={onClose}
      onSave={handleSave}
    >
      <ChangeLinkedStageAutomationModalContent
        entityTypeId={automationStore.entityTypeId}
        form={form}
      />
    </AutomationModalTemplate>
  );
});

ChangeLinkedStageAutomationModal.displayName = 'ChangeLinkedStageAutomationModal';
export { ChangeLinkedStageAutomationModal };

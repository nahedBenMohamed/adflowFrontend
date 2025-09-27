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
  type ActionEntityStageChangeSettings,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  ChangeStageAutomationModalContent,
  type ChangeStageAutomationModalContentForm,
} from './ChangeStageAutomationModalContent';

const ChangeStageAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { stageId, isOpened, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.change_stage_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('change_stage_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionEntityStageChangeSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionEntityStageChangeSettings>,
    [automation]
  );

  const form = useLocalObservable<ChangeStageAutomationModalContentForm>(() => ({
    stageId: SelectModel.create(settings?.stageId).required(),
    operationType: InputModel.create(settings?.operationType ?? ChangeStageType.MOVE).required(),
  }));

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const changeStageActionSettings: ActionEntityStageChangeSettings = {
        stageId: form.stageId.value,
        operationType: form.operationType.value as ChangeStageType,
      };

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: changeStageActionSettings,
          type: EntityTypeActionType.ENTITY_STAGE_CHANGE,
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
      <ChangeStageAutomationModalContent form={form} entityTypeId={automationStore.entityTypeId} />
    </AutomationModalTemplate>
  );
});

ChangeStageAutomationModal.displayName = 'ChangeStageAutomationModal';
export { ChangeStageAutomationModal };

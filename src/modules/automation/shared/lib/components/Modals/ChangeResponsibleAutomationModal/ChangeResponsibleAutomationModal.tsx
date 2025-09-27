import { EntityTypeActionType, SelectModel, UuidUtil, validateForm, type Optional } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AutomationEntityTypeTemplateFormData,
  type ActionEntityResponsibleChangeSettings,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  ChangeResponsibleAutomationModalContent,
  type ChangeResponsibleAutomationModalContentForm,
} from './ChangeResponsibleAutomationModalContent';

const ChangeResponsibleAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { stageId, isOpened, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.change_responsible_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('change_responsible_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionEntityResponsibleChangeSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionEntityResponsibleChangeSettings>,
    [automation]
  );

  const form = useLocalObservable<ChangeResponsibleAutomationModalContentForm>(() => ({
    responsibleUserId: SelectModel.create(settings?.responsibleUserId).required(),
  }));

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const changeStageActionSettings: ActionEntityResponsibleChangeSettings = {
        responsibleUserId: form.responsibleUserId.value,
      };

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: changeStageActionSettings,
          type: EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE,
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
      <ChangeResponsibleAutomationModalContent form={form} />
    </AutomationModalTemplate>
  );
});

ChangeResponsibleAutomationModal.displayName = 'ChangeResponsibleAutomationModal';
export { ChangeResponsibleAutomationModal };

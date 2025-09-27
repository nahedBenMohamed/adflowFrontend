import {
  EntityTypeActionType,
  InputModel,
  NumberModel,
  SelectModel,
  UuidUtil,
  validateForm,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AutomationEntityTypeDeadline,
  AutomationEntityTypeTemplateFormData,
  DeadlineType,
  type ActionTaskCreateSettings,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  AddTaskAutomationModalContent,
  type AddTaskAutomationModalContentForm,
} from './AddTaskAutomationModalContent';

const AddTaskAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { stageId, isOpened, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.add_task_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('task_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionTaskCreateSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionTaskCreateSettings>,
    [automation]
  );

  const form = useLocalObservable<AddTaskAutomationModalContentForm>(() => ({
    text: InputModel.create(settings?.text),
    title: InputModel.create(settings?.title).required(),
    responsibleUserId: SelectModel.create(settings?.responsibleUserId ?? null),
    deferStart: NumberModel.create(settings?.deferStart ?? null),
    deadline: new AutomationEntityTypeDeadline({
      time: settings?.deadlineTime ?? null,
      type: settings?.deadlineType ?? DeadlineType.IN_ONE_DAY,
    }),
  }));

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const createTaskActionSettings: ActionTaskCreateSettings = {
        text: form.text.trimmedValue,
        title: form.title.trimmedValue,
        deadlineType: form.deadline.type,
        deadlineTime: form.deadline.time,
        deferStart: form.deferStart.value,
        responsibleUserId: form.responsibleUserId.value,
      };

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: createTaskActionSettings,
          type: EntityTypeActionType.TASK_CREATE,
        },
      });

      onClose();
    },
    [automation, automationStore, form, stageId, onClose]
  );

  return (
    <AutomationModalTemplate
      isOpened={isOpened}
      automation={automation}
      templateFormData={templateModel}
      automationStore={automationStore}
      title={automation ? t('title_update') : t('title_add')}
      onClose={onClose}
      onSave={handleSave}
    >
      <AddTaskAutomationModalContent form={form} />
    </AutomationModalTemplate>
  );
});

AddTaskAutomationModal.displayName = 'AddTaskAutomationModal';
export { AddTaskAutomationModal };

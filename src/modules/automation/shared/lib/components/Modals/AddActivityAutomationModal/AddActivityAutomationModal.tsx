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
  type ActionActivityCreateSettings,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  AddActivityAutomationModalContent,
  type AddActivityAutomationModalContentForm,
} from './AddActivityAutomationModalContent';

const AddActivityAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { stageId, isOpened, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.add_activity_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('activity_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionActivityCreateSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionActivityCreateSettings>,
    [automation]
  );

  const form = useLocalObservable<AddActivityAutomationModalContentForm>(() => ({
    text: InputModel.create(settings?.text),
    deferStart: NumberModel.create(settings?.deferStart ?? null),
    activityTypeId: SelectModel.create(settings?.activityTypeId).required(),
    responsibleUserId: SelectModel.create(settings?.responsibleUserId ?? null),
    deadline: new AutomationEntityTypeDeadline({
      time: settings?.deadlineTime ?? null,
      type: settings?.deadlineType ?? DeadlineType.IN_ONE_DAY,
    }),
  }));

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const createActivityActionSettings: ActionActivityCreateSettings = {
        text: form.text.trimmedValue,
        deadlineTime: form.deadline.time,
        deadlineType: form.deadline.type,
        deferStart: form.deferStart.value,
        activityTypeId: form.activityTypeId.value,
        responsibleUserId: form.responsibleUserId.value,
      };

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: createActivityActionSettings,
          type: EntityTypeActionType.ACTIVITY_CREATE,
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
      <AddActivityAutomationModalContent form={form} />
    </AutomationModalTemplate>
  );
});

AddActivityAutomationModal.displayName = 'AddActivityAutomationModal';
export { AddActivityAutomationModal };

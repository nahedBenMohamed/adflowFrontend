import {
  EntityTypeActionType,
  InputModel,
  MultiselectModel,
  SelectModel,
  UuidUtil,
  validateForm,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActionChatSendAmworkSettings } from '../../../models';
import {
  AutomationEntityTypeTemplateFormData,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  SendInternalChatAutomationModalContent,
  type SendInternalChatAutomationModalContentForm,
} from './SendInternalChatAutomationModalContent';

const SendInternalChatAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { isOpened, stageId, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.send_internal_chat_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('send_internal_chat_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionChatSendAmworkSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionChatSendAmworkSettings>,
    [automation]
  );

  const form = useLocalObservable<SendInternalChatAutomationModalContentForm>(() => ({
    message: InputModel.create(settings?.message).required(),
    userId: SelectModel.create(settings?.userId ?? null),
    sendTo: MultiselectModel.create(settings?.sendTo ?? [-1]).required(),
  }));

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const sendInternalChatActionSettings: ActionChatSendAmworkSettings = {
        userId: form.userId.value,
        sendTo:
          !form.sendTo.values.length || form.sendTo.values[0] === -1 ? null : form.sendTo.values,
        message: form.message.trimmedValue,
      };

      await automationStore.saveAutomation({
        stageId,
        automationId: automation?.id,
        templateModel: templateFormData,
        action: {
          delay: templateFormData.delay,
          settings: sendInternalChatActionSettings,
          type: EntityTypeActionType.CHAT_SEND_AMWORK,
        },
      });

      onClose();
    },
    [automation, automationStore, form, stageId, onClose]
  );

  return (
    <AutomationModalTemplate
      maxHeight="824px"
      isOpened={isOpened}
      automation={automation}
      templateFormData={templateModel}
      automationStore={automationStore}
      title={automation ? t('title_update') : t('title_add')}
      onClose={onClose}
      onSave={handleSave}
    >
      <SendInternalChatAutomationModalContent
        entityTypeId={automationStore.entityTypeId}
        form={form}
      />
    </AutomationModalTemplate>
  );
});

SendInternalChatAutomationModal.displayName = 'SendInternalChatAutomationModal';
export { SendInternalChatAutomationModal };

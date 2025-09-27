import { EntityTypeActionType, UuidUtil, validateForm, type Optional } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getSendExternalChatActionSettings } from '../../../helpers';
import { useInitializeSendExternalChatForm } from '../../../hooks';
import {
  AutomationEntityTypeTemplateFormData,
  type ActionChatSendSettings,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import { SendExternalChatAutomationModalContent } from './SendExternalChatAutomationModalContent';

const SendExternalChatAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { isOpened, stageId, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.send_external_chat_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('send_external_chat_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionChatSendSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionChatSendSettings>,
    [automation]
  );

  const form = useInitializeSendExternalChatForm(settings);

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!form.phoneNumbersEnabled.value) {
        form.phoneNumbers = [];
      } else if (form.phoneNumbers.some(pn => !pn.trimmedValue)) {
        form.phoneNumbers.forEach(pn => {
          pn.showError(t('errors.phone'));
        });

        return;
      }

      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const sendExternalChatActionSettings = getSendExternalChatActionSettings(form);

      if (!sendExternalChatActionSettings) return;

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: sendExternalChatActionSettings,
          type: EntityTypeActionType.CHAT_SEND_EXTERNAL,
        },
      });

      onClose();
    },
    [automation, automationStore, form, stageId, onClose, t]
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
      <SendExternalChatAutomationModalContent
        entityTypeId={automationStore.entityTypeId}
        form={form}
      />
    </AutomationModalTemplate>
  );
});

SendExternalChatAutomationModal.displayName = 'SendExternalChatAutomationModal';
export { SendExternalChatAutomationModal };

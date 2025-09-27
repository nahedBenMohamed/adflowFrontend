import { MailboxStore, type MailboxSignature } from '@/modules/mailing';
import { EntityTypeActionType, UuidUtil, validateForm, type Optional } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSendEmailActionSettings } from '../../../helpers';
import { useInitializeSendEmailActionSettingsForm } from '../../../hooks';
import {
  AutomationEntityTypeTemplateFormData,
  type ActionEmailSendSettings,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import { SendEmailAutomationModalContent } from './SendEmailAutomationModalContent';

const SendEmailAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { isOpened, stageId, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.send_email_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('send_email_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionEmailSendSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionEmailSendSettings>,
    [automation]
  );

  const [signatures, setSignatures] = useState<MailboxSignature[]>([]);

  const { areSignaturesLoading, loadMailboxSignatures } = useMemo(() => new MailboxStore(), []);

  const form = useInitializeSendEmailActionSettingsForm(settings);

  useEffect(() => {
    const loadSignatures = async (): Promise<void> => {
      if (!form.mailboxId.value) return;

      const signatures = await loadMailboxSignatures(form.mailboxId.value);

      setSignatures(signatures);
    };

    loadSignatures();
  }, [form.mailboxId.value, loadMailboxSignatures]);

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const sendEmailActionSettings = getSendEmailActionSettings(form);

      if (!sendEmailActionSettings) return;

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: sendEmailActionSettings,
          type: EntityTypeActionType.EMAIL_SEND,
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
      hint={t('title_hint')}
      automation={automation}
      templateFormData={templateModel}
      automationStore={automationStore}
      title={automation ? t('title_update') : t('title_add')}
      onClose={onClose}
      onSave={handleSave}
    >
      <SendEmailAutomationModalContent
        form={form}
        signatures={signatures}
        entityTypeId={automationStore.entityTypeId}
        areSignaturesLoading={areSignaturesLoading}
      />
    </AutomationModalTemplate>
  );
});

SendEmailAutomationModal.displayName = 'SendEmailAutomationModal';
export { SendEmailAutomationModal };

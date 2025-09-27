import type { Optional } from '@/shared';
import type { SendEmailAutomationModalContentForm } from '../components';
import { ActionSendVariant, type ActionEmailSendSettings, type ActionSendOptions } from '../models';

export const getSendEmailActionSettings = (
  form: SendEmailAutomationModalContentForm
): Optional<ActionEmailSendSettings> => {
  // if we choose "customize", but don't choose any option in checkboxes
  if (
    !form.options.main.enabled.value &&
    !form.options.contact.enabled.value &&
    !form.options.company.enabled.value &&
    form.options.enabled.value === 'true'
  ) {
    form.options.main.enabled.isValid = false;
    form.options.contact.enabled.isValid = false;
    form.options.company.enabled.isValid = false;

    return;
  }

  const options: Optional<ActionSendOptions> =
    form.options.enabled.value === 'true'
      ? {
          main: form.options.main.enabled.value
            ? {
                onlyFirstValue: form.options.main.onlyFirstValue.value === 'true',
              }
            : undefined,
          contact: form.options.contact.enabled.value
            ? {
                onlyFirstValue: [
                  ActionSendVariant.FIRST_ENTITY_FIRST_VALUE,
                  ActionSendVariant.ALL_ENTITIES_FIRST_VALUE,
                ].includes(form.options.contact.actionSendVariant.value),
                onlyFirstEntity: [
                  ActionSendVariant.FIRST_ENTITY_FIRST_VALUE,
                  ActionSendVariant.FIRST_ENTITY_ALL_VALUES,
                ].includes(form.options.contact.actionSendVariant.value),
              }
            : undefined,
          company: form.options.company.enabled.value
            ? {
                onlyFirstValue: [
                  ActionSendVariant.FIRST_ENTITY_FIRST_VALUE,
                  ActionSendVariant.ALL_ENTITIES_FIRST_VALUE,
                ].includes(form.options.company.actionSendVariant.value),
                onlyFirstEntity: [
                  ActionSendVariant.FIRST_ENTITY_FIRST_VALUE,
                  ActionSendVariant.FIRST_ENTITY_ALL_VALUES,
                ].includes(form.options.company.actionSendVariant.value),
              }
            : undefined,
        }
      : undefined;

  const sendEmailActionSettings: ActionEmailSendSettings = {
    options,
    userId: form.userId.value,
    signature: form.signature.value,
    mailboxId: form.mailboxId.value,
    sendAsHtml: form.sendAsHTML.value,
    content: form.content.trimmedValue,
    subject: form.subject.trimmedValue,
  };

  return sendEmailActionSettings;
};

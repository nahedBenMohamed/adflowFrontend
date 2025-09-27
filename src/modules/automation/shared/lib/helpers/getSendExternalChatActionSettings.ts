import type { Optional } from '@/shared';
import type { SendExternalChatAutomationModalContentForm } from '../components';
import { ActionSendVariant, type ActionChatSendSettings, type ActionSendOptions } from '../models';

export const getSendExternalChatActionSettings = (
  form: SendExternalChatAutomationModalContentForm
): Optional<ActionChatSendSettings> => {
  // if we choose no message target option
  if (!form.chatsEnabled.value && !form.phoneNumbersEnabled.value) {
    form.chatsEnabled.isValid = false;
    form.phoneNumbersEnabled.isValid = false;

    return;
  }

  // if we choose "customize", but don't choose any option in checkboxes
  if (
    form.chatsEnabled.value &&
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

  let options: Optional<ActionSendOptions>;

  if (form.chatsEnabled.value) {
    options =
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
  } else {
    options = {
      main: null,
      company: null,
      contact: null,
    };
  }

  const sendInternalChatActionSettings: ActionChatSendSettings = {
    providerId: form.providerId.value,
    message: form.message.value,
    userId: form.userId.value,
    phoneNumbers: form.phoneNumbers.length
      ? form.phoneNumbers.map(fv => fv.trimmedValue)
      : undefined,
    options,
  };

  return sendInternalChatActionSettings;
};

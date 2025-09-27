import { BooleanModel, InputModel, SelectModel, type Nullable, type Optional } from '@/shared';
import { useLocalObservable } from 'mobx-react-lite';
import type { SendEmailAutomationModalContentForm } from '../components';
import { getActionSendVariant } from '../helpers';
import { ActionSendVariant, type ActionEmailSendSettings } from '../models';

export const useInitializeSendEmailActionSettingsForm = (
  settings: Nullable<ActionEmailSendSettings> | Optional<ActionEmailSendSettings>
) =>
  useLocalObservable<SendEmailAutomationModalContentForm>(() => ({
    signature: InputModel.create(settings?.signature),
    content: InputModel.create(settings?.content || ''),
    sendAsHTML: BooleanModel.create(settings?.sendAsHtml),
    userId: SelectModel.create(settings?.userId).required(),
    subject: InputModel.create(settings?.subject).required(),
    mailboxId: SelectModel.create(settings?.mailboxId).required(),
    options: {
      enabled: InputModel.create(settings?.options ? 'true' : 'false'),
      main: {
        enabled: BooleanModel.create(Boolean(settings?.options?.main)),
        onlyFirstValue: InputModel.create(
          settings?.options?.main?.onlyFirstValue ? 'true' : 'false'
        ),
      },
      contact: {
        enabled: BooleanModel.create(Boolean(settings?.options?.contact)),
        actionSendVariant: InputModel.create(
          settings?.options?.contact
            ? getActionSendVariant(settings?.options?.contact)
            : ActionSendVariant.ALL_ENTITIES_ALL_VALUES
        ),
      },
      company: {
        enabled: BooleanModel.create(Boolean(settings?.options?.company)),
        actionSendVariant: InputModel.create(
          settings?.options?.company
            ? getActionSendVariant(settings?.options?.company)
            : ActionSendVariant.ALL_ENTITIES_ALL_VALUES
        ),
      },
    },
  }));

import { BooleanModel, InputModel, SelectModel, type Nullable, type Optional } from '@/shared';
import { useLocalObservable } from 'mobx-react-lite';
import type { SendExternalChatAutomationModalContentForm } from '../components';
import { getActionSendVariant } from '../helpers';
import { ActionSendVariant, type ActionChatSendSettings } from '../models';

export const useInitializeSendExternalChatForm = (
  settings: Optional<ActionChatSendSettings> | Nullable<ActionChatSendSettings>
): SendExternalChatAutomationModalContentForm =>
  useLocalObservable<SendExternalChatAutomationModalContentForm>(() => ({
    message: InputModel.create(settings?.message).required(),
    providerId: SelectModel.create(settings?.providerId).required(),
    userId: SelectModel.create(settings?.userId ?? null),
    phoneNumbersEnabled: BooleanModel.create(Boolean(settings?.phoneNumbers)),
    chatsEnabled:
      settings?.options?.main === null &&
      settings?.options?.company === null &&
      settings?.options?.contact === null
        ? BooleanModel.create(false)
        : BooleanModel.create(true),
    phoneNumbers: settings?.phoneNumbers
      ? settings.phoneNumbers.map(phoneNumber =>
          InputModel.create(phoneNumber).phoneInternational()
        )
      : [InputModel.create().phoneInternational()],
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

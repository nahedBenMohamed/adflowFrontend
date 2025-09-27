import { generalSettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  ChatUserExternalDto,
  CreateExternalChatDto,
  chatApi,
  refetchChats,
  useMultichatContext,
  type ChatProvider,
} from '@/modules/multichat';
import { Language } from '@/shared';
import { useCallback } from 'react';
import { useCardFieldHelperContext } from '../../../../context';
import { sanitizeAndModifyPhoneNumber } from '../../helpers';

type CreateExternalChatHandler = ({
  provider,
  phoneNumber,
}: {
  provider: ChatProvider;
  phoneNumber: string;
}) => () => Promise<void>;

export const useGetCreateExternalChatHandler = (
  closeDropdown: () => void
): CreateExternalChatHandler => {
  const { user: currentUser } = authStore;
  const { accountSettings } = generalSettingsStore;

  const isRULocale = accountSettings?.language === Language.RUSSIAN;

  const helperContext = useCardFieldHelperContext();
  const { show: showMultichatModal } = useMultichatContext();

  return useCallback<CreateExternalChatHandler>(
    ({ provider, phoneNumber }) =>
      async (): Promise<void> => {
        if (!helperContext || !currentUser)
          throw new Error(
            `Failed to create external chat, helperContext or currentUser is not defined`
          );

        phoneNumber = sanitizeAndModifyPhoneNumber({ phoneNumber, isRULocale });

        const chatTitle = helperContext.entityName || phoneNumber;

        const createExternalChatDto = new CreateExternalChatDto({
          title: chatTitle,
          participantIds: [],
          providerId: provider.id,
          entityId: helperContext.entityId,
          externalUser: new ChatUserExternalDto({
            phone: phoneNumber,
            firstName: chatTitle,
            externalId: phoneNumber,
          }),
        });

        const createdExternalChat = await chatApi.createExternalChat(createExternalChatDto);

        refetchChats(createdExternalChat.providerId);

        showMultichatModal({
          activeChatId: createdExternalChat.id,
          activeProviderId: createdExternalChat.providerId,
        });

        // to invalidate entity and it's links to possibly display wa tags near names
        helperContext.invalidateEntityInCache?.();

        closeDropdown();
      },
    [isRULocale, currentUser, helperContext, closeDropdown, showMultichatModal]
  );
};

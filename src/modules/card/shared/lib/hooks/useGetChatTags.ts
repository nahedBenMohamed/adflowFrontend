import { ChatProviderTransport } from '@/modules/multichat';
import { useMemo } from 'react';
import type { ChatTag } from '../models';
import type { FindChatHandler } from '../types';

export const useGetChatTags = (handleFindChat: FindChatHandler): ChatTag[] =>
  useMemo<ChatTag[]>(
    () => [
      { chat: handleFindChat(ChatProviderTransport.VK), transport: ChatProviderTransport.VK },
      { chat: handleFindChat(ChatProviderTransport.AVITO), transport: ChatProviderTransport.AVITO },
      {
        chat: handleFindChat(ChatProviderTransport.WHATSAPP),
        transport: ChatProviderTransport.WHATSAPP,
      },
      {
        chat: handleFindChat(ChatProviderTransport.TELEGRAM),
        transport: ChatProviderTransport.TELEGRAM,
      },
      {
        chat: handleFindChat(ChatProviderTransport.INSTAGRAM),
        transport: ChatProviderTransport.INSTAGRAM,
      },
      {
        chat: handleFindChat(ChatProviderTransport.MESSENGER),
        transport: ChatProviderTransport.MESSENGER,
      },
    ],
    [handleFindChat]
  );

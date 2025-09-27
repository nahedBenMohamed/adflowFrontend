import { Chat, ChatMessageStatus } from '@/modules/multichat';
import { upsertChatInCache } from '@/modules/multichat/api';
import { useMutation } from '@tanstack/react-query';
import { chatApi } from '../ChatApi';

export const useMarkAllChatMessagesAsRead = (chat: Chat) => {
  return useMutation({
    mutationFn: () =>
      chatApi.updateAllChatMessagesStatus({ chatId: chat.id, status: ChatMessageStatus.SEEN }),

    onMutate: () => {
      chat.unseenCount = 0;
      upsertChatInCache(chat);
    },
  });
};

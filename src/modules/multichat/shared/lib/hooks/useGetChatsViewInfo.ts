import { userStore } from '@/app';
import { authStore } from '@/modules/auth';
import type { User } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatType, type Chat } from '../models';

interface ChatViewInfo {
  title: string;
  companion?: User;
}

export const useGetChatsViewInfo = (chat: Chat): ChatViewInfo => {
  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui',
  });

  return useMemo<ChatViewInfo>(() => {
    if (chat.title) return { title: chat.title };

    if (chat.type !== ChatType.PERSONAL)
      throw new Error('Chat title must be defined in group chats');

    const currentUserId = authStore.user?.id;

    const chatCompanion = chat.getInternalUsers().find(u => u.userId && u.userId !== currentUserId);

    if (!chatCompanion || !chatCompanion.userId) return { title: t('deleted_user') };

    const companion = userStore.getById(chatCompanion.userId);

    return { title: companion.fullName, companion };
  }, [chat, t]);
};

import { serverEventService } from '@/shared';
import { toastNotificationsStore } from '../../notifications';
import {
  addChatMessageToCache,
  addToProviderUnseenCount,
  addToTotalUnseenCount,
  deleteChatInCache,
  deleteChatMessageInCache,
  deleteChatMessagesCache,
  getChat,
  getChatMessage,
  updateChatLastMessageInCache,
  updateChatMessageStatus,
  updateChatMessagesInCache,
  upsertChatInCache,
} from '../api';
import type { MultichatContextValue } from '../context';
import {
  ChatMessageStatus,
  MultichatEvents,
  type ChatEvent,
  type ChatMessageCreatedEvent,
  type ChatMessageUpdatedEvent,
} from '../shared';

class ChatEventHandler {
  subscribe = async (context: MultichatContextValue): Promise<void> => {
    serverEventService.on<ChatMessageCreatedEvent>(
      MultichatEvents.CHAT_MESSAGE_CREATED,
      async (...args: ChatMessageCreatedEvent[]): Promise<void> => {
        if (args[0]) this.handleMessageCreatedEvent(context, args[0]);
      }
    );
    serverEventService.on<ChatMessageUpdatedEvent>(
      MultichatEvents.CHAT_MESSAGE_UPDATED,
      async (...args: ChatMessageUpdatedEvent[]): Promise<void> => {
        if (args[0]) this.handleMessageUpdatedEvent(context, args[0]);
      }
    );
    serverEventService.on<ChatMessageUpdatedEvent>(
      MultichatEvents.CHAT_MESSAGE_DELETED,
      async (...args: ChatMessageUpdatedEvent[]): Promise<void> => {
        if (args[0]) this.handleMessageDeletedEvent(context, args[0]);
      }
    );

    serverEventService.on<ChatEvent>(
      MultichatEvents.CHAT_CREATED,
      async (...args: ChatEvent[]): Promise<void> => {
        if (args[0]) this.handleChatCreatedEvent(context, args[0]);
      }
    );
    serverEventService.on<ChatEvent>(
      MultichatEvents.CHAT_UPDATED,
      async (...args: ChatEvent[]): Promise<void> => {
        if (args[0]) this.handleChatUpdatedEvent(context, args[0]);
      }
    );
    serverEventService.on<ChatEvent>(
      MultichatEvents.CHAT_DELETED,
      async (...args: ChatEvent[]): Promise<void> => {
        if (args[0]) this.handleChatDeletedEvent(context, args[0]);
      }
    );
  };

  unsubscribe = async (): Promise<void> => {
    serverEventService.off(MultichatEvents.CHAT_MESSAGE_CREATED);
    serverEventService.off(MultichatEvents.CHAT_MESSAGE_UPDATED);
    serverEventService.off(MultichatEvents.CHAT_MESSAGE_DELETED);

    serverEventService.off(MultichatEvents.CHAT_CREATED);
    serverEventService.off(MultichatEvents.CHAT_UPDATED);
    serverEventService.off(MultichatEvents.CHAT_DELETED);
  };

  handleMessageCreatedEvent = async (
    context: MultichatContextValue,
    event: ChatMessageCreatedEvent
  ): Promise<void> => {
    updateChatMessageStatus({
      chatId: event.chatId,
      messageId: event.messageId,
      status: ChatMessageStatus.RECEIVED,
    });

    addToTotalUnseenCount(1);
    addToProviderUnseenCount({ providerId: event.providerId, add: 1 });

    // show notification if event chat is not opened
    if (event.chatId !== context.activeChatId) toastNotificationsStore.showChatMessages([event]);

    const chat = await getChat(event.chatId);

    if (chat) upsertChatInCache(chat);

    const message = await getChatMessage({ chatId: event.chatId, messageId: event.messageId });

    if (message) addChatMessageToCache({ chatId: event.chatId, message });
  };

  handleMessageUpdatedEvent = async (
    context: MultichatContextValue,
    event: ChatMessageUpdatedEvent
  ): Promise<void> => {
    if (context.activeProviderId && event.providerId !== context.activeProviderId) return;

    if (event.isLastMessage || event.chatId === context.activeChatId) {
      const message = await getChatMessage({ chatId: event.chatId, messageId: event.messageId });

      if (!message) return;

      updateChatMessagesInCache({ chatId: event.chatId, messages: [message] });

      if (event.isLastMessage)
        updateChatLastMessageInCache({
          providerId: event.providerId,
          chatId: event.chatId,
          message,
          incrementUnseenCount: false,
        });
    }
  };

  handleMessageDeletedEvent = async (
    context: MultichatContextValue,
    event: ChatMessageUpdatedEvent
  ): Promise<void> => {
    if (event.chatId === context.activeChatId)
      deleteChatMessageInCache({ chatId: event.chatId, messageId: event.messageId });
  };

  handleChatCreatedEvent = async (
    context: MultichatContextValue,
    event: ChatEvent
  ): Promise<void> => {
    const activeProviderId = context.activeProviderId;

    if (!activeProviderId || event.providerId === activeProviderId) {
      const chat = await getChat(event.chatId);

      if (chat) upsertChatInCache(chat);
    }
  };

  handleChatUpdatedEvent = async (
    context: MultichatContextValue,
    event: ChatEvent
  ): Promise<void> => {
    const activeProviderId = context.activeProviderId;

    if (!activeProviderId || event.providerId === activeProviderId) {
      const chat = await getChat(event.chatId);

      if (chat) upsertChatInCache(chat);
    }
  };

  handleChatDeletedEvent = async (
    context: MultichatContextValue,
    event: ChatEvent
  ): Promise<void> => {
    const activeProviderId = context.activeProviderId;

    if (!activeProviderId || event.providerId === activeProviderId) {
      deleteChatInCache({ providerId: event.providerId, chatId: event.chatId });
      deleteChatMessagesCache(event.chatId);
    }
  };
}

export const chatEventHandler = new ChatEventHandler();

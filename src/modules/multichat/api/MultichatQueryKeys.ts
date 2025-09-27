import type { ChatFindFilterDto } from './dtos';

const queryKeys = {
  multichat: ['multichat'],
  unseenCount() {
    return [...this.multichat, 'unseen-count'];
  },
  providers() {
    return [...this.multichat, 'providers'];
  },
  chats(providerId?: number) {
    return [...this.multichat, 'chats', providerId];
  },
  chat(chatId: number) {
    return [...this.multichat, 'chat', chatId];
  },
  findFullChats(filter?: ChatFindFilterDto) {
    return [...this.chats(filter?.providerId ?? undefined), 'find', 'full', filter];
  },
  messages(chatId: number) {
    return [...this.chat(chatId), 'messages'];
  },
  message(chatId: number, messageId: number) {
    return [...this.messages(chatId), messageId];
  },
  chatExists(entityId: number) {
    return [...this.multichat, 'chat-exists', { entityId }];
  },
} as const;

export const MULTICHAT_QUERY_KEYS = Object.freeze(queryKeys);

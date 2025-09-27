import type { Chat, ChatProviderTransport } from '@/modules/multichat';

export interface ChatTag {
  chat?: Chat;
  transport: ChatProviderTransport;
}

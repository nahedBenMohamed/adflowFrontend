import type { Chat, ChatProviderTransport } from '@/modules/multichat';
import type { Optional } from '@/shared';

export type FindChatHandler = (transport: ChatProviderTransport) => Optional<Chat>;

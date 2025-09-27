import type { Optional } from '@/shared';
import type { Chat, ChatProvider, ChatProviderTransport } from '../models';

export const findChatWithProviderTransport = ({
  transport,
  chats,
  providers,
}: {
  transport: ChatProviderTransport;
  chats?: Chat[];
  providers?: ChatProvider[];
}): Optional<Chat> =>
  chats?.find(c => providers?.find(p => p.id === c.providerId)?.transport === transport);

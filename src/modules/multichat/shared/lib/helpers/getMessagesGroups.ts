import type { ChatMessage, ChatMessagesResult, MessagesGroup } from '../models';

export const getMessagesGroups = (messagesData: ChatMessagesResult[]): MessagesGroup[] => {
  const messagesGroups: MessagesGroup[] = [];

  const chatMessages: ChatMessage[] = messagesData.reduce<ChatMessage[]>(
    (ms: ChatMessage[], d) => [...ms, ...d.messages],
    []
  );

  if (chatMessages) {
    chatMessages.forEach(m => {
      const date = m.createdAt.startOfDay();
      const messageGroup = messagesGroups.find(g => g.date.equals(date));

      const message = messageGroup?.ms.find(ms => ms.id === m.id);

      if (message) return;

      if (messageGroup) {
        messageGroup.ms.push(m);
      } else {
        messagesGroups.push({
          date: date,
          ms: [m],
        });
      }
    });
  }

  messagesGroups.sort((a, b) => (a.date.greaterThan(b.date) ? -1 : 1));

  return messagesGroups;
};

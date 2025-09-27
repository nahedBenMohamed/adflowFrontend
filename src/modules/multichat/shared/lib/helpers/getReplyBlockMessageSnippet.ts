import type { ChatMessage } from '../models';

const paperclip = '📎';
const image = '🖼️';
const audio = '🎧';
const emptyMessage = '💬';

export const getReplyBlockMessageSnippet = (message: ChatMessage): string => {
  const fileTypeEmoji = message.files?.[0]?.fileType.includes('image')
    ? image
    : message.files?.[0]?.fileType.includes('audio')
      ? audio
      : paperclip;

  if (message.text.length) {
    if (message.files.length > 0) {
      return `${fileTypeEmoji} ${message.text}`;
    }

    return message.text;
  }

  if (message.files[0]) return `${fileTypeEmoji} ${message.files[0].fileName}`;

  return emptyMessage;
};

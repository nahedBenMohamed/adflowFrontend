import { TextHighlighter, type Nullable } from '@/shared';
import type { ReactNode } from 'react';
import type { ChatMessage } from '../models';

const paperclip = '📎';
const image = '🖼️';
const audio = '🎧';
const emptyMessage = '💬';

export const getChatLastMessageSnippet = ({
  lastMessage,
  lastMessageSearch = null,
}: {
  lastMessage: ChatMessage;
  lastMessageSearch?: Nullable<string>;
}): ReactNode => {
  const fileTypeEmoji = lastMessage.files?.[0]?.fileType.includes('image')
    ? image
    : lastMessage.files?.[0]?.fileType.includes('audio')
      ? audio
      : paperclip;

  if (lastMessage.text.length) {
    if (lastMessage.files.length > 0) {
      return (
        <>
          {fileTypeEmoji} <TextHighlighter str={lastMessage.text} filter={lastMessageSearch} />
        </>
      );
    }

    return <TextHighlighter str={lastMessage.text} filter={lastMessageSearch} />;
  }

  if (lastMessage.files[0]) return `${fileTypeEmoji} ${lastMessage.files[0].fileName}`;

  return emptyMessage;
};

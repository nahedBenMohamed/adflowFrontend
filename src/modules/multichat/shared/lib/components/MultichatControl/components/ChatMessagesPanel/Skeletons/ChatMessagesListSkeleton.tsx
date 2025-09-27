import { ChatMessagesListRoot } from '../ChatMessagesList/ChatMessagesList';
import { ChatMessageItemSkeleton } from './ChatMessageItemSkeleton';

const ChatMessagesListSkeleton = () => {
  return (
    <ChatMessagesListRoot>
      <ChatMessageItemSkeleton delay={200} bubbleSize="large" />
      <ChatMessageItemSkeleton delay={400} bubbleSize="large" />
      <ChatMessageItemSkeleton delay={600} bubbleSize="medium" largeName />
      <ChatMessageItemSkeleton delay={800} bubbleSize="medium" largeName />
      <ChatMessageItemSkeleton delay={1000} bubbleSize="small" />
      <ChatMessageItemSkeleton delay={1200} bubbleSize="large" largeName />
      <ChatMessageItemSkeleton delay={1400} bubbleSize="medium" largeName />
      <ChatMessageItemSkeleton delay={1600} bubbleSize="medium" largeName />
      <ChatMessageItemSkeleton delay={1800} bubbleSize="small" />
    </ChatMessagesListRoot>
  );
};

export { ChatMessagesListSkeleton };

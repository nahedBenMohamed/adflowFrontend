import { CloseCrossIcon } from '@/modules/card';
import { getReplyBlockMessageSnippet } from '@/modules/multichat';
import { type Optional, TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Chat, ChatMessage } from '../../../../../models';

const Root = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  padding: 4px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
    background: var(--background-green-20);
  }
`;

const LeftContentWrapper = styled.div`
  max-width: 95%;

  display: flex;
  gap: 8px;
`;

const Line = styled.hr`
  width: 2px;
  height: 100%;
  min-height: 40px;
  flex-shrink: 0;

  background: var(--button-text-green-default);
`;

const ContentWrapper = styled.div`
  max-width: 100%;

  display: flex;
  flex-direction: column;
`;

const Heading = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const Text = styled.p`
  max-width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const CloseIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;

    path {
      transition: var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-graphite-primary-text);
    }
  }
`;

interface Props {
  message: ChatMessage;
  chat: Optional<Chat>;
  isEditing?: boolean;
  onClose?: () => void;
}

const ChatMessageReplyBlock = observer((props: Props) => {
  const { message, chat, isEditing, onClose } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.chat_message_reply_block',
  });

  const chatUser = chat?.getChatUser(message.chatUserId);

  const handleScrollToMessage = () => {
    const messageElement = document.querySelector(`[data-id="${message.id}"]`);

    messageElement?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  const handleOnClose: MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation();

    onClose?.();
  };

  return (
    <Root onClick={handleScrollToMessage}>
      <LeftContentWrapper>
        <Line />

        <ContentWrapper>
          <Heading>{isEditing ? t('editing_message') : chatUser?.fullName}</Heading>

          <Text>{getReplyBlockMessageSnippet(message)}</Text>
        </ContentWrapper>
      </LeftContentWrapper>

      {onClose && (
        <CloseIconWrapper onClick={handleOnClose}>
          <CloseCrossIcon />
        </CloseIconWrapper>
      )}
    </Root>
  );
});

export { ChatMessageReplyBlock };

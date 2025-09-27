import { TruncateMixin } from '@/shared';
import styled from 'styled-components';
import { ReadIcon, UnreadIcon } from '../../../../../../assets';
import { getLastMessageTimeFormatted } from '../../../../../helpers';
import type { ChatMessage, ChatUser } from '../../../../../models';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LastMessageTime = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const StatusIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  currentChatUser: ChatUser;
  lastMessage: ChatMessage;
  isCurrentUserAuthorOfLastMessage: boolean;
}

const PanelBlockHeaderLastMessageInfo = (props: Props) => {
  const { currentChatUser, lastMessage, isCurrentUserAuthorOfLastMessage } = props;

  const seen = lastMessage.wasMessageSeenByOthers(currentChatUser.id);

  return (
    <Root>
      {isCurrentUserAuthorOfLastMessage && (
        <StatusIconWrapper>{seen ? <ReadIcon /> : <UnreadIcon />}</StatusIconWrapper>
      )}

      <LastMessageTime>{getLastMessageTimeFormatted(lastMessage.createdAt)}</LastMessageTime>
    </Root>
  );
};

export { PanelBlockHeaderLastMessageInfo };

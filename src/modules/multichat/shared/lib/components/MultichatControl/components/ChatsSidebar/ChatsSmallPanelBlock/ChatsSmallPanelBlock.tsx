import { Avatar, AvatarCircle, MyIndicator } from '@/shared';
import styled, { css } from 'styled-components';
import { renderProviderIndicatorIcon } from '../../../../../helpers';
import { useGetChatsViewInfo } from '../../../../../hooks';
import type { Chat, ChatProviderTransport } from '../../../../../models';
import { UnseenCountTag } from '../UnseenCountTag/UnseenCountTag';

interface RootProps {
  $active: boolean;
  $hasUnread: boolean;
}

const Root = styled.button<RootProps>`
  height: 72px;
  width: 72px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;

  padding: 8px 12px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  ${p =>
    p.$hasUnread &&
    css`
      background-color: var(--primary-statuses-white-0);
      border-color: transparent;
      box-shadow:
        0px 0px 2px #eef4fe,
        0px 1px 2px #d0daeb;
    `}

  ${p =>
    p.$active &&
    css`
      background-color: var(--graphite-graphite-20);
      border-color: var(--primary-statuses-green-520);
    `}
`;

const UnseenCountTagWrapper = styled.div`
  position: absolute;
  top: -1px;
  right: -1px;
`;

interface Props {
  chat: Chat;
  active: boolean;
  providerTransport: ChatProviderTransport;
  onSelect: () => void;
}

const ChatsSmallPanelBlock = (props: Props) => {
  const { chat, active, providerTransport, onSelect } = props;

  const { title, companion } = useGetChatsViewInfo(chat);
  const externalCompanion = chat.getExternalUsers()[0];

  const { unseenCount } = chat;

  const hasUnread = unseenCount > 0;

  return (
    <Root $hasUnread={hasUnread} $active={active} onClick={onSelect}>
      <MyIndicator
        size={0}
        zIndex={1}
        offset={8}
        position="bottom-end"
        label={renderProviderIndicatorIcon(providerTransport)}
      >
        <AvatarCircle
          size="xx-large"
          avatar={
            companion
              ? companion.getAvatar()
              : externalCompanion
                ? externalCompanion.getAvatar()
                : new Avatar({ avatarUrl: null, firstName: title, lastName: null })
          }
        />

        {hasUnread && (
          <UnseenCountTagWrapper>
            <UnseenCountTag $bordered>{unseenCount}</UnseenCountTag>
          </UnseenCountTagWrapper>
        )}
      </MyIndicator>
    </Root>
  );
};

export { ChatsSmallPanelBlock };

import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  Avatar,
  AvatarCircle,
  LinkedEntityTag,
  MyIndicator,
  SpanWithEllipsis,
  TextHighlighter,
  TruncateMixin,
  type Nullable,
} from '@/shared';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { getChatLastMessageSnippet, renderProviderIndicatorIcon } from '../../../../../helpers';
import { useGetChatsViewInfo } from '../../../../../hooks';
import { ChatType, type Chat, type ChatProviderTransport } from '../../../../../models';
import { PanelBlockHeaderLastMessageInfo } from '../PanelBlockHeaderLastMessageInfo/PanelBlockHeaderLastMessageInfo';
import { UnseenCountTag } from '../UnseenCountTag/UnseenCountTag';

interface RootProps {
  $active: boolean;
  $hasUnread: boolean;
}

const Root = styled.div<RootProps>`
  width: 100%;
  min-height: var(--chats-panel-block-min-height);

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

  ${TruncateMixin}
`;

const ContentBlock = styled.div`
  height: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;

  ${TruncateMixin}
`;

const ContentBlockHeader = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Title = styled.div`
  width: 100%;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const ContentBlockBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 4px;
`;

const LastMessagePreview = styled.div`
  display: flex;
  flex-direction: column;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  overflow-y: hidden;
`;

const LastMessageAuthor = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  white-space: pre-wrap;
  word-break: break-word;
  -webkit-box-orient: vertical;

  color: var(--button-text-graphite-priory-text);
`;

const LastMessageText = styled.div<{ $hasAuthor: boolean }>`
  display: -webkit-box;
  white-space: pre-wrap;
  word-break: break-word;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${p => (p.$hasAuthor ? 1 : 2)};

  color: var(--button-text-graphite-primary-text);
`;

const UnseenCountTagWrapper = styled.div`
  margin-top: auto;
`;

const LinkedEntityTagWrapper = styled.div`
  width: 100%;

  margin-top: 4px;

  ${TruncateMixin}
`;

interface Props {
  chat: Chat;
  active: boolean;
  providerTransport: ChatProviderTransport;
  titleSearch?: Nullable<string>;
  messageContentSearch?: Nullable<string>;
  onSelect: () => void;
}

const ChatsPanelBlock = (props: Props) => {
  const {
    chat,
    active,
    providerTransport,
    titleSearch = null,
    messageContentSearch = null,
    onSelect,
  } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.chats_panel_block',
  });

  const { title, companion } = useGetChatsViewInfo(chat);

  const externalUsers = chat.getExternalUsers();
  const externalCompanion = externalUsers.length > 1 ? null : externalUsers[0];

  const { lastMessage, unseenCount, entityInfo } = chat;

  const hasUnread = unseenCount > 0;

  const isGroupChat = chat.type === ChatType.GROUP;
  const lastMessageAuthor = lastMessage ? chat.getChatUser(lastMessage.chatUserId) : null;
  const isCurrentUserAuthorOfLastMessage = Boolean(
    authStore.user?.id === lastMessageAuthor?.userId
  );

  const currentUserId = authStore.user?.id;

  const lastMessageAuthorLabel = isCurrentUserAuthorOfLastMessage
    ? t('you')
    : lastMessageAuthor
      ? lastMessageAuthor.fullName
      : 'Unknown';

  return (
    <Root $hasUnread={hasUnread} $active={active} onClick={onSelect}>
      <MyIndicator
        size={0}
        offset={8}
        zIndex={1}
        position="bottom-end"
        label={renderProviderIndicatorIcon(providerTransport)}
      >
        <AvatarCircle
          size="xxx-large"
          avatar={
            companion
              ? companion.getAvatar()
              : externalCompanion
                ? externalCompanion.getAvatar()
                : new Avatar({ avatarUrl: null, firstName: title, lastName: null })
          }
        />
      </MyIndicator>

      <ContentBlock>
        <ContentBlockHeader>
          <Title>
            <TextHighlighter str={title} truncate filter={titleSearch} />
          </Title>

          {lastMessage && currentUserId && (
            <PanelBlockHeaderLastMessageInfo
              lastMessage={lastMessage}
              currentChatUser={chat.getChatUserByUserId(currentUserId)}
              isCurrentUserAuthorOfLastMessage={isCurrentUserAuthorOfLastMessage}
            />
          )}
        </ContentBlockHeader>

        <ContentBlockBody>
          {lastMessage && (
            <LastMessagePreview>
              {isGroupChat && lastMessageAuthor && (
                <LastMessageAuthor title={lastMessageAuthorLabel}>
                  {lastMessageAuthorLabel}
                </LastMessageAuthor>
              )}

              <LastMessageText $hasAuthor={isGroupChat}>
                {getChatLastMessageSnippet({
                  lastMessage,
                  lastMessageSearch: messageContentSearch,
                })}
              </LastMessageText>
            </LastMessagePreview>
          )}

          {hasUnread && (
            <UnseenCountTagWrapper>
              <UnseenCountTag>{unseenCount}</UnseenCountTag>
            </UnseenCountTagWrapper>
          )}
        </ContentBlockBody>

        {entityInfo && (
          <LinkedEntityTagWrapper>
            <LinkedEntityTag
              $small
              $disabled={!entityInfo.hasAccess}
              to={routes.card({
                entityId: entityInfo.id,
                entityTypeId: entityInfo.entityTypeId,
              })}
            >
              <SpanWithEllipsis text={entityInfo.name} />
            </LinkedEntityTag>
          </LinkedEntityTagWrapper>
        )}
      </ContentBlock>
    </Root>
  );
};

export { ChatsPanelBlock };

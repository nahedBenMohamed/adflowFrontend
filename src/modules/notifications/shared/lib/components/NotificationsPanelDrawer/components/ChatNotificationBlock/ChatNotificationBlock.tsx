import { useMultichatContext, type ChatMessageCreatedEvent } from '@/modules/multichat';
import { SpanWithEllipsis, TruncateMixin, UtcDate } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { getNotificationDateFormat } from '../../../../helpers';
import { NotificationType, NotificationTypeColor } from '../../../../models';
import { FromUser } from '../BlockHeaderAnnotation/BlockHeaderAnnotation';
import CloseToastButton from '../CloseToastButton/CloseToastButton';

const Root = styled.li`
  width: var(--toast-width);

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 12px 16px;
  border: 1px solid transparent;
  background: var(--graphite-graphite-20);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    border-color: var(--button-text-green-hover);
  }

  &:active {
    border-color: var(--button-text-green-active);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

const TitleTagWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;

  ${TruncateMixin}
`;

const TagCommon = css`
  max-width: 280px;

  display: block;

  padding: 1px 6px 2px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${TruncateMixin}
`;

interface TagProps {
  $color: string;
  $bgColor: string;
  $borderColor?: string;
}

const Tag = styled.div<TagProps>`
  color: ${p => p.$color};
  background-color: ${p => p.$bgColor};
  border: ${p => (p.$borderColor ? `1px solid ${p.$borderColor}` : 'none')};
  ${TagCommon};
`;

const CreatedAt = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  font-size: 14px;
  line-height: 20px;
`;

const Description = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  word-break: break-word;
  -webkit-box-orient: vertical;

  font-weight: 400;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);
`;

const LeftHeaderBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  ${TruncateMixin}
`;

interface Props {
  message: ChatMessageCreatedEvent;
  // closeToast injected by react-toastify
  // TODO: better typisation
  closeToast?: () => void;
}

const ChatNotificationBlock = observer((props: Props) => {
  const {
    message: { chatId, providerId, fromUser, createdAt, text },
    closeToast,
  } = props;

  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.notifications_panel.ui.block_header_annotation',
  });

  const {
    pageOpened,
    setActiveChatId,
    setActiveProviderId,
    show: showMultichatModal,
  } = useMultichatContext();

  const { bgColor, textColor, borderColor } =
    NotificationTypeColor[NotificationType.CHAT_MESSAGE_NEW];

  const handleClick = useCallback(() => {
    if (pageOpened) {
      setActiveChatId(chatId);
      setActiveProviderId(providerId);

      return;
    }

    showMultichatModal({
      activeChatId: chatId,
      activeProviderId: providerId,
    });
  }, [pageOpened, chatId, providerId, setActiveChatId, setActiveProviderId, showMultichatModal]);

  const handleCloseToast = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.stopPropagation();

      closeToast?.();
    },
    [closeToast]
  );

  return (
    <Root onClick={handleClick}>
      <Header>
        <TitleTagWrapper>
          <Tag $color={textColor} $bgColor={bgColor} $borderColor={borderColor}>
            {t('message')}
          </Tag>

          {fromUser && (
            <FromUser $seen={false}>
              <SpanWithEllipsis text={t('from_employee', { employee: fromUser })} />
            </FromUser>
          )}
        </TitleTagWrapper>

        <LeftHeaderBlockWrapper>
          <CreatedAt>
            {getNotificationDateFormat({ date: UtcDate.parseISO(createdAt), t })}
          </CreatedAt>

          {closeToast && <CloseToastButton onClick={handleCloseToast} />}
        </LeftHeaderBlockWrapper>
      </Header>

      <Content>
        <Description>{text}</Description>
      </Content>
    </Root>
  );
});

ChatNotificationBlock.displayName = 'ChatNotificationBlock';
export { ChatNotificationBlock };

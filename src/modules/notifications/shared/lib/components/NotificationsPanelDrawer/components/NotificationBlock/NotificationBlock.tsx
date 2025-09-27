import { routes } from '@/app';
import { UpdateTaskModal } from '@/modules/tasks';
import { SectionLinkUtil, TruncateMixin, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useIntersectionObserver } from 'usehooks-ts';
import { getNotificationDateFormat } from '../../../../helpers';
import { NotificationType, NotificationTypeColor, type Notification } from '../../../../models';
import { BlockHeaderAnnotation } from '../BlockHeaderAnnotation/BlockHeaderAnnotation';
import CloseToastButton from '../CloseToastButton/CloseToastButton';

interface RootProps {
  $seen: boolean;
  $toast: boolean;
}

const Root = styled.li<RootProps>`
  width: ${p => (p.$toast ? 'var(--toast-width)' : '100%')};

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 12px 16px;
  border-radius: var(--border-radius-block);
  box-shadow: ${p => (p.$seen ? 'none' : '0px 0px 2px #eef4fe, 0px 1px 2px #d0daeb')};
  border: 1px solid ${p => (p.$seen ? 'var(--graphite-graphite-80)' : 'transparent')};
  background: ${p => (p.$seen ? 'var(--graphite-graphite-20)' : 'var(--primary-statuses-white-0)')};
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

const EntityTagWrapper = styled.div`
  margin-left: auto;
`;

const TagCommon = css<{ $seen: boolean }>`
  max-width: 280px;

  display: block;

  padding: 1px 6px 2px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${p =>
    p.$seen &&
    css`
      color: var(--primary-statuses-white-0);

      background-color: var(--button-text-graphite-secondary-text);
    `}

  ${TruncateMixin}
`;

interface TagProps {
  $color: string;
  $bgColor: string;
  $borderColor?: string;
  $seen: boolean;
}

const Tag = styled.div<TagProps>`
  color: ${p => p.$color};

  background-color: ${p => p.$bgColor};
  border: ${p => (p.$borderColor && !p.$seen ? `1px solid ${p.$borderColor}` : 'none')};

  ${TagCommon};
`;

const EntityTag = styled.div<{ $seen: boolean }>`
  color: var(--primary-statuses-white-0);

  background-color: var(--primary-statuses-fuchsia-400);

  ${TagCommon};

  &:hover {
    color: var(--primary-statuses-white-0);
  }
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

const Title = styled.p<{ $seen: boolean }>`
  font-weight: 500;
  color: ${p => (p.$seen ? 'var(--button-text-graphite-primary-text)' : 'var(--primary-blue)')};
  transition: var(--transition-200);

  ${TruncateMixin}
`;

const Description = styled.div<{ $seen: boolean }>`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  font-weight: 400;
  color: ${p =>
    p.$seen
      ? 'var(--button-text-graphite-primary-text)'
      : 'var(--button-text-graphite-priory-text)'};

  overflow: hidden;
  word-break: break-word;
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
  notification: Notification;
  // closeToast injected by react-toastify
  // TODO: better typisation
  closeToast?: () => void;
  onSeen?: (id: number) => void;
}

const NotificationBlock = observer((props: Props) => {
  const { notification, closeToast, onSeen } = props;

  const navigate = useNavigate();

  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.tags',
  });

  const { fromUser, createdAt, title, description, entityInfo, type, isSeen, startsIn } =
    notification;

  const { bgColor, textColor, borderColor } = NotificationTypeColor[type];

  const [selectedTaskId, setSelectedTaskId] = useState<Nullable<number>>(null);

  const openSource = useCallback(
    (notification: Notification) => {
      switch (notification.type) {
        case NotificationType.TASK_NEW:
        case NotificationType.TASK_OVERDUE:
        case NotificationType.TASK_BEFORE_START:
        case NotificationType.TASK_OVERDUE_EMPLOYEE:
        case NotificationType.TASK_COMMENT_NEW: {
          setSelectedTaskId(notification.objectId);

          return;
        }

        case NotificationType.ACTIVITY_NEW:
        case NotificationType.ACTIVITY_OVERDUE:
        case NotificationType.ACTIVITY_BEFORE_START:
        case NotificationType.ACTIVITY_OVERDUE_EMPLOYEE:
        case NotificationType.CHAT_MESSAGE_NEW:
        case NotificationType.ENTITY_NOTE_NEW:
        case NotificationType.ENTITY_RESPONSIBLE_CHANGE:
        case NotificationType.ENTITY_NEW: {
          if (notification.entityInfo?.hasAccess)
            navigate(
              routes.card({
                entityTypeId: notification.entityInfo.entityTypeId,
                entityId: notification.entityInfo.id,
              })
            );

          return;
        }

        case NotificationType.MAIL_NEW: {
          if (notification.entityInfo?.hasAccess) {
            navigate(
              routes.card({
                entityTypeId: notification.entityInfo.entityTypeId,
                entityId: notification.entityInfo.id,
              })
            );
          } else {
            navigate(routes.mail);
          }

          return;
        }

        case NotificationType.ENTITY_IMPORT_COMPLETED: {
          if (notification.objectId)
            navigate(SectionLinkUtil.getSectionLink(notification.objectId));

          return;
        }

        default: {
          if (notification.entityInfo?.hasAccess)
            navigate(
              routes.card({
                entityTypeId: notification.entityInfo.entityTypeId,
                entityId: notification.entityInfo.id,
              })
            );

          return;
        }
      }
    },
    [navigate]
  );

  const openSourceHandler = useCallback(() => openSource(notification), [openSource, notification]);

  const { isIntersecting, ref: rootRef } = useIntersectionObserver({});

  useEffect(() => {
    if (isIntersecting && !notification.isSeen) {
      setTimeout(() => {
        notification.isSeen = true;

        onSeen?.(notification.id);
      }, 5000);
    }
  }, [isIntersecting, notification, onSeen]);

  const hideEntityTag = type === NotificationType.ENTITY_NEW;

  const isToast = Boolean(closeToast);
  const seen = isToast ? false : isSeen;

  const handleTaskModalClose = useCallback(() => {
    setSelectedTaskId(null);
  }, []);

  const handleCloseToast = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.stopPropagation();

      closeToast?.();
    },
    [closeToast]
  );

  return (
    <>
      <Root ref={rootRef} $seen={seen} $toast={isToast} onClick={openSourceHandler}>
        <Header>
          <TitleTagWrapper>
            <Tag $color={textColor} $bgColor={bgColor} $borderColor={borderColor} $seen={seen}>
              {t(type, { entityTypeName: entityInfo?.name })}
            </Tag>

            <BlockHeaderAnnotation
              type={type}
              seen={seen}
              fromUser={fromUser}
              startsIn={startsIn}
            />
          </TitleTagWrapper>

          <LeftHeaderBlockWrapper>
            <CreatedAt>{getNotificationDateFormat({ date: createdAt, t })}</CreatedAt>

            {closeToast && <CloseToastButton onClick={handleCloseToast} />}
          </LeftHeaderBlockWrapper>
        </Header>

        <Content>
          {title && (
            <Title title={title} $seen={seen}>
              {title}
            </Title>
          )}
          {description && <Description $seen={seen}>{description}</Description>}

          {entityInfo && !hideEntityTag && (
            <EntityTagWrapper>
              {entityInfo.hasAccess ? (
                <Link
                  to={routes.card({
                    entityTypeId: entityInfo.entityTypeId,
                    entityId: entityInfo.id,
                  })}
                >
                  <EntityTag $seen={seen}>{entityInfo.name}</EntityTag>
                </Link>
              ) : (
                <EntityTag $seen={seen}>{entityInfo.name}</EntityTag>
              )}
            </EntityTagWrapper>
          )}
        </Content>
      </Root>

      {selectedTaskId && (
        <UpdateTaskModal
          id={selectedTaskId}
          isOpened={Boolean(selectedTaskId)}
          onClose={handleTaskModalClose}
        />
      )}
    </>
  );
});

NotificationBlock.displayName = 'NotificationBlock';
export { NotificationBlock };

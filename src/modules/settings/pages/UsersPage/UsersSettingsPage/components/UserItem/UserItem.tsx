import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { SpanWithEllipsis, UserView, type User } from '@/shared';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Root = styled.li<{ $hoverable: boolean }>`
  display: grid;
  grid-template-columns: 30% 30% 10% 6%;
  align-items: center;
  gap: 8%;

  padding: 8px 16px;
  margin-bottom: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--button-text-graphite-priory-text);

  border-radius: var(--border-radius-element);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  transition: var(--transition-200);

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;

        background: var(--graphite-graphite-20);
        color: var(--button-text-graphite-priory-text);
      }
    `}
`;

const DeleteButton = styled.button`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  margin-left: auto;

  &:hover {
    cursor: pointer;

    color: var(--button-text-red-hover);
  }

  &:active {
    color: var(--button-text-red-active);
  }
`;

interface Props {
  user: User;
  onDelete: (userId: number) => void;
}

const UserItem = (props: Props) => {
  const { user, onDelete } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.users_settings_page.ui.user_item',
  });

  const navigate = useNavigate();

  const isOwner = user.isOwner();
  const { id, email, role } = user;
  const userRole = t(`user_role.${role}`);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onDelete(id);
  };

  const currentUser = authStore.user;

  const isCurrentOwner = currentUser?.isOwner();
  const isCurrentAdmin = authStore.isAdmin();

  const navigateDisabled = isOwner && !isCurrentOwner;

  const handleNavigate = () => {
    if (navigateDisabled) return;

    navigate(routes.settingsUsersUpdate(id));
  };

  return (
    <Root $hoverable={!navigateDisabled} onClick={handleNavigate}>
      <UserView user={user} />

      <SpanWithEllipsis text={email} />

      <SpanWithEllipsis medium text={userRole} />

      {/* admin can delete anyone but owner */}
      {isCurrentAdmin && !isOwner && (
        <DeleteButton type="button" onClick={handleDelete}>
          {t('remove')}
        </DeleteButton>
      )}
    </Root>
  );
};

export { UserItem };

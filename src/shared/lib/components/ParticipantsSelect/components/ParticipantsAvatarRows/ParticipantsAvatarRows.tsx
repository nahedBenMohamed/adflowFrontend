import { userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ClearParticipantIcon, SupervisorStar } from '../../../../../assets';
import type { MultiselectModel } from '../../../../models';
import { AvatarUtil } from '../../../../utils';
import type { UserDropdownItemMeta } from '../../../Form/UserPicker/components';
import { MyTooltip } from '../../../MyTooltip/MyTooltip/MyTooltip';

const AVATAR_SIZE = '32px';

const AvatarsContainer = styled.div<{ $width: string }>`
  position: relative;

  width: ${p => p.$width};
  height: ${AVATAR_SIZE};
`;

const OVERLAP = '24px';

const createCSS = () => {
  // make sure one avatar is slightly overlapped by the next one,
  // to get rid of code duplication we use a loop to generate css
  let css = '';

  for (let i = 1; i < 8; i++) {
    css += `
      &:nth-child(${i}) {
        top: 0;
        left: calc(${OVERLAP} * ${i - 1});

        &:hover {
          z-index: 10;
        }
      }
    `;
  }

  return css;
};

const IconWrapperCommon = css`
  position: absolute;
  top: 0;
  right: 0;

  width: 12px;
  height: 12px;

  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  scale: 0;
  opacity: 0;
  border-radius: 50%;
  transition: var(--transition-200);
`;

const ClearParticipantIconWrapper = styled.button`
  ${IconWrapperCommon}

  svg path:first-child {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path:first-child {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path:first-child {
      fill: var(--button-text-red-active);
    }
  }
`;

const SupervisorIconWrapper = styled.div`
  ${IconWrapperCommon}

  border: 1px solid var(--primary-statuses-white-0);
  background-color: var(--primary-statuses-yellow-400);

  svg path {
    fill: var(--primary-statuses-white-0) !important;
  }
`;

const AvatarWrapper = styled.div<{ minified?: boolean }>`
  position: absolute;

  width: ${AVATAR_SIZE};
  height: ${AVATAR_SIZE};

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${createCSS()}

  ${p =>
    p.minified &&
    css`
      &:nth-child(5) {
        background-color: var(--primary-statuses-white-0);
        box-shadow: inset 0 0 0 1px var(--button-text-graphite-primary-text);
        color: var(--button-text-graphite-primary-text);
      }

      &:nth-child(6) {
        display: none;
      }

      &:nth-child(7) {
        display: none;
      }
    `}
    
    &:hover {
    ${ClearParticipantIconWrapper}, ${SupervisorIconWrapper} {
      scale: 1;
      opacity: 1;
    }
  }
`;

interface AvatarProps {
  bgColor?: string;
  usersLeft?: number;
}

const Avatar = styled.div<AvatarProps>`
  position: absolute;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  font-size: 11px;
  font-weight: 500;
  line-height: 17px;
  color: var(--primary-statuses-white-0);

  border-radius: 50%;
  border: 1px solid var(--primary-statuses-white-0);
  background: ${p => (p.bgColor ? p.bgColor : `var(--button-text-graphite-secondary-text)`)};
`;

interface Props {
  model: MultiselectModel<number>;
  maxAvatarCount: number;
  withoutCurrent?: boolean;
  usersMeta?: UserDropdownItemMeta[];
  onChange?: (ids: number[]) => void;
}

const IMAGE_SIZE = 32;

const IMAGE_RES_MULTIPLIER = 4;
const IMAGE_SIZE_WITH_RES = IMAGE_SIZE * IMAGE_RES_MULTIPLIER;

const generateMoreCount = (moreCount: number): string =>
  moreCount < 100 ? '+' + moreCount : '+99';

const generateMoreTitle = ({
  ids,
  maxAvatarCount,
}: {
  ids: number[];
  maxAvatarCount: number;
}): string =>
  ids
    .slice(maxAvatarCount, ids.length)
    .map(id => userStore.getById(id).fullName)
    .join('\n');

const ParticipantsAvatarRows = observer((props: Props) => {
  const { model, maxAvatarCount, withoutCurrent, usersMeta, onChange } = props;

  const { t } = useTranslation();

  const { user: currentUser } = authStore;

  const isCurrentUser = useCallback(
    (id: number) => currentUser && id === currentUser.id,
    [currentUser]
  );

  const calculateContainerWidth = useCallback((): string => {
    const count = model.values.length;

    const overlap =
      count <= maxAvatarCount
        ? `calc((${AVATAR_SIZE} - ${OVERLAP}) * ${count - 1})`
        : `calc((${AVATAR_SIZE} - ${OVERLAP}) * ${maxAvatarCount})`;

    if (count <= maxAvatarCount) return `calc(${AVATAR_SIZE} * ${count} - ${overlap})`;

    return `calc(${AVATAR_SIZE} * ${maxAvatarCount + 1} - ${overlap})`;
  }, [model.values, maxAvatarCount]);

  const getHandleRemoveParticipantHandler = useCallback<
    (id: number) => (e: MouseEvent<HTMLButtonElement>) => void
  >(
    (id: number) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (withoutCurrent && isCurrentUser(id)) return;

      model.values = model.values.filter(v => v !== id);

      onChange?.(model.values);
    },
    [isCurrentUser, model, onChange, withoutCurrent]
  );

  const isImportant = useCallback(
    (id: number) => {
      const meta = usersMeta?.find(u => u.id === id);

      // if we can't select user we consider it important
      if (meta) return !meta.canSelect;

      return false;
    },
    [usersMeta]
  );

  const getUserMetaAnnotation = useCallback(
    (id: number) => {
      const meta = usersMeta?.find(u => u.id === id);

      if (meta) return meta.annotation;

      return null;
    },
    [usersMeta]
  );

  const isWithoutCurrentAndIsCurrent = useCallback(
    (id: number) => withoutCurrent && isCurrentUser(id),
    [withoutCurrent, isCurrentUser]
  );

  const moreCount = useMemo<number>(
    () => model.values.length - maxAvatarCount,
    [model.values, maxAvatarCount]
  );

  return (
    <AvatarsContainer $width={calculateContainerWidth()}>
      {model.values.map((v, idx) => {
        const user = userStore.getById(v);

        const { avatarUrl } = user.getAvatar();
        const initials = AvatarUtil.extractInitials(user.firstName, user.lastName);
        const initialsAvatarBgColor = AvatarUtil.getInitialsBackground(initials);

        return idx > maxAvatarCount ? null : (
          <AvatarWrapper key={user.id}>
            {moreCount > 1 && idx === maxAvatarCount ? (
              <Avatar
                key={user.id}
                title={generateMoreTitle({ ids: model.values, maxAvatarCount })}
              >
                {generateMoreCount(moreCount)}
              </Avatar>
            ) : (
              <>
                {avatarUrl ? (
                  <Avatar
                    as="img"
                    title={user.fullName}
                    alt={`${user.firstName} avatar`}
                    src={`${avatarUrl}?width=${IMAGE_SIZE_WITH_RES}&height=${IMAGE_SIZE_WITH_RES}`}
                  />
                ) : (
                  <Avatar title={user.fullName} bgColor={initialsAvatarBgColor}>
                    {initials}
                  </Avatar>
                )}

                {onChange && !isWithoutCurrentAndIsCurrent(user.id) && !isImportant(user.id) && (
                  <ClearParticipantIconWrapper onClick={getHandleRemoveParticipantHandler(user.id)}>
                    <ClearParticipantIcon />
                  </ClearParticipantIconWrapper>
                )}

                {(isImportant(user.id) || isWithoutCurrentAndIsCurrent(user.id)) && (
                  <MyTooltip
                    multiline
                    withinPortal
                    maxWidth={320}
                    label={
                      isWithoutCurrentAndIsCurrent(user.id)
                        ? t('current_chat_user_hint')
                        : getUserMetaAnnotation(user.id)
                    }
                  >
                    <SupervisorIconWrapper>
                      <SupervisorStar />
                    </SupervisorIconWrapper>
                  </MyTooltip>
                )}
              </>
            )}
          </AvatarWrapper>
        );
      })}
    </AvatarsContainer>
  );
});

ParticipantsAvatarRows.displayName = 'ParticipantsAvatarRows';
export { ParticipantsAvatarRows };

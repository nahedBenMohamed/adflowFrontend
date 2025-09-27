import { userStore } from '@/app';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ArrowDropDownIcon } from '../../../../assets';
import { TruncateMixin } from '../../../mixins';
import type { Option, User } from '../../../models';
import type { Nullable } from '../../../types';
import { AvatarCircle } from '../../AvatarCircle/AvatarCircle';
import { CreateButton } from '../../Buttons/CreateButton/CreateButton';
import { MyDropdown } from '../../MyDropdown/MyDropdown';
import { CLEAR_BUTTON_CLASS, ClearButton } from '../MySelect/components';
import { UserList, type UserListSelectProps } from './components';

type ValueBlockVariant = 'default' | 'outlined';

interface OutlinedBlockProps {
  $variant: ValueBlockVariant;
  $width?: number;
}

const OutlinedBlock = styled.div<OutlinedBlockProps>`
  width: ${p => p.$width && p.$width}px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  padding: 4px 8px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: var(--border-radius-element);
  border-color: ${p => (p.$variant === 'default' ? 'transparent' : 'var(--graphite-graphite-120)')};
  transition: var(--transition-200);
`;

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  ${TruncateMixin};
`;

const ArrowIconWrapper = styled.div<{ $variant: ValueBlockVariant }>`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  transition: var(--transition-200);

  svg {
    opacity: ${p => (p.$variant === 'default' ? 0 : 1)};

    transition:
      opacity var(--transition-200),
      transform 0.5s;

    path {
      transition: var(--transition-200);
    }
  }
`;

interface ButtonFrameProps {
  $active: boolean;
  $disabled?: boolean;
  $noActiveShadow?: boolean;
}

const ButtonFrame = styled.div<ButtonFrameProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  .${CLEAR_BUTTON_CLASS} {
    opacity: 0;
    scale: 0;
  }

  &:hover {
    cursor: pointer;

    ${OutlinedBlock} {
      border-color: var(--button-text-graphite-secondary-text);
    }

    ${Value} {
      color: var(--graphite-graphite-840);
    }

    ${ArrowIconWrapper} {
      svg {
        opacity: 1;
      }
    }

    .${CLEAR_BUTTON_CLASS} {
      opacity: 1;
      scale: 1;
    }
  }

  ${p =>
    p.$active &&
    css`
      &,
      &:hover {
        ${OutlinedBlock} {
          border-color: var(--button-text-green-active);
          box-shadow: ${p.$noActiveShadow
            ? 'none'
            : '1px 1px 6px 0px var(--primary-statuses-green-520)'};
        }

        ${Value} {
          color: var(--graphite-graphite-840);
        }

        ${ArrowIconWrapper} {
          svg {
            opacity: 1;
            transform: rotate(180deg);

            path {
              fill: var(--graphite-graphite-840);
            }
          }
        }
      }
    `}

  ${p => p.$disabled && `pointer-events: none`};
`;

interface Props {
  users: User[];
  width?: number;
  disabled?: boolean;
  showValue?: boolean;
  selectedId?: number;
  hideAvatar?: boolean;
  withinPortal?: boolean;
  noActiveShadow?: boolean;
  variant?: ValueBlockVariant;
  maxHeight?: CSSProperties['maxHeight'];
  onSelect: (user: User) => void;
  onClear?: () => void;
}

const UserPicker = observer((props: Props) => {
  const {
    users,
    width,
    disabled,
    showValue = true,
    selectedId,
    hideAvatar,
    withinPortal,
    noActiveShadow,
    variant = 'default',
    maxHeight,
    onSelect,
    onClear,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.common.user_picker',
  });

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const handleSelect = useCallback(
    (option: Option<Nullable<number>>) => {
      const user = users.find(i => i.id === option.value);

      if (!user)
        throw new Error(`User with id ${option.value} was not found, failed to handleSelect`);

      onSelect(user);
      hide();
    },
    [users, onSelect, hide]
  );

  const user = selectedId ? userStore.getById(selectedId) : null;

  const selectProps = useMemo<UserListSelectProps>(
    () => ({
      selectedUserId: user ? user.id : null,
      onSelect: handleSelect,
    }),
    [user, handleSelect]
  );

  return (
    <MyDropdown
      opened={opened}
      disabled={disabled}
      width={width ?? 256}
      position="bottom-start"
      withinPortal={withinPortal}
      Button={
        user ? (
          <ButtonFrame $disabled={disabled} $active={opened} $noActiveShadow={noActiveShadow}>
            {!hideAvatar && <AvatarCircle avatar={user.getAvatar()} size="large" />}

            {showValue && (
              <OutlinedBlock $variant={variant} $width={width}>
                <Value>{user.fullName}</Value>

                <RightBlock>
                  {onClear && <ClearButton onClick={onClear} />}

                  <ArrowIconWrapper $variant={variant}>
                    <ArrowDropDownIcon />
                  </ArrowIconWrapper>
                </RightBlock>
              </OutlinedBlock>
            )}
          </ButtonFrame>
        ) : (
          <CreateButton customTitle={t('add')} />
        )
      }
      show={show}
      hide={hide}
    >
      <UserList users={users} maxHeight={maxHeight} selectProps={selectProps} />
    </MyDropdown>
  );
});

UserPicker.displayName = 'UserPicker';
export { UserPicker };

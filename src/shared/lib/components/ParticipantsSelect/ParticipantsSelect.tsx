import { userStore } from '@/app';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import { AddUserIcon } from '../../../assets';
import type { MultiselectModel, User } from '../../models';
import type { UserDropdownItemMeta } from '../Form/UserPicker/components';
import { RoundedDashedFrame } from '../PickerButton/components';
import { UsersMultiselectDropdown } from '../UsersMultiselectDropdown/UsersMultiselectDropdown';
import { ParticipantsAvatarRows } from './components';

interface RootProps {
  $active: boolean;
  $disabled: boolean;
  $error?: boolean;
}

const Root = styled.div<RootProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg {
    path {
      transition: var(--transition-200);
    }

    rect {
      transition: var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;

    ${p =>
      !p.$active &&
      !p.$error &&
      css`
        color: var(--button-text-green-hover);

        svg {
          path {
            &:not(.workspace__ClearParticipantIcon--path) {
              fill: var(--button-text-green-hover);
            }
          }

          rect {
            stroke: var(--button-text-green-hover);
          }
        }
      `}
  }

  ${p => p.$disabled && `pointer-events: none`};

  ${p =>
    p.$error &&
    css`
      color: var(--button-text-red-hover);

      svg {
        path {
          fill: var(--button-text-red-hover);
        }

        rect {
          stroke: var(--button-text-red-hover);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-graphite-primary-text);

      svg {
        path {
          fill: var(--button-text-graphite-primary-text);
        }

        rect {
          stroke: var(--button-text-graphite-primary-text);
        }
      }
    `}
`;

interface ShowHideHandlers {
  opened: boolean;
  show: () => void;
  hide: () => void;
}

interface Props {
  model: MultiselectModel<number>;
  withinPortal?: boolean;
  iconOutlined?: boolean;
  disabled?: boolean;
  placeholder?: string;
  showPlaceholder?: boolean;
  withoutCurrent?: boolean;
  defaultMinified?: boolean;
  maxAvatarCount?: number;
  usersMeta?: UserDropdownItemMeta[];
  specificUsers?: User[];
  overrideShowHideHandlers?: ShowHideHandlers;
  handleChange?: (selectedIds: number[]) => void;
}

const ParticipantsSelect = observer((props: Props) => {
  const {
    model,
    withinPortal = true,
    iconOutlined = true,
    disabled = false,
    placeholder,
    showPlaceholder,
    withoutCurrent,
    defaultMinified,
    maxAvatarCount,
    usersMeta,
    specificUsers,
    overrideShowHideHandlers,
    handleChange,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.project_fields_block',
  });

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const users = useMemo<User[]>(
    () => (withoutCurrent ? userStore.activeUsersWithoutCurrent : userStore.activeUsers),
    [withoutCurrent]
  );

  const { width } = useWindowSize();
  const minified = defaultMinified || width < 1340;

  const MAX_INDEX = maxAvatarCount ?? (minified ? 4 : 6);

  const menuShowHideProps = useMemo<ShowHideHandlers>(
    () =>
      overrideShowHideHandlers
        ? overrideShowHideHandlers
        : {
            opened,
            show,
            hide,
          },
    [overrideShowHideHandlers, opened, show, hide]
  );

  return (
    <UsersMultiselectDropdown
      model={model}
      disabled={disabled}
      usersMeta={usersMeta}
      dropdownMinWidth="248px"
      withinPortal={withinPortal}
      users={specificUsers ?? users}
      opened={menuShowHideProps.opened}
      hide={menuShowHideProps.hide}
      show={menuShowHideProps.show}
      handleChange={handleChange}
    >
      <Root $active={opened} $disabled={disabled} $error={!model.isValid}>
        {!disabled && (
          <RoundedDashedFrame active={opened} error={!model.isValid} outlined={iconOutlined}>
            <AddUserIcon />
          </RoundedDashedFrame>
        )}

        {model.values.length ? (
          <ParticipantsAvatarRows
            model={model}
            usersMeta={usersMeta}
            maxAvatarCount={MAX_INDEX}
            withoutCurrent={withoutCurrent}
            onChange={handleChange}
          />
        ) : (
          showPlaceholder && (placeholder ?? t('placeholders.participants'))
        )}
      </Root>
    </UsersMultiselectDropdown>
  );
});

ParticipantsSelect.displayName = 'ParticipantsSelect';
export { ParticipantsSelect };

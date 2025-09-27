import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { useMultichatContext } from '@/modules/multichat';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Option } from '../../../../models';
import { AvatarCircle } from '../../../AvatarCircle/AvatarCircle';
import { MyDropdown } from '../../../MyDropdown/MyDropdown';
import { MyDropdownList } from '../../../MyDropdown/components';
import { ProfileModal } from '../../../ProfileModal/ProfileModal';

type AvatarBlockOptionValue = 'profile' | 'logout';

const AvatarBlock = observer(() => {
  const { t } = useTranslation();

  const { user: currentUser } = authStore;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [isDropdownOpened, { close: hideDropdown, open: showDropdown }] = useDisclosure(false);
  const [isProfileModalOpened, { close: hideProfileModal, open: showProfileModal }] =
    useDisclosure(false);

  const options = useMemo<Option<AvatarBlockOptionValue>[]>(
    () => [
      {
        label: t('profile'),
        value: 'profile',
      },
      {
        label: t('log_out'),
        value: 'logout',
      },
    ],
    [t]
  );

  const { opened: multichatOpened, hide: hideMultichatModal } = useMultichatContext();

  const onSelect = useCallback(
    (option: Option<AvatarBlockOptionValue>) => {
      if (option.value === 'logout') {
        hideDropdown();

        authStore.logout();
        navigate(routes.login);

        // clear all query caches to prevent data leaks
        queryClient.clear();

        if (multichatOpened) hideMultichatModal();
      }

      if (option.value === 'profile') {
        hideDropdown();
        showProfileModal();
      }
    },
    [multichatOpened, queryClient, hideDropdown, hideMultichatModal, navigate, showProfileModal]
  );

  if (!currentUser) return null;

  return (
    <>
      <MyDropdown
        withinPortal
        position="bottom-end"
        opened={isDropdownOpened}
        Button={
          <div>
            <AvatarCircle
              hoverable
              size="large"
              active={isDropdownOpened}
              avatar={currentUser.getAvatar()}
            />
          </div>
        }
        hide={hideDropdown}
        show={showDropdown}
      >
        <MyDropdownList options={options} minWidth="104px" onSelect={onSelect} />
      </MyDropdown>

      {isProfileModalOpened && (
        <ProfileModal isOpened={isProfileModalOpened} onClose={hideProfileModal} />
      )}
    </>
  );
});

AvatarBlock.displayName = 'AvatarBlock';
export { AvatarBlock };

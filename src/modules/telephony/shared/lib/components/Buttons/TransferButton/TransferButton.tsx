import { userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { voximplantConnectorStore } from '@/modules/telephony/store';
import { MyDropdown, UserList, type Nullable, type User, type UserListSelectProps } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RedirectLargeIcon, RedirectSmallIcon } from '../../../../assets';
import type { TelephonyFunctionalButtonProps, VoximplantUser } from '../../../models';
import { TelephonyFunctionalButton } from '../TelephonyFunctionalButton/TelephonyFunctionalButton';
import { TransferConfirmationControls } from './components';

const Root = styled.div`
  width: 320px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  width: fit-content;
  height: fit-content;
`;

interface Props extends Omit<TelephonyFunctionalButtonProps, 'icons'> {
  voximplantUsers?: VoximplantUser[];
}

const TransferButton = observer((props: Props) => {
  const { disabled, voximplantUsers, ...rest } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal',
  });

  const { user: currentUser } = authStore;

  const [opened, { open: show, close: hide }] = useDisclosure(false);

  const [selectedUserId, setSelectedUserId] = useState<Nullable<number>>(null);

  const users = useMemo<User[]>(
    () =>
      voximplantUsers
        ?.filter(u => u.userId !== currentUser?.id)
        .map(u => userStore.getById(u.userId)) ?? [],
    [voximplantUsers, currentUser]
  );

  const handleHide = useCallback(() => {
    hide();
    setSelectedUserId(null);
  }, [hide]);

  const handleTransfer = useCallback(() => {
    if (!selectedUserId) throw new Error(`No user selected to transfer call to`);

    voximplantConnectorStore.transferCall(selectedUserId);
    hide();
  }, [hide, selectedUserId]);

  const selectProps = useMemo<UserListSelectProps>(
    () => ({
      selectedUserId,
      onSelect: o => setSelectedUserId(o.value),
    }),
    [selectedUserId]
  );

  const buttonDisabled = useMemo<boolean>(
    () => disabled || !voximplantUsers || !voximplantUsers.length,
    [disabled, voximplantUsers]
  );

  return (
    <MyDropdown
      withinPortal
      position="bottom-start"
      opened={buttonDisabled ? false : opened}
      Button={
        <ButtonWrapper
          // "disabled" is true when call is not yet connected
          title={
            buttonDisabled
              ? disabled
                ? t('connect_to_transfer')
                : t('no_operators_to_transfer_call_to')
              : undefined
          }
        >
          <TelephonyFunctionalButton
            {...rest}
            disabled={buttonDisabled}
            icons={{
              large: <RedirectLargeIcon />,
              small: <RedirectSmallIcon />,
            }}
          />
        </ButtonWrapper>
      }
      show={show}
      hide={handleHide}
    >
      <Root>
        <UserList maxHeight="300px" users={users} selectProps={selectProps} />

        {selectedUserId && (
          <TransferConfirmationControls onTransfer={handleTransfer} onCancel={handleHide} />
        )}
      </Root>
    </MyDropdown>
  );
});

TransferButton.displayName = 'TransferButton';
export { TransferButton };

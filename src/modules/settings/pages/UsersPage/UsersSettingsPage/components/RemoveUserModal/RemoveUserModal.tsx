import {
  DialogModalPrimary,
  ModalAnnotation,
  ModalContentTitle,
  ModalRemoveUserIcon,
  MyUsersSelect,
  type SelectModel,
  type User,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  padding: 8px 24px 32px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SelectWrapper = styled.div`
  margin: 16px 0 0;
`;

interface Props {
  users: User[];
  loading: boolean;
  isOpened: boolean;
  selectedUserId: SelectModel;
  onClose: () => void;
  onApprove: () => void;
}

const RemoveUserModal = observer((props: Props) => {
  const { isOpened, users, loading, selectedUserId, onClose, onApprove } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.users_settings_page.ui.remove_user_modal',
  });

  return (
    <DialogModalPrimary
      isDanger
      maxHeight="420px"
      isOpened={isOpened}
      approveTitle={t('remove')}
      approveDisabled={!selectedUserId.value || loading}
      approveLoading={loading}
      onClose={onClose}
      onApprove={onApprove}
    >
      <Root>
        <ModalRemoveUserIcon />

        <Content>
          <ModalContentTitle>{t('title')}</ModalContentTitle>
          <ModalAnnotation>{t('annotation')}</ModalAnnotation>

          <SelectWrapper>
            <MyUsersSelect
              width="240px"
              users={users}
              variant="outlined"
              model={selectedUserId}
              placeholder={t('placeholder')}
            />
          </SelectWrapper>
        </Content>
      </Root>
    </DialogModalPrimary>
  );
});

RemoveUserModal.displayName = 'RemoveUserModal';
export { RemoveUserModal };

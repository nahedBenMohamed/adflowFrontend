import { DialogModalSecondary, MyInput, type InputModel } from '@/shared';
import { FocusTrap } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, type KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  padding: 16px 32px;
`;

interface Props {
  groupName: InputModel;
  opened: boolean;
  loading: boolean;
  hide: () => void;
  onApprove: () => void;
}

const AddAvatarAndNameModal = observer((props: Props) => {
  const { groupName, opened, loading, hide, onApprove } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.create_amwork_chat_button.modals',
  });

  const handleEnter = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key === 'Enter') onApprove();
    },
    [onApprove]
  );

  return (
    <DialogModalSecondary
      maxHeight="176px"
      isOpened={opened}
      loading={loading}
      Header={t('customize_chat')}
      approveTitle={t('continue')}
      approveDisabled={!groupName.trimmedValue.length || loading}
      onClose={hide}
      onApprove={onApprove}
    >
      <Root>
        <FocusTrap>
          <MyInput
            model={groupName}
            variant="outlined"
            placeholder={t('placeholders.group_name')}
            onKeyDown={handleEnter}
          />
        </FocusTrap>
      </Root>
    </DialogModalSecondary>
  );
});

AddAvatarAndNameModal.displayName = 'AddAvatarAndNameModal';
export { AddAvatarAndNameModal };

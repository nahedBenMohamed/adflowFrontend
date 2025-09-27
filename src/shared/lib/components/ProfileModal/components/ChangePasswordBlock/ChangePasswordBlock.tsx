import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { InputModel } from '../../../../models';
import { PrimaryButton } from '../../../Buttons/PrimaryButton/PrimaryButton';
import { MyInput } from '../../../Form/Input/MyInput/MyInput';
import { ProfileModalFormGroup } from '../ProfileModalFormGroup/ProfileModalFormItem';

const Root = styled.div`
  width: 224px;

  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  // for alignment with the left block content, will likely be changed
  gap: 29px;
`;

interface Props {
  form: ChangePasswordForm;
}

export interface ChangePasswordForm {
  current: InputModel;
  new: InputModel;
  confirm: InputModel;
}

const ChangePasswordBlock = (props: Props) => {
  const { form } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'profile_modal',
  });

  const [isChangePasswordMode, { open: showChangePasswordMode }] = useDisclosure(false);

  return (
    <Root>
      {isChangePasswordMode ? (
        <>
          <ProfileModalFormGroup label={t('current_password')}>
            <MyInput type="password" model={form.current} variant="outlined" />
          </ProfileModalFormGroup>

          <ProfileModalFormGroup label={t('new_password')}>
            <MyInput type="password" model={form.new} variant="outlined" />
          </ProfileModalFormGroup>

          <ProfileModalFormGroup label={t('confirm_password')}>
            <MyInput type="password" model={form.confirm} variant="outlined" />
          </ProfileModalFormGroup>
        </>
      ) : (
        <ProfileModalFormGroup label={t('password')}>
          <PrimaryButton variant="outlined" onClick={showChangePasswordMode}>
            {t('change_password')}
          </PrimaryButton>
        </ProfileModalFormGroup>
      )}
    </Root>
  );
};

export { ChangePasswordBlock };

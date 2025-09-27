import { FeedbackType, UserLimitFeedback, feedbackApi } from '@/app';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InputModel } from '../../../../models';
import { MyInput } from '../../../Form/Input/MyInput/MyInput';
import { PhoneNumberInput } from '../../../Form/PhoneNumberInput/PhoneNumberInput';
import { FormItem, FormItemLabel } from '../../../Form/components';
import { DialogModalPrimary } from '../../Dialog/DialogModalPrimary/DialogModalPrimary';

const Root = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 16px 32px;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 500;
  line-height: 29px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  isOpened: boolean;
  onClose: () => void;
}

const AddUserToPlanModal = observer((props: Props) => {
  const { isOpened, onClose } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.add_user_to_plan_modal',
  });

  const form = useLocalObservable(() => ({
    name: InputModel.create().required(),
    phone: InputModel.create().phoneInternational(),
    email: InputModel.create().email(),
    numberOfUsers: InputModel.create().required(),
  }));

  const onApprove = () => {
    if (
      form.name.validate() &&
      form.phone.validate() &&
      form.email.validate() &&
      form.numberOfUsers.validate()
    ) {
      const payload = new UserLimitFeedback({
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value,
        userNumber: form.numberOfUsers.value,
      });
      feedbackApi.sendFeedback({ type: FeedbackType.USER_LIMIT, payload });
      onClose();
    }
  };

  return (
    <DialogModalPrimary
      isOpened={isOpened}
      onClose={onClose}
      onApprove={onApprove}
      approveTitle={t('send')}
      hideCancel
      width="480px"
      maxHeight="550px"
    >
      <Root>
        <Title>{t('title')}</Title>

        <FormItem gap="8px">
          <FormItemLabel>{t('name')}</FormItemLabel>
          <MyInput model={form.name} hasBorderBottom placeholder={t('placeholder')} />
        </FormItem>

        <FormItem gap="8px">
          <FormItemLabel>{t('phone')}</FormItemLabel>
          <PhoneNumberInput model={form.phone} determineCountry />
        </FormItem>

        <FormItem gap="8px">
          <FormItemLabel>{t('email')}</FormItemLabel>
          <MyInput model={form.email} hasBorderBottom placeholder="forexample@mail.com" />
        </FormItem>

        <FormItem gap="8px">
          <FormItemLabel>{t('number_of_users')}</FormItemLabel>
          <MyInput model={form.numberOfUsers} hasBorderBottom />
        </FormItem>
      </Root>
    </DialogModalPrimary>
  );
});

AddUserToPlanModal.displayName = 'AddUserToPlanModal';
export { AddUserToPlanModal };

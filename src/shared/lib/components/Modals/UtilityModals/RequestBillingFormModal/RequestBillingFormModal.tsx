import {
  FeedbackType,
  TrialExpiredFeedback,
  appStore,
  feedbackApi,
  subscriptionStore,
} from '@/app';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { validateForm } from '../../../../helpers';
import { InputModel, SelectModel, UtcDate, type Option } from '../../../../models';
import { envUtil } from '../../../../utils';
import { MyInput } from '../../../Form/Input/MyInput/MyInput';
import { MyRadio } from '../../../Form/MyRadio/MyRadio';
import { MySelect } from '../../../Form/MySelect/MySelect/MySelect';
import { PhoneFieldInput } from '../../../Form/PhoneFieldInput/PhoneFieldInput';
import { FormItem, FormItemLabel } from '../../../Form/components';
import { SpanWithEllipsis } from '../../../SpanWithEllipsis/SpanWithEllipsis';
import { DialogModalSecondary } from '../../Dialog/DialogModalSecondary/DialogModalSecondary';

const Subtitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 24px 32px;
`;

const FormItemsWrapper = styled.div`
  display: flex;
  gap: 32px;
`;

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  isOpened: boolean;
  onClose: () => void;
}

type Plans = 'basic' | 'business' | 'premium' | 'enterprise';

const planOptions: Option<Plans>[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'business', label: 'Business' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
];

interface InitialForm {
  name: InputModel;
  phone: InputModel;
  email: InputModel;
  numberOfUsers: InputModel;
  period: InputModel;
  plan: SelectModel;
}

const RequestBillingFormModal = observer((props: Props) => {
  const { isOpened, onClose } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'trial_period_over_modal',
  });

  const form = useLocalObservable<InitialForm>(() => ({
    name: InputModel.create().required(),
    phone: InputModel.create().phoneInternational().required(),
    email: InputModel.create().email().required(),
    numberOfUsers: InputModel.create().required(),
    period: InputModel.create('yearly').required(),
    plan: SelectModel.create('basic').required(),
  }));

  const [isSending, setIsSending] = useState(false);

  if (!appStore.isLoaded) return null;

  const subscription = subscriptionStore.subscription;

  const isTrial = subscription?.isTrial;
  const isValid = subscription?.isValid;
  const expiredAt = subscription?.expiredAt;

  const onApprove = async (): Promise<void> => {
    if (!validateForm(form)) return;

    try {
      setIsSending(true);

      await feedbackApi.sendFeedback({
        type: FeedbackType.TRIAL_EXPIRED,
        payload: new TrialExpiredFeedback({
          name: form.name.value,
          phone: form.phone.value,
          email: form.email.value,
          userNumber: form.numberOfUsers.value,
          subscribe: form.period.value,
          plan: form.plan.value,
        }),
      });
    } catch (e) {
      throw new Error(`Failed to submit trial expired form, ${e}`);
    } finally {
      setIsSending(false);
    }

    onClose();
  };

  const getTitleMessage = (): string => {
    if (expiredAt && isValid) {
      const left = Math.ceil(expiredAt.diffDays(UtcDate.now()));

      return left === 1 ? t('trial_left_one', { left }) : t('trial_left', { left });
    } else if (isTrial) {
      return t('trial_over');
    }

    return t('subscription_over');
  };

  return (
    <DialogModalSecondary
      hideCancel
      width="500px"
      maxHeight="680px"
      loading={isSending}
      isOpened={isOpened}
      approveTitle={t('send')}
      approveDisabled={isSending}
      Header={getTitleMessage()}
      onClose={onClose}
      onApprove={onApprove}
    >
      <Form>
        <Subtitle>{t('title', { company: envUtil.appName })}</Subtitle>

        <FormItem gap="8px">
          <FormItemLabel>{t('name')}</FormItemLabel>
          <MyInput model={form.name} variant="outlined" placeholder={t('placeholders.name')} />
        </FormItem>

        <FormItem gap="8px">
          <FormItemLabel>{t('phone')}</FormItemLabel>
          <PhoneFieldInput model={form.phone} />
        </FormItem>

        <FormItem gap="8px">
          <FormItemLabel>{t('email')}</FormItemLabel>
          <MyInput variant="outlined" model={form.email} placeholder="forexample@mail.com" />
        </FormItem>

        <FormItemsWrapper>
          <FormItem gap="8px">
            <FormItemLabel>{t('number_of_users')}</FormItemLabel>
            <MyInput model={form.numberOfUsers} variant="outlined" width="184px" />
          </FormItem>

          <FormItem gap="8px">
            <FormItemLabel>{t('subscribe')}</FormItemLabel>

            <RadioWrapper>
              <MyRadio model={form.period} value="yearly" />
              <SpanWithEllipsis text={t('yearly')} />
            </RadioWrapper>

            <RadioWrapper>
              <MyRadio model={form.period} value="monthly" />
              <SpanWithEllipsis text={t('monthly')} />
            </RadioWrapper>
          </FormItem>
        </FormItemsWrapper>

        <FormItem>
          <FormItemLabel>{t('choose_plan')}</FormItemLabel>
          <MySelect
            withinPortal
            width="184px"
            model={form.plan}
            variant="outlined"
            options={planOptions}
          />
        </FormItem>
      </Form>
    </DialogModalSecondary>
  );
});

RequestBillingFormModal.displayName = 'RequestBillingFormModal';
export { RequestBillingFormModal };

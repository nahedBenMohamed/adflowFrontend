import { SiteFormDataDto, SiteFormFieldDataDto, formApi, generalSettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  DialogModalSecondary,
  HeadlessFormItem,
  InputModel,
  MyInput,
  MyTextArea,
  envUtil,
  validateForm,
  type Nullable,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { RequestSetupFormTitleKey } from '../../../../types';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px 32px;
`;

const commentPrefix: Record<RequestSetupFormTitleKey, string> = {
  request_setup: 'Заказ настройки системы',
  request_billing_help: 'Запрос помощи с подпиской',
  request_telephony: 'Запрос настройки телефонии',
  request_integration: 'Запрос разработки интеграции',
  request_api_integration: 'Запрос интеграции по API',
};

interface Props {
  isOpened: boolean;
  titleKey: RequestSetupFormTitleKey;
  onClose: () => void;
}

interface InitialForm {
  name: InputModel;
  phone: InputModel;
  email: InputModel;
  comment: InputModel;
}

const RequestSetupFormModal = observer((props: Props) => {
  const { isOpened, titleKey, onClose } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.request_setup_form.modal',
  });

  const { user } = authStore;
  const { account } = generalSettingsStore;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null);

  const form = useLocalObservable<InitialForm>(() => ({
    comment: InputModel.create(),
    phone: InputModel.create(user?.phone).required(),
    name: InputModel.create(user?.fullName).required(),
    email: InputModel.create(user?.email).email().required(),
  }));

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm(form) || !account) return;

    setErrorMessage(null);

    try {
      setIsSubmitting(true);

      const dto = new SiteFormDataDto({
        fields: [
          new SiteFormFieldDataDto({
            id: envUtil.requestSetupHeadlessFormNameFieldId,
            value: form.name.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestSetupHeadlessFormPhoneFieldId,
            value: form.phone.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestSetupHeadlessFormEmailFieldId,
            value: form.email.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestSetupHeadlessFormCommentFieldId,
            value: `${commentPrefix[titleKey]}: ${form.comment.trimmedValue}`,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestSetupHeadlessFormSubdomainFieldId,
            value: account.subdomain,
          }),
        ],
      });

      const { result, message } = await formApi.sendRequestSetupHeadlessForm(dto);

      if (!result) {
        message ? setErrorMessage(message) : setErrorMessage(t('error'));

        return;
      } else {
        onClose();
      }
    } catch (e) {
      setErrorMessage(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogModalSecondary
      width="100%"
      maxHeight="100%"
      maxWidth="476px"
      isOpened={isOpened}
      height="fit-content"
      Header={t(titleKey, { company: envUtil.appName })}
      loading={isSubmitting}
      errorMessage={errorMessage}
      approveDisabled={isSubmitting}
      approveTitle={t('send_request')}
      onClose={onClose}
      onApprove={handleSubmit}
    >
      <Root>
        <HeadlessFormItem text={t('full_name')}>
          <MyInput model={form.name} variant="outlined" placeholder={t('placeholders.full_name')} />
        </HeadlessFormItem>

        <HeadlessFormItem text={t('phone')}>
          <MyInput
            type="tel"
            variant="outlined"
            model={form.phone}
            placeholder="+__ (___) ___-__-__"
          />
        </HeadlessFormItem>

        <HeadlessFormItem text={t('email')}>
          <MyInput
            type="email"
            model={form.email}
            variant="outlined"
            placeholder="forexample@mail.com"
          />
        </HeadlessFormItem>

        <HeadlessFormItem text={t('comment')}>
          <MyTextArea
            maxRows={4}
            minRows={4}
            variant="outlined"
            model={form.comment}
            placeholder={t(`placeholders.comment.${titleKey}`)}
          />
        </HeadlessFormItem>
      </Root>
    </DialogModalSecondary>
  );
});

RequestSetupFormModal.displayName = 'RequestSetupFormModal';
export { RequestSetupFormModal };

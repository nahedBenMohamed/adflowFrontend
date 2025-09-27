import { SiteFormDataDto, SiteFormFieldDataDto, formApi, generalSettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  DialogModalSecondary,
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
import { HeadlessFormItem } from '../components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px 32px;
`;

const Annotation = styled.i`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-style: italic;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  isOpened: boolean;
  header?: string;
  onClose: () => void;
}

interface InitialForm {
  name: InputModel;
  phone: InputModel;
  email: InputModel;
  comment: InputModel;
}

const RequestBpmnFormModal = observer((props: Props) => {
  const { isOpened, header, onClose } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page.request_bpmn_form_modal',
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
            id: envUtil.requestBpmnWorkspaceFormNameFieldId,
            value: form.name.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestBpmnWorkspaceFormPhoneFieldId,
            value: form.phone.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestBpmnWorkspaceFormEmailFieldId,
            value: form.email.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestBpmnWorkspaceFormCommentFieldId,
            value: form.comment.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestBpmnWorkspaceFormDomainFieldId,
            value: account.subdomain,
          }),
        ],
      });

      const { result, message } = await formApi.sendBpmnRequestForm(dto);

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
      loading={isSubmitting}
      errorMessage={errorMessage}
      approveDisabled={isSubmitting}
      Header={header ?? t('header')}
      approveTitle={t('send_request')}
      onClose={onClose}
      onApprove={handleSubmit}
    >
      <Root>
        <Annotation>{envUtil.appRUSegment ? t('ru_price_full') : t('us_price_full')}</Annotation>

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
            placeholder={t('placeholders.comment')}
          />
        </HeadlessFormItem>
      </Root>
    </DialogModalSecondary>
  );
});

export { RequestBpmnFormModal };

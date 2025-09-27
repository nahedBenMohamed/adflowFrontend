import { userStore } from '@/app';
import {
  DialogModalSecondary,
  envUtil,
  InputModel,
  MultiselectModel,
  MyInput,
  MySelect,
  SelectModel,
  UsersMultiselect,
  UuidUtil,
  validateForm,
  type Nullable,
  type Option,
} from '@/shared';
import { FocusTrap } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  CreateVoximplantSIPDto,
  UpdateVoximplantSIPDto,
  useCreateVoximplantSIPRegistration,
  useUpdateVoximplantSIPRegistration,
} from '../../../../api';
import { getMiniPbxIconByType, PbxProviderType, type VoximplantSIP } from '../../../../shared';
import { voximplantConnectorStore } from '../../../../store';
import { VoximplantBillingManagementLink } from '../LinkToVoximplantSipRegistrationsPortal/LinkToVoximplantSipRegistrationsPortal';
import { SipRegistrationModalFormItem } from '../SipRegistrationModalFormItem/SipRegistrationModalFormItem';

const Root = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px 32px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderIconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Delimiter = styled.hr`
  width: 100%;
  border-top: 1px solid var(--graphite-graphite-120);
`;

const Annotation = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const LastUpdatedAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  isOpened: boolean;
  providerType: PbxProviderType;
  sipRegistration: Nullable<VoximplantSIP>;
  onClose: () => void;
}

interface InitialForm {
  name: InputModel;
  proxy: InputModel;
  type: SelectModel;
  password: InputModel;
  authUser: InputModel;
  sipUserName: InputModel;
  outboundProxy: InputModel;
  userIds: MultiselectModel<number>;
}

const AddSipRegistrationModal = observer((props: Props) => {
  const { isOpened, providerType, sipRegistration, onClose } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_sip_registrations_page',
  });

  const { account } = voximplantConnectorStore;

  const {
    isPending: isCreating,
    isError: isCreatingError,
    mutateAsync: createVoximplantSIPRegistration,
  } = useCreateVoximplantSIPRegistration();
  const {
    isPending: isUpdating,
    isError: isUpdatingError,
    mutateAsync: updateVoximplantSIPRegistration,
  } = useUpdateVoximplantSIPRegistration();

  const form = useLocalObservable<InitialForm>(() => ({
    name: InputModel.create(
      sipRegistration?.name ?? t('default_name', { number: UuidUtil.generate6number() })
    ).required(),
    password: InputModel.create(),
    authUser: InputModel.create(sipRegistration?.registration?.authUser),
    proxy: InputModel.create(sipRegistration?.registration?.proxy).required(),
    userIds: MultiselectModel.createFromOptionalNullable(sipRegistration?.userIds),
    outboundProxy: InputModel.create(sipRegistration?.registration?.outboundProxy),
    sipUserName: InputModel.create(sipRegistration?.registration?.sipUsername).required(),
    type: SelectModel.create(
      sipRegistration?.type ?? providerType ?? PbxProviderType.UNKNOWN
    ).required(),
  }));

  const handleApprove = useCallback(async (): Promise<void> => {
    if (!validateForm(form)) return;

    if (sipRegistration) {
      const updateDto = new UpdateVoximplantSIPDto({
        type: form.type.value,
        name: form.name.trimmedValue,
        proxy: form.proxy.trimmedValue,
        sipUsername: form.sipUserName.trimmedValue,
        userIds: form.userIds.valuesOrUndefined,
        authUser: form.authUser.trimmedValue || undefined,
        password: form.password.trimmedValue || undefined,
        outboundProxy: form.outboundProxy.trimmedValue || undefined,
      });

      await updateVoximplantSIPRegistration({
        sipId: sipRegistration.id,
        dto: updateDto,
      });
    } else {
      const createDto = new CreateVoximplantSIPDto({
        type: form.type.value,
        name: form.name.trimmedValue,
        proxy: form.proxy.trimmedValue,
        sipUsername: form.sipUserName.trimmedValue,
        userIds: form.userIds.valuesOrUndefined,
        authUser: form.authUser.trimmedValue || undefined,
        password: form.password.trimmedValue || undefined,
        outboundProxy: form.outboundProxy.trimmedValue || undefined,
      });

      await createVoximplantSIPRegistration(createDto);
    }

    onClose();
  }, [
    form,
    sipRegistration,
    onClose,
    createVoximplantSIPRegistration,
    updateVoximplantSIPRegistration,
  ]);

  const providerOptions = useMemo<Option<PbxProviderType>[]>(
    () =>
      envUtil.integrationsShowRuPbxProviders
        ? Object.values(PbxProviderType).map<Option<PbxProviderType>>(p => ({
            label: t(`providers.${p}`),
            value: p,
          }))
        : [
            {
              label: t(`providers.${PbxProviderType.UNKNOWN}`),
              value: PbxProviderType.UNKNOWN,
            },
            {
              label: t(`providers.${PbxProviderType.UIS}`),
              value: PbxProviderType.UIS,
            },
            {
              label: t(`providers.${PbxProviderType.ZADARMA}`),
              value: PbxProviderType.ZADARMA,
            },
          ],
    [t]
  );

  const loading = isCreating || isUpdating;
  const error = isCreatingError || isUpdatingError;

  return (
    <DialogModalSecondary
      width="560px"
      height="100%"
      maxHeight="616px"
      loading={loading}
      isOpened={isOpened}
      approveTitle={t('add')}
      approveDisabled={loading}
      errorMessage={error ? t('save_error') : undefined}
      Header={
        <ModalHeader>
          <HeaderIconWrapper>{getMiniPbxIconByType(providerType)}</HeaderIconWrapper>

          {`${t(`providers.${providerType}`)} – ${sipRegistration ? t('edit_sip_registration') : t('add_sip_registration')}`}
        </ModalHeader>
      }
      onClose={onClose}
      onApprove={handleApprove}
    >
      <FocusTrap>
        <Root>
          {!sipRegistration && account && (
            <>
              <Annotation>{t('annotation')}</Annotation>

              <VoximplantBillingManagementLink />

              <Delimiter />
            </>
          )}

          <SipRegistrationModalFormItem label={t('name')}>
            <MyInput
              model={form.name}
              variant="outlined"
              disableAutocomplete
              placeholder={t('placeholders.name')}
            />
          </SipRegistrationModalFormItem>

          <SipRegistrationModalFormItem label={t('provider')}>
            <MySelect
              withinPortal
              model={form.type}
              options={providerOptions}
              variant="outlined-without-active-shadow"
            />
          </SipRegistrationModalFormItem>

          <SipRegistrationModalFormItem label={t('users')} hint={t('users_hint')}>
            <UsersMultiselect
              withinPortal
              model={form.userIds}
              users={userStore.activeUsers}
              variant="outlined-without-active-shadow"
              placeholder={t('placeholders.all_users')}
            />
          </SipRegistrationModalFormItem>

          <SipRegistrationModalFormItem label={t('proxy')}>
            <MyInput
              model={form.proxy}
              variant="outlined"
              disableAutocomplete
              placeholder={t('placeholders.proxy')}
            />
          </SipRegistrationModalFormItem>

          <SipRegistrationModalFormItem label={t('sip_user_name')}>
            <MyInput
              variant="outlined"
              disableAutocomplete
              model={form.sipUserName}
              placeholder={t('placeholders.sip_user_name')}
            />
          </SipRegistrationModalFormItem>

          <SipRegistrationModalFormItem label={t('password')}>
            <MyInput
              type="password"
              variant="outlined"
              disableAutocomplete
              model={form.password}
              placeholder={t('placeholders.password')}
            />
          </SipRegistrationModalFormItem>

          <SipRegistrationModalFormItem label={t('outbound_proxy')}>
            <MyInput
              variant="outlined"
              disableAutocomplete
              model={form.outboundProxy}
              placeholder={t('placeholders.outbound_proxy')}
            />
          </SipRegistrationModalFormItem>

          <SipRegistrationModalFormItem label={t('auth_user')} hint={t('auth_user_hint')}>
            <MyInput
              variant="outlined"
              disableAutocomplete
              model={form.authUser}
              placeholder={t('placeholders.auth_user')}
            />
          </SipRegistrationModalFormItem>

          {sipRegistration?.registration && account && (
            <>
              <Delimiter />

              <VoximplantBillingManagementLink />

              <LastUpdatedAnnotation>
                {t('last_updated', {
                  lastUpdated: sipRegistration.registration.lastUpdated,
                })}
              </LastUpdatedAnnotation>
            </>
          )}
        </Root>
      </FocusTrap>
    </DialogModalSecondary>
  );
});

AddSipRegistrationModal.displayName = 'AddSipRegistrationModal';
export { AddSipRegistrationModal };

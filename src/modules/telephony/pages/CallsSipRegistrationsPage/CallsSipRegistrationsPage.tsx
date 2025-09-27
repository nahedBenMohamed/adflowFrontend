import { appStore, PBX_PROVIDER_TYPE_QUERY_PARAM } from '@/app';
import { RequestSetupFormButton, SettingsPageTemplate } from '@/modules/settings';
import { CommonQueryParams, DefaultLoader, EmptyTableBlock, type Nullable } from '@/shared';
import { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetVoximplantSIPRegistrationsExpanded } from '../../api';
import { PbxProviderType, type VoximplantSIP } from '../../shared';
import {
  AddSipRegistrationModal,
  CallsSipRegistrationsPageTitle,
  SipRegistrationItem,
} from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-bottom: 16px;
`;

const RegistrationsList = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoaderWrapper = styled.div`
  margin-top: 240px;
`;

const CallsSipRegistrationsPage = () => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_sip_registrations_page',
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const addModalOpened = searchParams.get(CommonQueryParams.ADD) === 'true';
  const pbxProviderTypeFromParams = searchParams.get(PBX_PROVIDER_TYPE_QUERY_PARAM);
  const pbxProviderType = pbxProviderTypeFromParams
    ? (pbxProviderTypeFromParams as PbxProviderType)
    : PbxProviderType.UNKNOWN;

  const [currentSipRegistration, setCurrentSipRegistration] =
    useState<Nullable<VoximplantSIP>>(null);

  const { data: sipRegistrations, isLoading: areSipRegistrationsLoading } =
    useGetVoximplantSIPRegistrationsExpanded({ refetchInterval: 30 * 1000 });

  const handleOpenAddModal = useCallback(() => {
    setSearchParams(prev => {
      prev.set(CommonQueryParams.ADD, 'true');

      return prev;
    });
  }, [setSearchParams]);

  const getOpenEditModalHandler = useCallback(
    (sipRegistration: VoximplantSIP) => () => {
      flushSync(() => {
        setCurrentSipRegistration(sipRegistration);
      });

      handleOpenAddModal();
    },
    [setCurrentSipRegistration, handleOpenAddModal]
  );

  const handleCloseAddModal = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(CommonQueryParams.ADD);
      prev.delete(PBX_PROVIDER_TYPE_QUERY_PARAM);

      return prev;
    });

    setCurrentSipRegistration(null);
  }, [setSearchParams]);

  if (!appStore.isLoaded || areSipRegistrationsLoading)
    return (
      <SettingsPageTemplate>
        <Root>
          <CallsSipRegistrationsPageTitle openAddModal={handleOpenAddModal} />

          <LoaderWrapper>
            <DefaultLoader />
          </LoaderWrapper>
        </Root>
      </SettingsPageTemplate>
    );

  return (
    <SettingsPageTemplate
      Controls={<RequestSetupFormButton titleKey="request_telephony" />}
      pageTitleKey="settings.calls.sip_registrations"
      hideControlsDelimiter
    >
      <Root>
        <CallsSipRegistrationsPageTitle openAddModal={handleOpenAddModal} />

        <RegistrationsList>
          {sipRegistrations && sipRegistrations.length ? (
            sipRegistrations.map(r => (
              <SipRegistrationItem
                key={r.id}
                sipRegistration={r}
                handleOpenAddModal={getOpenEditModalHandler(r)}
              />
            ))
          ) : (
            <EmptyTableBlock $height="400px">{t('empty')}</EmptyTableBlock>
          )}
        </RegistrationsList>
      </Root>

      {addModalOpened && (
        <AddSipRegistrationModal
          isOpened={addModalOpened}
          sipRegistration={currentSipRegistration}
          providerType={currentSipRegistration?.type ?? pbxProviderType}
          onClose={handleCloseAddModal}
        />
      )}
    </SettingsPageTemplate>
  );
};

CallsSipRegistrationsPage.displayName = 'CallsSipRegistrationsPage';
export { CallsSipRegistrationsPage };

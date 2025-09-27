import {
  RequestSetupFormButton,
  SettingsPageTitle,
  useCreateAccountApiAccess,
  useGetAccountApiAccess,
  useRecreateAccountApiAccess,
} from '@/modules/settings';
import {
  CopyButton,
  DefaultLoader,
  PlusPrimaryIcon,
  PrimaryButton,
  TruncateMixin,
  WarningModal,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-bottom: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RequestIntegrationWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Annotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const ApiKeyBlock = styled.li`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 12px 24px;
  border-radius: var(--border-radius-element);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${TruncateMixin}
`;

const ControlsButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ValueWrapper = styled.div`
  display: flex;
`;

const Value = styled.div`
  position: relative;

  line-height: 20px;
  word-break: break-all;
  font-family: var(--font-family-mono);
  color: var(--button-text-graphite-priory-text);

  padding-left: 8px;

  &::after {
    content: '••••••••••••••••••••••';

    position: absolute;
    inset: 0;
    left: 8px;

    background-color: var(--primary-statuses-white-0);
    transition: var(--transition-200);

    &:hover {
      cursor: pointer;
    }
  }

  &:hover::after {
    opacity: 0;

    z-index: -1;
  }
`;

const ApiAccessBlock = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.account_api_access_page',
  });

  const [isRecreateWarningOpened, { open: openRecreateWarning, close: closeRecreateWarning }] =
    useDisclosure(false);

  const { data: accountApiAccess, isLoading } = useGetAccountApiAccess();
  const { mutate: createAccountApiAccess, isPending: isCreating } = useCreateAccountApiAccess();
  const { mutate: recreateAccountApiAccess, isPending: isRecreating } =
    useRecreateAccountApiAccess();

  const handleRecreate = useCallback(() => {
    recreateAccountApiAccess();

    closeRecreateWarning();
  }, [closeRecreateWarning, recreateAccountApiAccess]);

  return (
    <>
      <Root>
        <TitleWrapper>
          <RequestIntegrationWrapper>
            <SettingsPageTitle>{t('title')}</SettingsPageTitle>

            <RequestSetupFormButton titleKey="request_api_integration" />
          </RequestIntegrationWrapper>

          <Annotation>{t('annotation')}</Annotation>
        </TitleWrapper>

        {isLoading ? (
          <DefaultLoader height="56px" />
        ) : (
          <>
            {!accountApiAccess ? (
              <PrimaryButton
                loading={isCreating}
                iconProps={{ Icon: <PlusPrimaryIcon /> }}
                onClick={createAccountApiAccess}
              >
                {t('create_api_key')}
              </PrimaryButton>
            ) : (
              <ApiKeyBlock>
                <ValueWrapper>
                  <CopyButton copyText={accountApiAccess.apiKey} />
                  <Value>{accountApiAccess.apiKey}</Value>
                </ValueWrapper>

                <ControlsButtonsWrapper>
                  <Annotation>
                    {t('created_at', {
                      date: accountApiAccess.createdAt.displayLong(),
                      time: accountApiAccess.createdAt.displayTime(),
                    })}
                  </Annotation>

                  <PrimaryButton
                    variant="empty-danger"
                    loading={isRecreating}
                    onClick={openRecreateWarning}
                  >
                    {t('recreate_api_key')}
                  </PrimaryButton>
                </ControlsButtonsWrapper>
              </ApiKeyBlock>
            )}
          </>
        )}
      </Root>

      {isRecreateWarningOpened && (
        <WarningModal
          icon="warning"
          maxHeight="100%"
          height="fit-content"
          onApprove={handleRecreate}
          title={t('warning_title')}
          approveLoading={isRecreating}
          onClose={closeRecreateWarning}
          isOpened={isRecreateWarningOpened}
          annotation={t('warning_annotation')}
          approveTitle={t('recreate_api_key')}
        />
      )}
    </>
  );
};

export { ApiAccessBlock };

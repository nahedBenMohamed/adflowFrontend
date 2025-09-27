import {
  CheckIcon,
  DeleteButton,
  envUtil,
  Hint,
  MiniLoader,
  MyTooltip,
  TruncateMixin,
} from '@/shared';
import { SpanWithEllipsis } from '@/shared/lib/components/SpanWithEllipsis/SpanWithEllipsis';
import { useDisclosure } from '@mantine/hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useDeleteVoximplantSIPRegistration } from '../../../../api';
import { getMiniPbxIconByType, type VoximplantSIP } from '../../../../shared';
import { DeleteSIPRegistrationWarningModal } from '../DeleteSIPRegistrationWarningModal/DeleteSIPRegistrationWarningModal';

const Root = styled.li`
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

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LeftBlock = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    cursor: pointer;
  }

  ${TruncateMixin}
`;

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 20px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  i {
    color: var(--button-text-graphite-secondary-text);
  }

  b {
    font-weight: 500;
  }
`;

const RemovedOrDetachedBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    cursor: pointer;
  }
`;

const ErrorMessageBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-red-default);

  ${TruncateMixin}
`;

const SipRegistrationName = styled(SpanWithEllipsis)`
  font-size: 16px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  sipRegistration: VoximplantSIP;
  handleOpenAddModal: () => void;
}

const SipRegistrationItem = (props: Props) => {
  const { sipRegistration, handleOpenAddModal } = props;

  const { id, type, registration } = sipRegistration;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_sip_registrations_page',
  });

  const { mutateAsync: deleteRegistration, isPending: isDeleting } =
    useDeleteVoximplantSIPRegistration();

  const [deleteWarningOpened, { open: showDeleteWarning, close: hideDeleteWarning }] =
    useDisclosure(false);

  const handleDeleteRegistration = useCallback(async (): Promise<void> => {
    await deleteRegistration(id);

    hideDeleteWarning();
  }, [deleteRegistration, id, hideDeleteWarning]);

  return (
    <Root>
      <LeftBlock onClick={handleOpenAddModal}>
        <IconWrapper title={t(`providers.${type}`)}>{getMiniPbxIconByType(type)}</IconWrapper>

        <SipRegistrationName medium text={sipRegistration.name} />

        {registration &&
          (registration.successful === 'true' ? (
            <MyTooltip label={t('registration_successful')}>
              <CheckIconWrapper>
                <CheckIcon />
              </CheckIconWrapper>
            </MyTooltip>
          ) : registration.errorMessage ? (
            <ErrorMessageBlock>
              <SpanWithEllipsis text={registration.errorMessage} />

              <Hint text={t('error_annotation')} />
            </ErrorMessageBlock>
          ) : (
            <MiniLoader color="var(--button-text-graphite-secondary-text)" size="small" />
          ))}
      </LeftBlock>

      <RightBlock>
        {registration ? (
          <>
            <b>{registration.sipUsername}</b>

            <i>{registration.proxy}</i>
          </>
        ) : (
          <RemovedOrDetachedBlockWrapper>
            <i>{t('removed_or_detached')}</i>

            <Hint as="span" text={t('removed_or_detached_hint', { mail: envUtil.appDemoEmail })} />
          </RemovedOrDetachedBlockWrapper>
        )}

        <DeleteButton onClick={showDeleteWarning} />

        {deleteWarningOpened && (
          <DeleteSIPRegistrationWarningModal
            isDeleting={isDeleting}
            isOpened={deleteWarningOpened}
            onClose={hideDeleteWarning}
            onApprove={handleDeleteRegistration}
          />
        )}
      </RightBlock>
    </Root>
  );
};

export { SipRegistrationItem };

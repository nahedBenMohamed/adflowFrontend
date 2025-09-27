import { EmptyTableBlock, PrimaryButton, TableSkeleton } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  CreateVoximplantNumberDto,
  invalidateVoximplantPhoneNumbersInCache,
  useGetVoximplantAvailablePhoneNumbers,
  useGetVoximplantPhoneNumbers,
  useGetVoximplantUsers,
  voximplantNumbersApi,
} from '../../../../../api';
import {
  useGetVoximplantNumbersBlockData,
  useVoximplantNumbersBlockColumns,
  type VoximplantNumber,
  type VoximplantNumberRow,
} from '../../../../../shared';
import { VoximplantNumbersBlockTable } from '../VoximplantNumbersBlockTable/VoximplantNumbersBlockTable';

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AnnotationsWrapper = styled(TitleWrapper)`
  gap: 2px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-priory-text);
`;

const Annotation = styled.p<{ $medium?: boolean }>`
  font-size: 14px;
  line-height: 20px;
  font-weight: ${p => (p.$medium ? 500 : 400)};
  color: var(--button-text-graphite-primary-text);
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const VoximplantNumbersBlock = observer(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page',
  });

  const { data: voximplantUsers, isLoading: areVoximplantUsersLoading } = useGetVoximplantUsers();

  // all numbers -> numbers, which are stored in our database, might be out of sync with Voximplant application state
  const { data: numbers, isLoading: areNumbersLoading } = useGetVoximplantPhoneNumbers({});

  // available numbers -> numbers, which are attached to Voximplant application, we're getting them from Voximplant application
  const {
    data: availableNumbers,
    isLoading: areAvailableNumbersLoading,
    refetch: refetchAvailableNumbers,
  } = useGetVoximplantAvailablePhoneNumbers();

  const [isConnectingAllNumbers, setIsConnectingAllNumbers] = useState(false);
  const [isSynchronizingWithVoximplant, setIsSynchronizingWithVoximplant] = useState(false);

  const columns = useVoximplantNumbersBlockColumns(voximplantUsers);
  const data = useGetVoximplantNumbersBlockData({ numbers: numbers, availableNumbers });

  const numbersBlockTable = useReactTable<VoximplantNumberRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const loading = useMemo<boolean>(
    () => areNumbersLoading || areAvailableNumbersLoading || areVoximplantUsersLoading,
    [areNumbersLoading, areAvailableNumbersLoading, areVoximplantUsersLoading]
  );

  const handleConnectAllAvailableNumbers = useCallback(async (): Promise<void> => {
    const promises: Promise<VoximplantNumber>[] = [];

    data.forEach(r => {
      if (!r.isConnected && r.isExistsInVoximplant)
        promises.push(
          voximplantNumbersApi.createVoximplantPhoneNumber(
            new CreateVoximplantNumberDto({
              externalId: r.externalId,
              phoneNumber: r.phoneNumber,
            })
          )
        );
    });

    try {
      setIsConnectingAllNumbers(true);

      await Promise.all(promises);

      await invalidateVoximplantPhoneNumbersInCache();
      refetchAvailableNumbers();
    } catch (e) {
      throw new Error(`Failed to connect all available numbers: ${e}`);
    } finally {
      setIsConnectingAllNumbers(false);
    }
  }, [data, refetchAvailableNumbers]);

  // synchronize with Voximplant -> delete all non existing numbers, connect all available numbers
  const handleSynchronizeWithVoximplant = useCallback(async (): Promise<void> => {
    const promises: Promise<unknown>[] = [];

    data.forEach(r => {
      if (!r.isExistsInVoximplant && r.id)
        promises.push(voximplantNumbersApi.deleteVoximplantPhoneNumber(r.id));

      if (!r.isConnected && r.isExistsInVoximplant)
        promises.push(
          voximplantNumbersApi.createVoximplantPhoneNumber(
            new CreateVoximplantNumberDto({
              externalId: r.externalId,
              phoneNumber: r.phoneNumber,
            })
          )
        );
    });

    try {
      setIsSynchronizingWithVoximplant(true);

      await Promise.all(promises);

      await invalidateVoximplantPhoneNumbersInCache();
      refetchAvailableNumbers();
    } catch (e) {
      throw new Error(`Failed to synchronize with Voximplant: ${e}`);
    } finally {
      setIsSynchronizingWithVoximplant(false);
    }
  }, [data, refetchAvailableNumbers]);

  const showConnectAllAvailableNumbers = useMemo<boolean>(
    () => data.some(d => d.isExistsInVoximplant && !d.isConnected),
    [data]
  );

  const showSynchronizeWithVoximplant = useMemo<boolean>(
    () => data.some(d => !d.isExistsInVoximplant && d.id) && showConnectAllAvailableNumbers,
    [showConnectAllAvailableNumbers, data]
  );

  return (
    <>
      <TitleWrapper>
        <Title>{t('phone_numbers')}</Title>

        <AnnotationsWrapper>
          <Annotation>{t('phone_numbers_annotation1')}</Annotation>
          <Annotation>{t('phone_numbers_annotation2')}</Annotation>

          <Annotation $medium>{t('phone_numbers_annotation3')}</Annotation>
        </AnnotationsWrapper>
      </TitleWrapper>

      {loading ? (
        <TableSkeleton
          small
          headRowProps={{
            $backgroundColor: 'var(--graphite-graphite-20)',
          }}
        />
      ) : data.length > 0 ? (
        <>
          <VoximplantNumbersBlockTable
            loading={isConnectingAllNumbers}
            numbersBlockTable={numbersBlockTable}
          />

          {(showConnectAllAvailableNumbers || showSynchronizeWithVoximplant) && (
            <ControlsWrapper>
              {showConnectAllAvailableNumbers && (
                <PrimaryButton
                  loading={isConnectingAllNumbers}
                  disabled={isConnectingAllNumbers}
                  onClick={handleConnectAllAvailableNumbers}
                >
                  {t('connect_all_available_phone_numbers')}
                </PrimaryButton>
              )}

              {showSynchronizeWithVoximplant && (
                <PrimaryButton
                  variant="outlined"
                  loading={isSynchronizingWithVoximplant}
                  disabled={isSynchronizingWithVoximplant}
                  onClick={handleSynchronizeWithVoximplant}
                >
                  {t('synchronise_with_vx')}
                </PrimaryButton>
              )}
            </ControlsWrapper>
          )}
        </>
      ) : (
        <EmptyTableBlock $height="240px">{t('empty_phone_numbers')}</EmptyTableBlock>
      )}
    </>
  );
});

VoximplantNumbersBlock.displayName = 'VoximplantNumbersBlock';
export { VoximplantNumbersBlock };

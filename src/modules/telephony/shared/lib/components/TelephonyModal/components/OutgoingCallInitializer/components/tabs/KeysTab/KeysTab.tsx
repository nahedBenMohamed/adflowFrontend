import { generalSettingsStore } from '@/app';
import {
  EntityApiUtil,
  FieldType,
  Language,
  MiniLoader,
  MySelect,
  TruncateMixin,
  debounce,
  type EntityInfo,
  type Nullable,
  type Option,
  type SelectModel,
} from '@/shared';
import { useDidUpdate, useDisclosure, useWindowEvent } from '@mantine/hooks';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';
import { voximplantConnectorStore } from '../../../../../../../../../store';
import { formatTelephonyPhoneNumber } from '../../../../../../../helpers';
import {
  CallFromNumber,
  CallFromSipRegId,
  type VoximplantNumber,
  type VoximplantSIP,
} from '../../../../../../../models';
import type { SetLastCallFromHandler } from '../../../../../../../types';
import { CallButton } from '../../../../../../Buttons/CallButton/CallButton';
import { BackspaceButton } from '../../BackspaceButton/BackspaceButton';
import { DigitButton } from '../../DigitButton/DigitButton';
import { PotentialEntitiesLinksBlock } from './components';

const Root = styled.div<{ $smallGap: boolean }>`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  padding: 32px;

  ${TruncateMixin}
`;

const DigitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const CallButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  grid-column: 1 / 3;
`;

const BackspaceButtonWrapper = styled.div`
  grid-column: 3 / 4;
`;

const PhoneInputWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  ${TruncateMixin}
`;

const shakingAnimation = keyframes`
  0% {
    transform: translateX(-2px);
  }

  25% {
    transform: translateX(2px);
  }

  50% {
    transform: translateX(-2px);
  }

  75% {
    transform: translateX(2px);
  }

  100% {
    transform: translateX(-2px);
  }
`;

const PhoneInput = styled.input<{ $invalid: boolean }>`
  outline: none;

  width: 100%;

  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);

  background-color: transparent;
  transition: color var(--transition-200);

  &:hover {
    cursor: default;
  }

  ${p =>
    p.$invalid &&
    css`
      color: var(--button-text-red-default);

      animation: ${shakingAnimation} 0.3s linear;
    `}
`;

const LoadingVoximplantNumbersBlock = styled.div`
  height: 28px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoNumbersAnnotation = styled.p`
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);
`;

const YouOutgoingNumberAnnotation = styled(NoNumbersAnnotation)`
  position: absolute;
  top: 10px;
  left: 50%;

  transform: translateX(-50%);
`;

interface PotentialEntityInfo {
  entityInfo: Nullable<EntityInfo>;
  linkedEntityInfo: Nullable<EntityInfo>;
}

interface Props {
  phoneNumber: string;
  callFromNumber: SelectModel;
  areVoximplantPhoneNumbersLoading: boolean;
  areVoximplantSipRegistrationsLoading: boolean;
  voximplantPhoneNumbers?: VoximplantNumber[];
  voximplantSipRegistrations?: VoximplantSIP[];
  handleSetLastCallFrom: SetLastCallFromHandler;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
}

const ALLOWED_KEYS = /^[0-9*#+]$/;

const KeysTab = observer((props: Props) => {
  const {
    phoneNumber,
    callFromNumber,
    areVoximplantPhoneNumbersLoading,
    areVoximplantSipRegistrationsLoading,
    voximplantPhoneNumbers,
    voximplantSipRegistrations,
    handleSetLastCallFrom,
    setPhoneNumber,
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.outgoing_call_initializer',
  });

  const phoneNumbersAndSipOptions = useMemo<Option<CallFromNumber | CallFromSipRegId>[]>(() => {
    const voximplantPhoneNumbersOptions =
      voximplantPhoneNumbers
        // to prevent legacy errors (cases where phoneNumber is an empty string)
        ?.filter(n => n.phoneNumber)
        .map(n => ({ label: n.phoneNumber, value: new CallFromNumber(n.phoneNumber) })) ?? [];

    const voximplantSipRegistrationsOptions: Option<CallFromSipRegId>[] = [];

    if (voximplantSipRegistrations)
      voximplantSipRegistrations.forEach(r =>
        voximplantSipRegistrationsOptions.push({
          label: r.name,
          value: new CallFromSipRegId(r.externalId),
        })
      );

    return [...voximplantPhoneNumbersOptions, ...voximplantSipRegistrationsOptions];
  }, [voximplantPhoneNumbers, voximplantSipRegistrations]);

  const formattedPhoneNumber = useMemo<string>(
    () => formatTelephonyPhoneNumber(phoneNumber),
    [phoneNumber]
  );

  const isRULocale = generalSettingsStore.accountSettings?.language === Language.RUSSIAN;

  const [potentialEntityInfo, setPotentialEntityInfo] = useState<PotentialEntityInfo>(() => ({
    entityInfo: null,
    linkedEntityInfo: null,
  }));

  const { entityInfo, linkedEntityInfo } = potentialEntityInfo;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedSearchEntity = useCallback(
    debounce(async (phoneNumber: string): Promise<void> => {
      if (phoneNumber.trim().length < 6) {
        setPotentialEntityInfo({
          entityInfo: null,
          linkedEntityInfo: null,
        });
      } else {
        const { entity, linked } = await EntityApiUtil.findOneEntityForCall({
          fieldType: FieldType.PHONE,
          fieldValue: phoneNumber,
        });

        setPotentialEntityInfo({
          entityInfo: entity,
          linkedEntityInfo: linked,
        });
      }
    }, 300),
    []
  );

  const handleDigitClick = useCallback(
    (digit: string) => {
      setPhoneNumber(prev => {
        // if ru locale -> replace first 8 with +7
        if (isRULocale && prev.length === 0 && digit === '8') return '+7';

        // place + before any digit unless it is * – control code symbol
        if (prev.length === 0 && digit !== '+' && digit !== '*') return '+' + digit;

        return prev + digit;
      });
    },
    [isRULocale, setPhoneNumber]
  );

  const handleBackspace = useCallback(() => {
    setPhoneNumber(prev => prev.slice(0, prev.length - 1));
  }, [setPhoneNumber]);

  const [phoneInvalidError, { open: showPhoneInvalidError, close: hidePhoneInvalidError }] =
    useDisclosure(false);

  const timeoutId = useRef<ReturnType<typeof setTimeout>>(null);

  const handlePhoneInvalidErrorIdle = useCallback((): void => {
    if (timeoutId.current) clearTimeout(timeoutId.current);

    showPhoneInvalidError();

    timeoutId.current = setTimeout(() => {
      hidePhoneInvalidError();
    }, 2000);
  }, [hidePhoneInvalidError, showPhoneInvalidError]);

  const handleStartOutgoingCall = useCallback(() => {
    if (voximplantConnectorStore.callState.call) {
      console.error(
        `Failed to start outgoing call, call already exists ${voximplantConnectorStore.callState.call.id()}, there must be only one active call at a time`
      );

      return;
    }

    if (!callFromNumber.value)
      throw new Error(
        `Failed to start outgoing call in KeysTab, callFromNumber is not specified: ${callFromNumber.value}`
      );

    if (
      phoneNumber.trim().length > 0 &&
      (phoneNumber.startsWith('*') || isValidPhoneNumber(phoneNumber))
    ) {
      const {
        setEntityInfo,
        setLinkedEntityInfo,
        startOutgoingCallFromNumber,
        startOutgoingCallFromSipRegistration,
      } = voximplantConnectorStore;

      const finalNumber =
        isRULocale && phoneNumber[0] === '8' ? `+7${phoneNumber.slice(1)}` : phoneNumber;

      if (callFromNumber.value instanceof CallFromNumber) {
        startOutgoingCallFromNumber({
          callToNumber: finalNumber,
          callFromNumber: callFromNumber.value.number,
        });
      } else if (callFromNumber.value instanceof CallFromSipRegId) {
        startOutgoingCallFromSipRegistration({
          callToNumber: finalNumber,
          callFromSipRegExternalId: callFromNumber.value.sipRegId,
        });
      } else {
        throw new Error(
          `Failed to start outgoing call from KeysTab, neither callFromNumber nor sipRegId is specified: ${callFromNumber.value}`
        );
      }

      handleSetLastCallFrom(callFromNumber.value);

      setEntityInfo(entityInfo);
      setLinkedEntityInfo(linkedEntityInfo);
    } else {
      handlePhoneInvalidErrorIdle();
    }
  }, [
    entityInfo,
    isRULocale,
    phoneNumber,
    callFromNumber,
    linkedEntityInfo,
    handleSetLastCallFrom,
    handlePhoneInvalidErrorIdle,
  ]);

  useWindowEvent('keydown', async (e): Promise<void> => {
    // meta + backspace -> clear number
    if (e.metaKey && e.key === 'Backspace') {
      setPhoneNumber('');
    } else if (e.key === 'Backspace') {
      handleBackspace();
      // enter and number is not empty -> call
    } else if (e.key === 'Enter') {
      e.preventDefault();

      handleStartOutgoingCall();
    } else if (ALLOWED_KEYS.test(e.key)) {
      handleDigitClick(e.key);
      // handle paste
    } else if ((e.ctrlKey && e.key === 'v') || (e.metaKey && e.key === 'v')) {
      e.preventDefault();

      const text = await navigator.clipboard.readText();

      // if text contains something other than ALLOWED_KEYS -> replace them with an empty string
      let digits = text
        .split('')
        .filter(d => ALLOWED_KEYS.test(d))
        .join('');

      if (isRULocale && digits[0] === '8') digits = `+7${digits.slice(1)}`;

      if (isValidPhoneNumber(`+${digits}`) && digits[0] !== '*') digits = `+${digits}`;

      setPhoneNumber(digits);
    }
  });

  useDidUpdate(() => {
    handleDebouncedSearchEntity(phoneNumber);
  }, [phoneNumber]);

  const loading = areVoximplantSipRegistrationsLoading || areVoximplantPhoneNumbersLoading;

  return (
    <Root $smallGap={Boolean(entityInfo)}>
      <PhoneInputWrapper>
        {loading ? (
          <LoadingVoximplantNumbersBlock>
            <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
          </LoadingVoximplantNumbersBlock>
        ) : phoneNumbersAndSipOptions.length > 0 ? (
          <>
            <YouOutgoingNumberAnnotation>{t('outgoing_number')}</YouOutgoingNumberAnnotation>

            <MySelect
              withinPortal
              variant="empty"
              position="bottom"
              titleMinWidth={0}
              model={callFromNumber}
              dropdownMinWidth="340px"
              options={phoneNumbersAndSipOptions}
              disabled={areVoximplantPhoneNumbersLoading}
            />
          </>
        ) : (
          <NoNumbersAnnotation>{t('no_available_phone_numbers')}</NoNumbersAnnotation>
        )}

        <PhoneInput
          readOnly
          type="phone"
          value={formattedPhoneNumber}
          $invalid={phoneInvalidError}
        />

        <PotentialEntitiesLinksBlock entityInfo={entityInfo} linkedEntityInfo={linkedEntityInfo} />
      </PhoneInputWrapper>

      <DigitsGrid>
        {new Array(9).fill(0).map((_, idx) => (
          <DigitButton key={idx} onClick={() => handleDigitClick((idx + 1).toString())}>
            {idx + 1}
          </DigitButton>
        ))}

        <DigitButton onClick={() => handleDigitClick('*')}>*</DigitButton>
        <DigitButton onClick={() => handleDigitClick('0')}>0</DigitButton>
        <DigitButton onClick={() => handleDigitClick('#')}>#</DigitButton>

        <CallButtonWrapper>
          <CallButton disabled={!callFromNumber.value} onClick={handleStartOutgoingCall} />
        </CallButtonWrapper>

        <BackspaceButtonWrapper>
          <BackspaceButton onClick={handleBackspace} />
        </BackspaceButtonWrapper>
      </DigitsGrid>
    </Root>
  );
});

KeysTab.displayName = 'KeysTab';
export { KeysTab };

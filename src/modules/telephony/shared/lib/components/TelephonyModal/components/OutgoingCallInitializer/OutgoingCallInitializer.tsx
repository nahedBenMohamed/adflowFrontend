import { SettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import { Nullable, SelectModel } from '@/shared';
import { Tabs } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import styled from 'styled-components';
import {
  useGetVoximplantPhoneNumbers,
  useGetVoximplantSIPRegistrations,
} from '../../../../../../api';
import {
  CallFromNumber,
  CallFromSipRegId,
  OutgoingCallInitializerTabs,
  VOXIMPLANT_NUMBERS_SETTINGS_KEY,
  type VoximplantNumbersSettings,
} from '../../../../models';
import type { SetLastCallFromHandler } from '../../../../types';
import { KeysTab, OutgoingCallInitializerTabsListHeader, RecentCallsTab } from './components';

const Root = styled(Tabs)`
  position: relative;

  height: calc(100% - var(--telephony-header-height));

  display: flex;
  flex-direction: column;
`;

interface Props {
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
}

const RECENT_TAB_STYLES = {
  height: 'calc(100% - var(--telephony-call-initializer-header-height)',
};

const OutgoingCallInitializer = observer((props: Props) => {
  const { phoneNumber, setPhoneNumber } = props;

  const { settings: voximplantNumbersSettings } =
    SettingsStore.getSettingsStore<VoximplantNumbersSettings>(VOXIMPLANT_NUMBERS_SETTINGS_KEY);

  const { user: currentUser } = authStore;
  const accessibleUserId = currentUser?.id;

  const [activeTab, setActiveTab] = useState<OutgoingCallInitializerTabs>(
    OutgoingCallInitializerTabs.KEYS
  );

  const { data: voximplantPhoneNumbers, isLoading: areVoximplantPhoneNumbersLoading } =
    useGetVoximplantPhoneNumbers({ accessibleUserId });
  const { data: voximplantSipRegistrations, isLoading: areVoximplantSipRegistrationsLoading } =
    useGetVoximplantSIPRegistrations({ accessibleUserId });

  const callFromNumber = useLocalObservable<SelectModel>(() => SelectModel.create());

  useEffect(() => {
    if (areVoximplantPhoneNumbersLoading || areVoximplantSipRegistrationsLoading) return;

    // if last call was made from SIP registration and it exists set it as default
    if (
      voximplantNumbersSettings.lastCallFromSipRegId &&
      voximplantSipRegistrations?.find(
        r => r.externalId === voximplantNumbersSettings.lastCallFromSipRegId
      )
    ) {
      callFromNumber.setValue(new CallFromSipRegId(voximplantNumbersSettings.lastCallFromSipRegId));

      return;
    }

    // to prevent legacy errors (cases where phoneNumber is an empty string)
    const filteredVoximplantPhoneNumbers = voximplantPhoneNumbers?.filter(n => n.phoneNumber);
    const firstVoximplantPhoneNumber = filteredVoximplantPhoneNumbers?.[0];

    // check if number selected no longer exists (e.g. modal was opened while number preferences were changed in settings)
    const numberNoLongerExists =
      filteredVoximplantPhoneNumbers &&
      callFromNumber.value &&
      !filteredVoximplantPhoneNumbers.find(n => n.phoneNumber === callFromNumber.value);

    // check if users already called from specific number and it still exists
    const hasExistingSavedCallFromNumber =
      voximplantNumbersSettings.lastCallFromNumber &&
      filteredVoximplantPhoneNumbers?.find(
        n => n.phoneNumber === voximplantNumbersSettings.lastCallFromNumber
      );

    if (numberNoLongerExists) {
      if (hasExistingSavedCallFromNumber && voximplantNumbersSettings.lastCallFromNumber) {
        callFromNumber.setValue(new CallFromNumber(voximplantNumbersSettings.lastCallFromNumber));
      } else if (firstVoximplantPhoneNumber) {
        callFromNumber.setValue(new CallFromNumber(firstVoximplantPhoneNumber.phoneNumber));
      } else {
        callFromNumber.setValue(null);
      }

      return;
    }

    if (hasExistingSavedCallFromNumber && voximplantNumbersSettings.lastCallFromNumber) {
      callFromNumber.setValue(new CallFromNumber(voximplantNumbersSettings.lastCallFromNumber));

      return;
    }

    // set first number as default
    if (filteredVoximplantPhoneNumbers && firstVoximplantPhoneNumber && !callFromNumber.value)
      callFromNumber.setValue(new CallFromNumber(firstVoximplantPhoneNumber.phoneNumber));
  }, [
    callFromNumber,
    voximplantPhoneNumbers,
    voximplantSipRegistrations,
    areVoximplantPhoneNumbersLoading,
    areVoximplantSipRegistrationsLoading,
    voximplantNumbersSettings.lastCallFromNumber,
    voximplantNumbersSettings.lastCallFromSipRegId,
  ]);

  const handleChangeTab = useCallback((value: Nullable<string>) => {
    if (value) setActiveTab(value as OutgoingCallInitializerTabs);
  }, []);

  const handleSetLastCallFrom = useCallback<SetLastCallFromHandler>(
    callFrom => {
      if (callFrom instanceof CallFromNumber) {
        voximplantNumbersSettings.lastCallFromNumber = callFrom.number;
        voximplantNumbersSettings.lastCallFromSipRegId = null;

        return;
      }

      if (callFrom instanceof CallFromSipRegId) {
        voximplantNumbersSettings.lastCallFromSipRegId = callFrom.sipRegId;
        voximplantNumbersSettings.lastCallFromNumber = null;
      }
    },
    [voximplantNumbersSettings]
  );

  return (
    <Root value={activeTab} onChange={handleChangeTab}>
      <OutgoingCallInitializerTabsListHeader />

      <Tabs.Panel value={OutgoingCallInitializerTabs.KEYS}>
        <KeysTab
          phoneNumber={phoneNumber}
          callFromNumber={callFromNumber}
          voximplantPhoneNumbers={voximplantPhoneNumbers}
          voximplantSipRegistrations={voximplantSipRegistrations}
          areVoximplantPhoneNumbersLoading={areVoximplantPhoneNumbersLoading}
          areVoximplantSipRegistrationsLoading={areVoximplantSipRegistrationsLoading}
          setPhoneNumber={setPhoneNumber}
          handleSetLastCallFrom={handleSetLastCallFrom}
        />
      </Tabs.Panel>

      <Tabs.Panel value={OutgoingCallInitializerTabs.RECENT} style={RECENT_TAB_STYLES}>
        <RecentCallsTab
          callFromNumber={callFromNumber}
          handleSetLastCallFrom={handleSetLastCallFrom}
        />
      </Tabs.Panel>
    </Root>
  );
});

OutgoingCallInitializer.displayName = 'OutgoingCallInitializer';
export { OutgoingCallInitializer };

import { CallStatus, type CallDirection } from '@/modules/telephony';
import type { EntityInfo } from '@/shared';
import type { ReactNode } from 'react';
import { CallIncomingIcon, CallMissedIcon, CallOutgoingIcon } from '../../../../assets';
import type { CallParticipant } from '../../../models';
import { ContactParticipant, UserParticipant } from '../RowParticipantCellSwitch/components';

const RowParticipantCellSwitch = ({
  userId,
  direction,
  status,
  participant,
  phoneNumber,
  currentPathname,
  entityInfo,
}: {
  userId: number;
  status: CallStatus;
  currentPathname: string;
  direction: CallDirection;
  participant: CallParticipant;
  phoneNumber?: string;
  entityInfo?: EntityInfo;
}): ReactNode => {
  const callIcon: ReactNode =
    participant === 'caller' ? (
      <CallOutgoingIcon />
    ) : status === CallStatus.MISSED ||
      status === CallStatus.FAILED ||
      status === CallStatus.CANCELED ? (
      <CallMissedIcon />
    ) : (
      <CallIncomingIcon />
    );

  switch (participant) {
    case 'caller': {
      if (direction === 'outgoing') {
        return <UserParticipant callIcon={callIcon} userId={userId} />;
      } else {
        return (
          <ContactParticipant
            callIcon={callIcon}
            entityInfo={entityInfo}
            phoneNumber={phoneNumber}
            currentPathname={currentPathname}
          />
        );
      }
    }

    case 'callee': {
      if (direction === 'outgoing') {
        return (
          <ContactParticipant
            callIcon={callIcon}
            entityInfo={entityInfo}
            phoneNumber={phoneNumber}
            currentPathname={currentPathname}
          />
        );
      } else {
        return <UserParticipant callIcon={callIcon} userId={userId} />;
      }
    }

    default:
      throw new Error(
        `Failed to generate participant cell for call ${JSON.stringify({
          userId,
          status,
          direction,
          participant,
          phoneNumber,
          entityInfo,
        })}`
      );
  }
};

export { RowParticipantCellSwitch };

import type { ReactNode } from 'react';
import { CallIncomingIcon, CallMissedIcon, CallOutgoingIcon } from '../../assets';
import { CallType } from '../models';

interface CallItemIconAndStatus {
  icon: ReactNode;
  status: string;
}

export const getCallItemIconAndStatus = (callType: CallType): CallItemIconAndStatus => {
  switch (callType) {
    case CallType.INCOMING:
      return {
        icon: <CallIncomingIcon />,
        status: 'incoming_call',
      };

    case CallType.MISSED:
      return {
        icon: <CallMissedIcon />,
        status: 'missed_call',
      };

    case CallType.OUTGOING_MISSED:
      return {
        icon: <CallMissedIcon />,
        status: 'outgoing_call',
      };

    case CallType.OUTGOING:
    default:
      return {
        icon: <CallOutgoingIcon />,
        status: 'outgoing_call',
      };
  }
};

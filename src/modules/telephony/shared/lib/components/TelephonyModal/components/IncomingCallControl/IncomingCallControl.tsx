import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useGetVoximplantUsers } from '../../../../../../api';
import { useTelephonyContext } from '../../../../../../context';
import { voximplantConnectorStore } from '../../../../../../store';
import type { TelephonyButtonSize } from '../../../../types';
import { AcceptCallButton } from '../../../Buttons/AcceptCallButton/AcceptCallButton';
import { AddToCallButton } from '../../../Buttons/AddToCallButton/AddToCallButton';
import { HangUpButton } from '../../../Buttons/HangUpButton/HangUpButton';
import { MuteButton } from '../../../Buttons/MuteButton/MuteButton';
import { TransferButton } from '../../../Buttons/TransferButton/TransferButton';
import { CallControlTemplate } from '../CallControlTemplate/CallControlTemplate';

interface Props {
  connected: boolean;
  phoneNumber: string;
}

const IncomingCallControl = observer((props: Props) => {
  const { connected, phoneNumber } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.incoming_call_control',
  });

  const { folded, fold, hide } = useTelephonyContext();

  const {
    callState: { muted, entityInfo, linkedEntityInfo, callFromSipRegExternalId },
    acceptCall,
    toggleMuteMicrophone,
  } = voximplantConnectorStore;

  const { data: voximplantUsers } = useGetVoximplantUsers();

  const buttonSize: TelephonyButtonSize = folded ? 'small' : 'large';

  return (
    <CallControlTemplate
      folded={folded}
      connected={connected}
      callFromNumber={null}
      entityInfo={entityInfo}
      phoneNumber={phoneNumber}
      callFromSipRegExternalId={null}
      connectingText={t('incoming_call')}
      linkedEntityInfo={linkedEntityInfo}
      Controls={
        <>
          {/* Transfer calls logic when using SIP Registration is currently not implemented */}
          {!callFromSipRegExternalId && (
            <TransferButton
              size={buttonSize}
              label={t('transfer')}
              disabled={!connected}
              voximplantUsers={voximplantUsers}
            />
          )}

          <AddToCallButton disabled size={buttonSize} label={t('add_to_call')} />

          {connected && (
            <MuteButton
              active={muted}
              size={buttonSize}
              label={muted ? t('unmute') : t('mute')}
              onClick={toggleMuteMicrophone}
            />
          )}

          {!connected && (
            <AcceptCallButton size={buttonSize} label={t('accept')} onClick={acceptCall} />
          )}

          <HangUpButton
            size={buttonSize}
            label={connected ? t('end_call') : t('decline')}
            onClick={hide}
          />
        </>
      }
      fold={fold}
    />
  );
});

IncomingCallControl.displayName = 'IncomingCallControl';
export { IncomingCallControl };

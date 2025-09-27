import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useGetVoximplantUsers } from '../../../../../../api';
import { useTelephonyContext } from '../../../../../../context';
import { voximplantConnectorStore } from '../../../../../../store';
import type { TelephonyButtonSize } from '../../../../types';
import { AddToCallButton } from '../../../Buttons/AddToCallButton/AddToCallButton';
import { HangUpButton } from '../../../Buttons/HangUpButton/HangUpButton';
import { MuteButton } from '../../../Buttons/MuteButton/MuteButton';
import { TransferButton } from '../../../Buttons/TransferButton/TransferButton';
import { CallControlTemplate } from '../CallControlTemplate/CallControlTemplate';

interface Props {
  connected: boolean;
  phoneNumber: string;
}

const ActiveCallControl = observer((props: Props) => {
  const { connected, phoneNumber } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.active_call_control',
  });

  const { folded, fold } = useTelephonyContext();

  const {
    callState: {
      tone,
      muted,
      entityInfo,
      callFromNumber,
      linkedEntityInfo,
      callFromSipRegExternalId,
    },
    hangupCall,
    toggleMuteMicrophone,
  } = voximplantConnectorStore;

  const { data: voximplantUsers } = useGetVoximplantUsers();

  const buttonSize: TelephonyButtonSize = folded ? 'small' : 'large';

  return (
    <CallControlTemplate
      tone={tone}
      folded={folded}
      connected={connected}
      entityInfo={entityInfo}
      phoneNumber={phoneNumber}
      connectingText={t('calling')}
      callFromNumber={callFromNumber}
      callFromSipRegExternalId={callFromSipRegExternalId}
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

          <MuteButton
            active={muted}
            size={buttonSize}
            label={muted ? t('unmute') : t('mute')}
            onClick={toggleMuteMicrophone}
          />

          <HangUpButton size={buttonSize} label={t('end_call')} onClick={hangupCall} />
        </>
      }
      fold={fold}
    />
  );
});

ActiveCallControl.displayName = 'ActiveCallControl';
export { ActiveCallControl };

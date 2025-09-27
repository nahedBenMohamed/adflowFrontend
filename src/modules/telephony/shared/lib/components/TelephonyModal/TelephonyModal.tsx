import { TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useTelephonyContext } from '../../../../context';
import { voximplantConnectorStore } from '../../../../store';
import type { TelephonyModalPosition, TelephonyModalSize } from '../../models';
import { ModalBoundsUtil } from '../../utils';
import {
  ActiveCallControl,
  DraggableTelephonyControl,
  IncomingCallControl,
  OutgoingCallInitializer,
  TelephonyModalHeader,
} from './components';

const Root = styled.div`
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;

  pointer-events: none;
  z-index: var(--modal-z-index);
`;

const Content = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  ${TruncateMixin}
`;

const TelephonyModal = observer(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal',
  });

  const { opened, folded, modalTransitionable, transitionDurationMs, unfold, flushTransitionable } =
    useTelephonyContext();

  const {
    callState: { connected, started, type, call, entityInfo },
  } = voximplantConnectorStore;

  const [phoneNumber, setPhoneNumber] = useState('');

  const [modalSize, setModalSize] = useState<TelephonyModalSize>(
    () => ModalBoundsUtil.defaultModalSize
  );
  const [modalPosition, setModalPosition] = useState<TelephonyModalPosition>(
    () => ModalBoundsUtil.defaultModalPosition
  );

  useLayoutEffect(() => {
    // we don't want any modal transition when call is incoming, moreover, applying transition to incoming call
    // modal causes animation side effects because modal is transitioning from default size to active size which is
    // very unfortunate when it was not initially opened
    if (type !== 'incoming') flushTransitionable();

    if (started) {
      setModalSize(ModalBoundsUtil.activeCallModalSize);
    } else {
      unfold();

      setPhoneNumber('');

      setModalSize(ModalBoundsUtil.defaultModalSize);
    }
  }, [started, type, unfold, flushTransitionable]);

  useLayoutEffect(() => {
    if (folded) {
      setModalSize(ModalBoundsUtil.foldedModalSize);

      setModalPosition(ModalBoundsUtil.foldedModalPosition);
    } else {
      setModalSize(
        connected || started
          ? ModalBoundsUtil.activeCallModalSize
          : ModalBoundsUtil.defaultModalSize
      );

      setModalPosition(ModalBoundsUtil.defaultModalPosition);
    }
  }, [folded, connected, started]);

  useLayoutEffect(() => {
    // clear phone number when modal is closed

    if (opened) setPhoneNumber('');
  }, [opened]);

  return opened ? (
    <Root>
      <DraggableTelephonyControl
        folded={folded}
        modalSize={modalSize}
        modalPosition={modalPosition}
        transitionable={modalTransitionable}
        transitionDurationMs={transitionDurationMs}
        setModalPosition={setModalPosition}
      >
        <Content>
          <TelephonyModalHeader
            canFold={started}
            entityName={entityInfo?.name}
            displayPhone={
              // if call is outgoing we want to display number that user is calling to,
              // otherwise we want to display number of the incoming caller
              folded && type === 'outgoing' ? phoneNumber : call?.displayName()
            }
          />

          {started ? (
            type === 'incoming' ? (
              call && <IncomingCallControl phoneNumber={call.displayName()} connected={connected} />
            ) : (
              <ActiveCallControl
                connected={connected}
                phoneNumber={
                  call ? call.settings.number : phoneNumber ? phoneNumber : t('unknown_number')
                }
              />
            )
          ) : (
            <OutgoingCallInitializer phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
          )}
        </Content>
      </DraggableTelephonyControl>
    </Root>
  ) : null;
});

TelephonyModal.displayName = 'TelephonyModal';
export { TelephonyModal };

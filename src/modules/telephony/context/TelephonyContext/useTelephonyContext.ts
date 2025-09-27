import { useCallback, useContext } from 'react';
import { flushSync } from 'react-dom';
import { voximplantConnectorStore } from '../../store';
import { TelephonyContext } from './TelephonyContext';

interface UseTelephonyContextResult {
  opened: boolean;
  folded: boolean;
  modalTransitionable: boolean;
  transitionDurationMs: number;
  toggleFolded: () => void;
  hide: () => void;
  show: () => void;
  fold: () => void;
  unfold: () => void;
  flushTransitionable: () => void;
}

const transitionDurationMs = 200;

export const useTelephonyContext = (): UseTelephonyContextResult => {
  const value = useContext(TelephonyContext);

  if (!value) {
    throw new Error('useTelephonyContext must be used within a <TelephonyProvider.Provider>');
  }

  const { opened, folded, modalTransitionable, setModalTransitionable, setOpened, setFolded } =
    value;

  // to apply transition on DraggableTelephonyControl so that fold/unfold animation is smooth
  const flushTransitionable = useCallback(() => {
    // we need to queueMicrotask to potentially call this function in lifecycle methods
    queueMicrotask(() => {
      flushSync(() => {
        setModalTransitionable(true);
      });
    });

    setTimeout(() => {
      flushSync(() => {
        setModalTransitionable(false);
      });
    }, transitionDurationMs);
  }, [setModalTransitionable]);

  const toggleFolded = useCallback(() => {
    flushTransitionable();
    setFolded(prev => !prev);
  }, [setFolded, flushTransitionable]);

  const hide = useCallback(() => {
    setOpened(false);

    const {
      callState: { connected, started },
      hangupCall,
    } = voximplantConnectorStore;

    if (connected || started) hangupCall();
  }, [setOpened]);

  const fold = useCallback(() => {
    flushTransitionable();
    setFolded(true);
  }, [setFolded, flushTransitionable]);

  const show = useCallback(() => {
    setOpened(true);
  }, [setOpened]);

  const unfold = useCallback(() => {
    flushTransitionable();
    setFolded(false);
  }, [setFolded, flushTransitionable]);

  return {
    opened,
    folded,
    modalTransitionable,
    transitionDurationMs,
    hide,
    show,
    fold,
    unfold,
    toggleFolded,
    flushTransitionable,
  };
};

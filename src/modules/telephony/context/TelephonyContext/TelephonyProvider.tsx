import { appStore } from '@/app';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { voximplantConnectorStore } from '../../store';
import { TelephonyContext, type TelephonyContextValue } from './TelephonyContext';

interface Props {
  children: ReactNode;
}

export const TelephonyProvider = observer((props: Props) => {
  const { children } = props;

  const [opened, setOpened] = useState<boolean>(false);
  const [folded, setFolded] = useState<boolean>(false);
  const [modalTransitionable, setModalTransitionable] = useState<boolean>(false);

  const contextValue: TelephonyContextValue = useMemo(
    () => ({
      opened,
      folded,
      modalTransitionable,
      setOpened,
      setFolded,
      setModalTransitionable,
    }),
    [opened, folded, modalTransitionable]
  );

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        voximplantConnectorStore.setOpenerFn(setOpened);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStore.isLoaded]);

  return <TelephonyContext.Provider value={contextValue}>{children}</TelephonyContext.Provider>;
});

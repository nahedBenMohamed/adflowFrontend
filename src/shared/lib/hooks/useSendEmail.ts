import { useDisclosure } from '@mantine/hooks';
import { useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import type { NullableObject } from '../types';

type EmailModalData = {
  email: string;
};

export const useSendEmail = (): {
  emailModalData: NullableObject<EmailModalData>;
  isSendEmailModalOpened: boolean;
  openSendEmailModal(email: string): void;
  hideSendEmailModal(): void;
} => {
  const [isSendEmailModalOpened, { close: hideSendEmailModal, open: showSendEmailModal }] =
    useDisclosure(false);

  const emailModalData = useLocalObservable<
    NullableObject<EmailModalData> & {
      setEmail(email: string): void;
    }
  >(() => ({
    email: null,
    setEmail(email: string) {
      this.email = email;
    },
  }));

  const openSendEmailModal = useCallback(
    (email: string) => {
      if (email.trim().length > 0) emailModalData.setEmail(email);

      showSendEmailModal();
    },
    [emailModalData, showSendEmailModal]
  );

  return {
    emailModalData,
    isSendEmailModalOpened,
    openSendEmailModal,
    hideSendEmailModal,
  };
};

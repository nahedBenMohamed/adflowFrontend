import type { Nullable, Optional } from '@/shared';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MailMessage } from '../../../shared';
import { mailboxSettingsStore } from '../../../store';

export const useMessageControls = ({
  message,
  firstMessageSentFrom,
  showSendEmailModal,
}: {
  message: Nullable<MailMessage>;
  firstMessageSentFrom: Nullable<string>;
  showSendEmailModal: () => void;
}) => {
  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.hooks.use_message_controls',
  });

  const [replyToMessageId, setReplyToMessageId] = useState<Optional<number>>();
  const [replyTo, setReplyTo] = useState<Nullable<string[]>>(null);
  const [subject, setSubject] = useState<Optional<string>>();
  const [headerTitle, setHeaderTitle] = useState<Optional<string>>();
  const [toWhom, setToWhom] = useState<string[]>([]);

  const handleReply = useCallback(() => {
    if (!message) return;

    showSendEmailModal();

    if (message.replyTo) setReplyTo(message.replyTo);

    const mailboxName = mailboxSettingsStore.getById(message.mailboxId).email;

    let receiver = message.sentFrom;

    // if user accidentally tries to reply to himself in thread, set toWhom to
    // the thread initiator
    if (mailboxName === receiver && firstMessageSentFrom) receiver = firstMessageSentFrom;

    setToWhom(receiver ? [receiver] : []);
    setHeaderTitle(`${t('reply_to')} ${receiver}`);

    setReplyToMessageId(message.id);
    setSubject(`Re: ${message.subject}`);
  }, [firstMessageSentFrom, message, showSendEmailModal, t]);

  const handleReplyAll = useCallback(() => {
    if (!message) return;

    showSendEmailModal();

    setHeaderTitle(`${t('reply_all')}, ${message.sentFrom || t('unknown')}`);

    if (message.replyTo) {
      if (message.cc) {
        setReplyTo([...message.replyTo, ...message.cc]);
      } else {
        setReplyTo(message.replyTo);
      }
    }

    if (message.cc) {
      setToWhom(message.sentFrom ? [message.sentFrom, ...message.cc] : message.cc);
    } else {
      setToWhom(message.sentFrom ? [message.sentFrom] : []);
    }

    setReplyToMessageId(message.id);
    setSubject(`Re: ${message.subject}`);
  }, [message, showSendEmailModal, t]);

  const handleForward = useCallback(() => {
    if (!message) return;

    showSendEmailModal();

    setHeaderTitle(`${t('forward')} "${message.subject}"`);
    setToWhom([]);
    setSubject(`Fwd: ${message.subject}`);
    setReplyToMessageId(message.id);
  }, [message, showSendEmailModal, t]);

  return {
    toWhom,
    replyTo,
    subject,
    headerTitle,
    replyToMessageId,
    handleReply,
    handleForward,
    handleReplyAll,
  };
};

import { CreateIcon, RoundButton } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { MessageIcon, SendEmailModal } from '../../../../shared';

const CreateMessageButton = () => {
  const [isOpened, { close: hide, open: show }] = useDisclosure(false);

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.create_message_button',
  });

  return (
    <>
      <RoundButton Icon={<CreateIcon />} label={t('title')} onClick={show} />

      {isOpened && (
        <SendEmailModal
          isOpened={isOpened}
          onClose={hide}
          headerTitle={
            <>
              <MessageIcon />
              {t('title')}
            </>
          }
        />
      )}
    </>
  );
};

export { CreateMessageButton };

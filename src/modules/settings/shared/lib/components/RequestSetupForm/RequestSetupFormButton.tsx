import type { RequestSetupFormTitleKey } from '@/modules/settings';
import { PrimaryButton } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { RequestSetupFormModal } from './components';

interface Props {
  titleKey: RequestSetupFormTitleKey;
}

const RequestSetupFormButton = (props: Props) => {
  const { titleKey } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.request_setup_form.button',
  });

  const [isOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <PrimaryButton variant="highlighted" onClick={open}>
        {t(titleKey)}
      </PrimaryButton>

      {isOpened && (
        <RequestSetupFormModal isOpened={isOpened} titleKey={titleKey} onClose={close} />
      )}
    </>
  );
};

export { RequestSetupFormButton };

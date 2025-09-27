import { DialogModalSecondary, envUtil } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  padding: 16px 32px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  opened: boolean;
  onClose: () => void;
}

const ImportInBackgroundInfoModal = (props: Props) => {
  const { opened, onClose } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.settings_button.import_in_background_info_modal',
  });

  return (
    <DialogModalSecondary
      hideCancel
      maxHeight="230px"
      isOpened={opened}
      Header={t('title')}
      approveTitle={t('ok')}
      onClose={onClose}
    >
      <Root>{t('content', { company: envUtil.appName })}</Root>
    </DialogModalSecondary>
  );
};

export { ImportInBackgroundInfoModal };

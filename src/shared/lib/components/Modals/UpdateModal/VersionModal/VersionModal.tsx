import { useGetLatestFrontendVersionPolling } from '@/app';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { envUtil } from '../../../../utils';
import { UpdateModal } from '../UpdateModal';

const VersionModal = memo(() => {
  const { t } = useTranslation('common', {
    keyPrefix: 'version_modal',
  });

  const { data: latestFrontendVersion } = useGetLatestFrontendVersionPolling(__APP_VERSION__);

  return (
    <UpdateModal
      mounted={Boolean(latestFrontendVersion)}
      title={t('title', { company: envUtil.appName })}
      annotation={t('annotation', { version: latestFrontendVersion?.version })}
      update={t('update')}
    />
  );
});

VersionModal.displayName = 'VersionModal';
export { VersionModal };

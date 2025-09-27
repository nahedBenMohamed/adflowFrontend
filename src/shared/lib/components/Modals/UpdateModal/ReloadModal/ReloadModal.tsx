import { useGetLatestFrontendVersionPolling, watchdogStore } from '@/app';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateModal } from '../UpdateModal';

const ReloadModal = observer(() => {
  const { t } = useTranslation('common', {
    keyPrefix: 'reload_modal',
  });

  const { data: latestFrontendVersion } = useGetLatestFrontendVersionPolling(__APP_VERSION__);
  const { isSessionStale } = watchdogStore;

  const mounted = useMemo(
    () => !latestFrontendVersion && isSessionStale,
    [latestFrontendVersion, isSessionStale]
  );

  return (
    <UpdateModal
      mounted={mounted}
      title={t('title')}
      annotation={t('annotation')}
      update={t('update')}
    />
  );
});

ReloadModal.displayName = 'ReloadModal';
export { ReloadModal };

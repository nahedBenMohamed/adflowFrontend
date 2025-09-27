import { appStore } from '@/app';
import { MultichatModal } from '@/modules/multichat';
import { NotesModal } from '@/modules/notes';
import { TelephonyModal } from '@/modules/telephony';
import { ErrorBoundary, PageTracker, ReloadModal, ToastContainer, VersionModal } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';

const AppBoundary = observer(() => {
  return (
    <ErrorBoundary>
      <PageTracker />
      <Outlet />

      {appStore.isLoaded && (
        <>
          <ToastContainer />
          <MultichatModal />
          <NotesModal />
          <TelephonyModal />
          <VersionModal />
          <ReloadModal />
        </>
      )}
    </ErrorBoundary>
  );
});

AppBoundary.displayName = 'AppBoundary';
export { AppBoundary };

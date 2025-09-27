import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SectionView, WholePageLoaderWithLogo } from '../../../shared';
import { routes } from '../../routes';
import { appStore, entityTypeStore } from '../../store';

export const HomePage = observer(() => {
  const navigate = useNavigate();

  const redirect = useCallback((): void => {
    const firstEt = entityTypeStore.getAvailableEntityTypes()[0];

    if (!firstEt) {
      navigate(routes.timeBoard());

      return;
    }

    if (firstEt.section.view === SectionView.BOARD) {
      navigate(routes.boardSection({ entityTypeId: firstEt.id }), {
        replace: true,
      });

      return;
    }

    navigate(routes.listSection(firstEt.id), { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (appStore.isLoaded) redirect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStore.isLoaded]);

  if (authStore.user && authStore.user.isPartner())
    return <Navigate to={routes.partnerInfo(authStore.user.id)} />;

  return <WholePageLoaderWithLogo />;
});

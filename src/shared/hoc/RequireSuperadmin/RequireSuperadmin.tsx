import { observer } from 'mobx-react-lite';
import { type ReactElement, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { routes } from '../../../app/routes/routes';
import { authStore } from '../../../modules/auth/store/AuthStore';
import { RequireAuth } from '../RequireAuth/RequireAuth';

interface Props {
  children: ReactElement;
}

export const RequireSuperadmin = observer((props: Props) => {
  const { children } = props;

  const { pathname } = useLocation();

  const currentUser = authStore.user;

  if (!currentUser) {
    return <Navigate to={routes.login} replace state={{ path: pathname }} />;
  }

  const hasAccess = currentUser.isPlatformAdmin;

  return hasAccess ? (
    children
  ) : (
    <Navigate to={routes.forbiddenPage} replace state={{ path: pathname }} />
  );
});

export const WithSuperadminRole = (
  Component: (...props: any[]) => ReactNode,
  checkSubscription = true
) => {
  return (
    <RequireAuth checkSubscription={checkSubscription}>
      <RequireSuperadmin>
        <Component />
      </RequireSuperadmin>
    </RequireAuth>
  );
};

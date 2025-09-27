import { observer } from 'mobx-react-lite';
import { type ReactElement, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { routes } from '../../../app/routes/routes';
import { authStore } from '../../../modules/auth/store/AuthStore';
import { UserRole } from '../../lib/models/User/UserRole';
import { RequireAuth } from '../RequireAuth/RequireAuth';

interface Props {
  children: ReactElement;
  roles: UserRole[];
}

export const RequireRole = observer((props: Props) => {
  const { children, roles } = props;

  const { pathname } = useLocation();

  const currentUser = authStore.user;

  if (!currentUser) {
    return <Navigate to={routes.login} replace state={{ path: pathname }} />;
  }

  const hasRole = roles.includes(currentUser.role);

  return hasRole ? (
    children
  ) : (
    <Navigate to={routes.forbiddenPage} replace state={{ path: pathname }} />
  );
});

export const WithAdminRole = (
  Component: (...props: any[]) => ReactNode,
  checkSubscription = true
) => {
  return (
    <RequireAuth checkSubscription={checkSubscription}>
      <RequireRole roles={[UserRole.ADMIN, UserRole.OWNER]}>
        <Component />
      </RequireRole>
    </RequireAuth>
  );
};

export const WithPartnerRole = (
  Component: (...props: any[]) => ReactNode,
  checkSubscription = true
) => {
  return (
    <RequireAuth checkSubscription={checkSubscription}>
      <RequireRole roles={[UserRole.PARTNER]}>
        <Component />
      </RequireRole>
    </RequireAuth>
  );
};

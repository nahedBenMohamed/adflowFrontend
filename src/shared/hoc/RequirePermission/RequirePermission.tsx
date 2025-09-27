import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import type { ComponentType, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  type Nullable,
  PermissionObjectType,
  SectionView,
  useTypedParams,
  WholePageLoaderWithLogo,
} from '../../lib';
import { RequireAuth } from '../RequireAuth/RequireAuth';

type PermissionType = 'view' | 'reports' | 'dashboard';

interface RequirePermissionProps {
  children: ReactElement;
  permissionType: PermissionType;
  objectType: PermissionObjectType;
  objectId: Nullable<number>;
}

const RequirePermission = observer((props: RequirePermissionProps) => {
  const { children, permissionType, objectType, objectId } = props;

  const { pathname } = useLocation();

  if (authStore.isLoading) return <WholePageLoaderWithLogo />;

  const { user: currentUser } = authStore;

  if (!currentUser) return <Navigate to={routes.login} replace state={{ path: pathname }} />;

  const hasPermission =
    permissionType === 'view'
      ? currentUser.canView(objectType, objectId)
      : permissionType === 'reports'
        ? currentUser.canViewReport(objectType, objectId)
        : permissionType === 'dashboard'
          ? currentUser.canViewDashboard(objectType, objectId)
          : false;

  return hasPermission ? (
    children
  ) : (
    <Navigate to={routes.forbiddenPage} replace state={{ path: pathname }} />
  );
});

interface RequireEntityTypePermissionProps {
  children: ReactElement;
  permissionType: PermissionType;
  checkTab?: SectionView;
}

const RequireEntityTypePermission = (props: RequireEntityTypePermissionProps) => {
  const { children, permissionType, checkTab } = props;

  const { entityTypeId, tab } = useTypedParams<{
    tab: SectionView;
    entityTypeId: number;
  }>();

  return tab === checkTab ? (
    <RequirePermission
      permissionType={permissionType}
      objectType={PermissionObjectType.ENTITY_TYPE}
      objectId={entityTypeId}
    >
      {children}
    </RequirePermission>
  ) : (
    children
  );
};

const RequireSchedulerPermission = (props: RequireEntityTypePermissionProps) => {
  const { children, permissionType, checkTab } = props;

  const { scheduleId, tab } = useTypedParams<{
    tab: SectionView;
    scheduleId: number;
  }>();

  return checkTab === tab ? (
    <RequirePermission
      permissionType={permissionType}
      objectType={PermissionObjectType.SCHEDULE}
      objectId={scheduleId}
    >
      {children}
    </RequirePermission>
  ) : (
    children
  );
};

export const WithViewEntityReportPermission = (Component: ComponentType) => {
  return (
    <RequireAuth checkSubscription={true}>
      <RequireEntityTypePermission permissionType="reports" checkTab={SectionView.REPORTS}>
        <Component />
      </RequireEntityTypePermission>
    </RequireAuth>
  );
};

export const WithViewSchedulerReportPermission = (Component: ComponentType) => {
  return (
    <RequireAuth checkSubscription={false}>
      <RequireSchedulerPermission permissionType="reports" checkTab={SectionView.REPORTS}>
        <Component />
      </RequireSchedulerPermission>
    </RequireAuth>
  );
};

import { subscriptionStore } from '@/app';
import { routes } from '@/app/routes/routes';
import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import type { ComponentType, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  CommonQueryParams,
  SubscriptionPeriodOverModal,
  UriCodingUtil,
  WholePageLoaderWithLogo,
} from '../../lib';

interface Props {
  children: ReactElement;
  checkSubscription: boolean;
}

export const WithAuth = (Component: ComponentType, checkSubscription: boolean = true) => {
  return (
    <RequireAuth checkSubscription={checkSubscription}>
      <Component />
    </RequireAuth>
  );
};

const emptyCallback = () => {};

const RequireAuth = observer((props: Props) => {
  const { children, checkSubscription } = props;

  const { pathname, search } = useLocation();

  const { isLoading, isAuthenticated } = authStore;

  const isSubscriptionValid = subscriptionStore.isValid;

  if (isLoading) return <WholePageLoaderWithLogo />;

  return isAuthenticated ? (
    <>
      {children}

      {checkSubscription && (
        <SubscriptionPeriodOverModal isOpened={!isSubscriptionValid} onClose={emptyCallback} />
      )}
    </>
  ) : (
    <Navigate
      replace
      state={{ path: pathname, search }}
      to={`${routes.login}${search}${search ? '&' : '?'}${CommonQueryParams.REDIRECT_PATH}=${UriCodingUtil.encode(pathname)}`}
    />
  );
});

export { RequireAuth };

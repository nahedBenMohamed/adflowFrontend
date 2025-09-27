import { routes } from '@/app';
import { CommonQueryParams, WholePageLoaderWithLogo } from '@/shared';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authStore } from '../../store';

const LoginLinkPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const login = async (): Promise<void> => {
      // currently, this is used for wazzup wauth integration, redirect path in that case would
      // be /settings/integrations and params will include state value
      const loginLink = searchParams.get(CommonQueryParams.LOGIN_LINK);
      const redirectPath = searchParams.get(CommonQueryParams.REDIRECT_PATH);

      const searchParamsWithoutRedirectAndLoginLink = new URLSearchParams(searchParams);
      searchParamsWithoutRedirectAndLoginLink.delete(CommonQueryParams.LOGIN_LINK);
      searchParamsWithoutRedirectAndLoginLink.delete(CommonQueryParams.REDIRECT_PATH);

      if (!loginLink) {
        navigate(routes.login);

        return;
      }

      await authStore.decodeLoginLink(loginLink);

      if (redirectPath && searchParamsWithoutRedirectAndLoginLink) {
        navigate(`${redirectPath}?${searchParamsWithoutRedirectAndLoginLink.toString()}`);
      } else {
        navigate(routes.root);
      }
    };

    login();
  }, [searchParams, navigate]);

  return <WholePageLoaderWithLogo />;
};

export { LoginLinkPage };

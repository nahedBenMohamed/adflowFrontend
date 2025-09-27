import { routes } from '@/app';
import { useLayoutEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GOOGLE_CODE_PARAM_KEY, GOOGLE_STATE_PARAM_KEY } from '../../shared';

const GoogleCalendarRedirectPage = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useLayoutEffect(() => {
    const code = searchParams.get(GOOGLE_CODE_PARAM_KEY);
    const state = searchParams.get(GOOGLE_STATE_PARAM_KEY) || undefined;

    if (code) {
      navigate(routes.settingsIntegrationsGoogleCalendarConnect({ code, state }));
    } else {
      throw new Error(`Failed to extract state param from the URL`);
    }
  }, [searchParams, navigate]);

  return null;
};

export { GoogleCalendarRedirectPage };

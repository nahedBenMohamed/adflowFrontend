import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GTMUtil } from '../utils';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    GTMUtil.sendAnalyticsEvent('page_view');
  }, [location.pathname, location.search]);
};

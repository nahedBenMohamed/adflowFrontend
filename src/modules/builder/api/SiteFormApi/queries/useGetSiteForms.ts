import { useQuery } from '@tanstack/react-query';
import { BUILDER_QUERY_KEYS } from '../../BuilderQueryKeys';
import { siteFormApi } from '../SiteFormApi';

export const useGetSiteForms = () =>
  useQuery({
    queryKey: BUILDER_QUERY_KEYS.siteForms(),
    queryFn: siteFormApi.getSiteForms,
  });
